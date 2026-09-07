// content_script.js - 色彩校正逻辑和自定义快捷键监听 (最终修复版)

// 当前应用的滤镜设置（用于跟踪状态）
let currentFilterSettings = {
  mode: 'protanomaly',
  intensity: 50,
  enabled: true,
  saturation: 100,
  contrast: 100,
  shortcut: { ctrl: false, alt: true, shift: true, key: 'C' },
  filterShortcut: { ctrl: false, alt: true, shift: true, key: 'F' }
};
let applyTimer = null;
let lastApplied = { mode: null, intensity: null, saturation: null, contrast: null, filterValue: null };

// =========================================================================
// A. 色彩校正矩阵生成器 (单矩阵融合模式 - 终极兼容方案)
// =========================================================================

// Version Marker

// 5x5 矩阵乘法: A * B
// 输入: 两个长度为 20 的一维数组 (代表 4x5 矩阵，最后一行默认为 0 0 0 1 0)
// 输出: 长度为 20 的一维数组
function multiplyMatrices(a, b) {
    // 将一维数组转换为 5x5 矩阵 (添加最后一行 0 0 0 0 1)
    // 注意：SVG feColorMatrix 的输入是 4x5 (RGBA + Offset)，
    // 运算时我们要把它视为 5x5 齐次矩阵：
    // [ R0 R1 R2 R3 R4 ]
    // [ G0 G1 G2 G3 G4 ]
    // [ B0 B1 B2 B3 B4 ]
    // [ A0 A1 A2 A3 A4 ]
    // [ 0  0  0  0  1  ]
    
    const to5x5 = (m) => [
        [m[0], m[1], m[2], m[3], m[4]],
        [m[5], m[6], m[7], m[8], m[9]],
        [m[10], m[11], m[12], m[13], m[14]],
        [m[15], m[16], m[17], m[18], m[19]],
        [0, 0, 0, 0, 1]
    ];

    const A = to5x5(a);
    const B = to5x5(b);
    const R = Array(5).fill(0).map(() => Array(5).fill(0));

    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            let sum = 0;
            for (let k = 0; k < 5; k++) {
                sum += A[r][k] * B[k][c];
            }
            R[r][c] = sum;
        }
    }

    // 转回 4x5 一维数组
    const result = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 5; c++) {
            result.push(R[r][c]);
        }
    }
    return result;
}

// 生成饱和度矩阵 (W3C 标准)
function getSaturationMatrix(s) {
    // s: 0~N, 1 is default
    const r = 0.213, g = 0.715, b = 0.072;
    return [
        r + (1 - r) * s, g - g * s,       b - b * s,       0, 0,
        r - r * s,       g + (1 - g) * s, b - b * s,       0, 0,
        r - r * s,       g - g * s,       b + (1 - b) * s, 0, 0,
        0,               0,               0,               1, 0
    ];
}

// 生成对比度矩阵
function getContrastMatrix(c) {
    // c: 0~N, 1 is default
    const o = 0.5 * (1 - c);
    return [
        c, 0, 0, 0, o,
        0, c, 0, 0, o,
        0, 0, c, 0, o,
        0, 0, 0, 1, 0
    ];
}

function updateSVGFilterElement(matrixValuesStr, saturation, contrast) {
    const svgId = 'color-corrector-svg-container';
    let svgContainer = document.getElementById(svgId);

    if (!svgContainer) {
        svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgContainer.id = svgId;
        svgContainer.style.position = 'fixed';
        svgContainer.style.top = '-9999px';
        svgContainer.style.left = '-9999px';
        svgContainer.style.width = '0';
        svgContainer.style.height = '0';
        svgContainer.style.pointerEvents = 'none';
        svgContainer.style.zIndex = '-1';
        (document.body || document.documentElement).appendChild(svgContainer);
    }

    const timestamp = Date.now();
    const filterId = `color-corrector-filter-${timestamp}`;
    
    // 清理旧的 filter 元素
    while (svgContainer.firstChild) {
        svgContainer.removeChild(svgContainer.firstChild);
    }

    const filterEl = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filterEl.id = filterId;
    filterEl.setAttribute('x', '-20%');
    filterEl.setAttribute('y', '-20%');
    filterEl.setAttribute('width', '140%');
    filterEl.setAttribute('height', '140%');
    filterEl.setAttribute('color-interpolation-filters', 'sRGB');
    svgContainer.appendChild(filterEl);

    // 1. 准备基础矩阵
    const identity = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
    let cbMatrix = identity;
    if (matrixValuesStr) {
        // 使用正则分割，防止多余空格导致解析错误
        const parts = matrixValuesStr.trim().split(/\s+/).map(Number);
        if (parts.length === 20 && !parts.some(isNaN)) {
            cbMatrix = parts;
        } else {
            console.warn('[Filter] Matrix parsing failed, falling back to identity:', matrixValuesStr);
        }
    }

    // 2. 准备饱和度矩阵
    // 优化曲线：
    // 0-100: 线性映射到 0-1
    // 100-200: 线性映射到 1-3 (增强高饱和度潜力，最大3倍)
    let sInput = Number(saturation);
    if (isNaN(sInput)) sInput = 100;
    
    let s;
    if (sInput <= 100) {
        s = sInput / 100;
    } else {
        s = 1 + (sInput - 100) * 0.02; // (200-100)*0.02 = 2.0, 1+2=3.0
    }
    const satMatrix = getSaturationMatrix(s);

    // 3. 准备对比度矩阵
    // 优化曲线：
    // 0-100: 线性映射到 0-1
    // 100-200: 线性映射到 1-1.6 (降低高对比度敏感性，防止过曝，最大1.6倍)
    let cInput = Number(contrast);
    if (isNaN(cInput)) cInput = 100;
    
    let c;
    if (cInput <= 100) {
        c = cInput / 100;
    } else {
        c = 1 + (cInput - 100) * 0.006; // (200-100)*0.006 = 0.6, 1+0.6=1.6
    }
    const conMatrix = getContrastMatrix(c);
    
    // 4. 矩阵乘法融合 (Color * Saturation * Contrast)
    // 顺序很重要：先应用对比度，再饱和度，最后色盲校正 (或者反过来，视数学模型而定)
    // 这里的乘法顺序对应滤镜应用顺序：
    // Pixel -> [Contrast] -> [Saturation] -> [ColorCorrection] -> Screen
    // 矩阵运算是左乘还是右乘？SVG feColorMatrix 是 matrix * column_vector
    // 所以复合矩阵 M = M_color * M_sat * M_con
    
    let finalMatrix = multiplyMatrices(satMatrix, conMatrix); // S * C
    if (cbMatrix) {
        finalMatrix = multiplyMatrices(cbMatrix, finalMatrix); // CB * (S * C)
    }

    // 5. 检查计算结果是否合法 (NaN Check)
    if (finalMatrix.some(isNaN)) {
        console.error('[Filter] Matrix calculation produced NaN');
        return null;
    }

    // 5. 创建唯一的 feColorMatrix
    const feMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
    feMatrix.setAttribute('type', 'matrix');
    feMatrix.setAttribute('in', 'SourceGraphic');
    const matrixString = finalMatrix.map(v => v.toFixed(4)).join(' ');
    feMatrix.setAttribute('values', matrixString);
    filterEl.appendChild(feMatrix);
    
    // Debug output
    // console.log(`[Filter Debug] S:${s}% C:${c}% Matrix:`, matrixString);

    return `#${filterId}`;
}

function getMatrixValues(type, intensity) {
    intensity = Number(intensity);
    if (isNaN(intensity)) intensity = 0;
    
    if (type === 'off') {
        return null;
    }
    // ... (保持原有逻辑)
    intensity = Math.max(1, Math.min(100, intensity));
    const severityRaw = Math.pow(intensity / 100, 0.85);

    let matrix;
    switch (type) {
        case 'protanomaly':
            const pAEffect = severityRaw * 1.2;
            const pASeverity = Math.min(1.0, pAEffect);
            matrix = [
                1 - 0.433 * pASeverity, 0.433 * pASeverity, 0, 0, 0,
                0.558 * pASeverity, 1 - 0.558 * pASeverity, 0, 0, 0,
                0, 0.242 * pASeverity, 1 - 0.242 * pASeverity, 0, 0,
                0, 0, 0, 1, 0,
            ];
            break;
        case 'protanopia':
            const pBase = [0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0];
            matrix = pBase.map((v, i) => {
                const identity = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
                return identity[i] + (v - identity[i]) * severityRaw;
            });
            break;
        case 'deuteranomaly':
            const dAEffect = severityRaw * 1.2;
            const dASeverity = Math.min(1.0, dAEffect);
            matrix = [
                1 - 0.375 * dASeverity, 0.375 * dASeverity, 0, 0, 0,
                0.7 * dASeverity, 1 - 0.7 * dASeverity, 0, 0, 0,
                0, 0.3 * dASeverity, 1 - 0.3 * dASeverity, 0, 0,
                0, 0, 0, 1, 0,
            ];
            break;
        case 'deuteranopia':
            const dBase = [0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0];
            matrix = dBase.map((v, i) => {
                const identity = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
                return identity[i] + (v - identity[i]) * severityRaw;
            });
            break;
        case 'tritanomaly':
            const tAEffect = severityRaw * 1.2;
            const tASeverity = Math.min(1.0, tAEffect);
            matrix = [
                1 - 0.05 * tASeverity, 0.05 * tASeverity, 0, 0, 0,
                0, 1 - 0.567 * tASeverity, 0.567 * tASeverity, 0, 0,
                0, 0.475 * tASeverity, 1 - 0.475 * tASeverity, 0, 0,
                0, 0, 0, 1, 0,
            ];
            break;
        case 'tritanopia':
            const tBase = [0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1, 0];
            matrix = tBase.map((v, i) => {
                const identity = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
                return identity[i] + (v - identity[i]) * severityRaw;
            });
            break;
        default:
            return null;
    }
    return matrix.map(v => v.toFixed(4)).join(' ');
}

// 应用滤镜到页面
function applyFilterToPage(mode, intensity = 50, saturation = 100, contrast = 100) {
    intensity = Number(intensity);
    if (isNaN(intensity)) intensity = 50;
    saturation = Number(saturation);
    if (isNaN(saturation)) saturation = 100;
    contrast = Number(contrast);
    if (isNaN(contrast)) contrast = 100;
    
    intensity = Math.max(0, Math.min(100, intensity));
    
    const isColorCorrectionOff = (intensity === 0 || mode === 'off');
    const isEnhancementOff = (saturation === 100 && contrast === 100);

    if (isColorCorrectionOff && isEnhancementOff) {
        removeFilterFromPage();
        return;
    }

    // 1. 获取色盲矩阵值 (如果不应用色盲校正，则为 null)
    const matrixValues = getMatrixValues(mode, intensity);
    
    // 2. 更新 SVG 滤镜链（包含色盲、饱和度、对比度）
    // 返回的是相对 ID: #filter-id
    const filterId = updateSVGFilterElement(matrixValues, saturation, contrast);
    
    if (!filterId) {
        // 如果计算失败，可能是 matrixValues 有问题
        console.error('[Filter] Failed to generate SVG filter');
        return;
    }

    // 3. 应用到 HTML 元素
    // 回归使用相对 ID，因为绝对路径在 SPA 中有问题
    // 且我们已经将所有逻辑封装在 SVG 内部，不再依赖 CSS 组合
    const cssFilter = `url('${filterId}')`;
    
    // 如果已经应用了相同的设置，则跳过
    if (lastApplied.mode === mode && lastApplied.intensity === intensity && lastApplied.saturation === saturation && lastApplied.contrast === contrast) {
        // 但我们要确保 filter 属性还在（防止被页面覆盖）
        const currentFilter = document.documentElement.style.getPropertyValue('filter');
        if (currentFilter && currentFilter.includes(filterId)) {
            return;
        }
    }

    // 使用 setProperty 避免 CSP 问题，并支持 !important
    const docEl = document.documentElement;
    
    // 强制触发重排，确保浏览器应用新滤镜
    // void docEl.offsetHeight; 
    
    docEl.style.setProperty('filter', cssFilter, 'important');
    docEl.style.setProperty('-webkit-filter', cssFilter, 'important');
    docEl.style.setProperty('min-height', '100%', 'important');

    // 仅挂载到 <html>：对 html 的 filter 会作用于其全部后代
    // （body 背景、固定定位元素等），因此不再重复设置 body，
    // 避免同一页面被滤镜应用两次（双重增强）。


    lastApplied = { mode, intensity, saturation, contrast, filterValue: cssFilter };
}

// 移除滤镜
function removeFilterFromPage() {
    document.documentElement.style.removeProperty('filter');
    document.documentElement.style.removeProperty('-webkit-filter');
    document.documentElement.style.removeProperty('min-height');
    
    if (document.body) {
        document.body.style.removeProperty('filter');
        document.body.style.removeProperty('-webkit-filter');
    }
    
    // 清理旧的 style 标签
    const styleEl = document.getElementById('color-corrector-global-style');
    if (styleEl) styleEl.remove();

    // 清理 SVG 容器
    const svgContainer = document.getElementById('color-corrector-svg-container');
    if (svgContainer) svgContainer.remove();
    
    lastApplied = { mode: null, intensity: null, saturation: null, contrast: null, filterValue: null };
    if (applyTimer) { clearTimeout(applyTimer); applyTimer = null; }
}

function scheduleApplyFilterToPage(mode, intensity, saturation, contrast) {
  if (applyTimer) clearTimeout(applyTimer);
  const m = mode;
  let i = Number(intensity);
  if (isNaN(i)) i = 50;
  let s = Number(saturation);
  if (isNaN(s)) s = 100;
  let c = Number(contrast);
  if (isNaN(c)) c = 100;
  
  applyTimer = setTimeout(() => {
    applyTimer = null;
    applyFilterToPage(m, i, s, c);
  }, 60);
}


// =========================================================================
// B. 统一消息监听 (接收来自 popup.js 的设置)
// =========================================================================

function applySettingsWithDomainCheck() {
    const host = location.hostname || '';
    const intensity = Number(currentFilterSettings.intensity);
    
    let saturation = Number(currentFilterSettings.saturation);
    if (isNaN(saturation)) saturation = 100;
    
    let contrast = Number(currentFilterSettings.contrast);
    if (isNaN(contrast)) contrast = 100;
    
    // 基础开启条件：全局开启且（有强度 或 有增强）
    const hasEffect = intensity > 0 || saturation !== 100 || contrast !== 100;
    const globalOn = !!currentFilterSettings.enabled && hasEffect;
    
    chrome.storage.sync.get({ domainRulesMap: null }, (data) => {
        const map = data.domainRulesMap || {};
        const rule = map[host];
        
        let finalEnabled = globalOn;
        
        if (rule === 'off') {
            finalEnabled = false;
        } else if (rule === 'on') {
            // 强制开启，只要有效果
            finalEnabled = hasEffect;
        }
        
        if (finalEnabled) {
            scheduleApplyFilterToPage(currentFilterSettings.mode, intensity, saturation, contrast);
        } else {
            removeFilterFromPage();
        }
    });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
    let needsUpdate = false;
    if (areaName === 'local') {
        if (changes.enabled) { currentFilterSettings.enabled = changes.enabled.newValue; needsUpdate = true; }
        if (changes.colorMode) { currentFilterSettings.mode = changes.colorMode.newValue; needsUpdate = true; }
        if (changes.intensity) { currentFilterSettings.intensity = changes.intensity.newValue; needsUpdate = true; }
        if (changes.saturation) { currentFilterSettings.saturation = changes.saturation.newValue; needsUpdate = true; }
        if (changes.contrast) { currentFilterSettings.contrast = changes.contrast.newValue; needsUpdate = true; }
        if (changes.shortcut) { currentFilterSettings.shortcut = changes.shortcut.newValue; }
        if (changes.filterShortcut) { currentFilterSettings.filterShortcut = changes.filterShortcut.newValue; }
    }
    if (areaName === 'sync' && changes.domainRulesMap) {
        needsUpdate = true;
    }
    if (needsUpdate) applySettingsWithDomainCheck();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'UPDATE_ALL_SETTINGS') {
    currentFilterSettings = {
      mode: request.mode,
      intensity: request.intensity,
      enabled: request.enabled,
      saturation: request.saturation !== undefined ? request.saturation : 100,
      contrast: request.contrast !== undefined ? request.contrast : 100,
      shortcut: request.shortcut,
      filterShortcut: request.filterShortcut
    };
    applySettingsWithDomainCheck();
    sendResponse({ success: true, message: 'Settings applied with domain rules.' });
  }
  return true;
});


// =========================================================================
// C. 自定义快捷键监听逻辑
// =========================================================================

function isTypingElement(target) {
  const tag = target && target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) {
      if (tag === 'INPUT' && !['text', 'password', 'search', 'email', 'url', 'number', 'tel'].includes(target.type)) {
          return false;
      }
      return true;
  }
  return false;
}

let isShortcutActive = false;

function checkShortcutMatch(e, sc) {
  if (!sc || !sc.key) return false;
  const key = e.key.toUpperCase();
  return (
      key === sc.key &&
      !!e.ctrlKey === !!sc.ctrl &&
      !!e.altKey === !!sc.alt &&
      !!e.shiftKey === !!sc.shift
  );
}

window.addEventListener('keydown', (e) => {
  const target = e.target;
  if (isTypingElement(target)) {
      return;
  }

  const scPicker = currentFilterSettings.shortcut; 
  const scFilter = currentFilterSettings.filterShortcut;

  // 1. Check Filter Toggle Shortcut (Peek)
  if (checkShortcutMatch(e, scFilter)) {
      if (isShortcutActive) { e.preventDefault(); return; }
      isShortcutActive = true;
      console.log(`[Shortcut] Filter toggle triggered: ${e.key.toUpperCase()}`);
      e.preventDefault();
      
      // Toggle Global Enabled State
      const newEnabled = !currentFilterSettings.enabled;
      // Optimistically update local state to feel faster (optional, but storage sync is fast enough usually)
      // currentFilterSettings.enabled = newEnabled; 
      // applySettingsWithDomainCheck(); 
      
      chrome.storage.local.set({ enabled: newEnabled }, () => {
         // Notify user? Maybe a small toast in content script?
         // For now, no UI feedback in content script, just the filter change.
      });
      return;
  }

  // 2. Check Color Picker Shortcut
  if (checkShortcutMatch(e, scPicker)) {
      if (isShortcutActive) { e.preventDefault(); return; }
      isShortcutActive = true;
      console.log(`[Shortcut] Picker triggered: ${e.key.toUpperCase()}`);
      e.preventDefault();
      chrome.runtime.sendMessage({ action: 'pickColorFromPage' });
      return;
  }
}, true);

window.addEventListener('keyup', (e) => {
  const scPicker = currentFilterSettings.shortcut;
  const scFilter = currentFilterSettings.filterShortcut;
  
  if (checkShortcutMatch(e, scPicker) || checkShortcutMatch(e, scFilter)) {
      isShortcutActive = false;
  }
}, true);


// =========================================================================
// D. 页面加载初始化 (确保正确读取和应用)
// =========================================================================

// 页面加载时，从存储中读取设置并应用
chrome.storage.local.get(['colorMode', 'enabled', 'intensity', 'saturation', 'contrast', 'shortcut', 'filterShortcut'], (result) => {
  const savedMode = result.colorMode || 'protanomaly';
  const savedIntensity = result.intensity !== undefined ? Number(result.intensity) : 50;
  const savedSaturation = result.saturation !== undefined ? Number(result.saturation) : 100;
  const savedContrast = result.contrast !== undefined ? Number(result.contrast) : 100;
  const isEnabled = result.enabled !== false;
  const savedShortcut = result.shortcut || { ctrl: false, alt: true, shift: true, key: 'C' }; 
  const savedFilterShortcut = result.filterShortcut || { ctrl: false, alt: true, shift: true, key: 'F' };

  currentFilterSettings = {
    mode: savedMode,
    intensity: savedIntensity,
    enabled: isEnabled,
    saturation: savedSaturation,
    contrast: savedContrast,
    shortcut: savedShortcut,
    filterShortcut: savedFilterShortcut
  };
  const intensity = Number(savedIntensity);
  const saturation = Number(savedSaturation);
  const contrast = Number(savedContrast);
  const host = location.hostname || '';
  chrome.storage.sync.get({ domainRulesMap: null, domainPauseList: [], domainEnableOnlyList: [] }, (data) => {
    let map = data.domainRulesMap;
    if (!map) {
      map = {};
      (data.domainPauseList || []).forEach(d => { map[d] = 'off'; });
      (data.domainEnableOnlyList || []).forEach(d => { map[d] = 'on'; });
      chrome.storage.sync.set({ domainRulesMap: map });
    }
    const rule = map[host];
    const hasEffect = intensity > 0 || saturation !== 100 || contrast !== 100;
    let shouldEnable = isEnabled && hasEffect;
    
    if (rule === 'off') shouldEnable = false;
    else if (rule === 'on') shouldEnable = hasEffect;
    
    if (shouldEnable) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          scheduleApplyFilterToPage(savedMode, intensity, saturation, contrast);
        });
      } else {
        scheduleApplyFilterToPage(savedMode, intensity, saturation, contrast);
      }
    } else {
      removeFilterFromPage();
    }
  });
});
