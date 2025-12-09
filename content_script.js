// content_script.js - 色彩校正逻辑和自定义快捷键监听 (最终修复版)

// 当前应用的滤镜设置（用于跟踪状态）
let currentFilterSettings = {
  mode: 'protanomaly',
  intensity: 50,
  enabled: true,
  shortcut: { ctrl: false, alt: true, shift: true, key: 'C' }
};
let applyTimer = null;
let lastApplied = { mode: null, intensity: null, filterValue: null };

// =========================================================================
// A. 色彩校正矩阵生成器 (保持不变)
// =========================================================================

// ... [generateFilter 函数内容保持不变] ...
function generateFilter(type, intensity) {
  intensity = Number(intensity) || 0;
  if (type === 'off' || intensity <= 0) {
    return 'none';
  }
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
      return 'none';
  }
  
  const matrixString = matrix.map(v => v.toFixed(4)).join(' ');
  const svgContent = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg"><defs><filter id="colorMatrix" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${matrixString}"/></filter></defs></svg>`
  );
  
  return `url('data:image/svg+xml;charset=utf-8,${svgContent}#colorMatrix')`;
}

// 应用滤镜到页面
function applyFilterToPage(mode, intensity = 50) {
  intensity = Number(intensity) || 50;
  intensity = Math.max(1, Math.min(100, intensity));
  
  console.log(`[Filter] 尝试应用滤镜: 模式=${mode}, 强度=${intensity}`);
  
  if (intensity === 0 || mode === 'off') {
      removeFilterFromPage();
      return;
  }

  let oldStyle = document.getElementById('color-corrector-filter');
  if (oldStyle) {
  }
  
  const filterValue = generateFilter(mode, intensity);
  
  if (filterValue === 'none' || !filterValue) {
      removeFilterFromPage(); 
      console.warn(`[Filter] 滤镜生成返回 none: 模式=${mode}, 强度=${intensity}`);
      return;
  }
  if (lastApplied.mode === mode && lastApplied.intensity === intensity && lastApplied.filterValue === filterValue) {
      return;
  }
  
  // 确保添加到 head，有时 body 可能会被覆盖
  let container = document.head;
  if (!container) {
      container = document.documentElement; // 备用方案
  }

  const style = document.createElement('style');
  style.id = 'color-corrector-filter';
  style.textContent = `
    html {
      filter: ${filterValue} !important;
      /* 避免滚动条被滤镜影响，如果滤镜效果不包括滚动条，则可移除 */
      -webkit-filter: ${filterValue} !important; 
    }
  `;
  
  if (oldStyle) oldStyle.remove();
  container.appendChild(style);
  console.log(`[Filter] ✓ 色彩校正已应用: ${mode}, 强度: ${intensity}%`);
  lastApplied = { mode, intensity, filterValue };
}

// 移除滤镜
function removeFilterFromPage() {
  const style = document.getElementById('color-corrector-filter');
  if (style) {
      style.remove();
      console.log('[Filter] 色彩校正已移除');
  }
  lastApplied = { mode: null, intensity: null, filterValue: null };
  if (applyTimer) { clearTimeout(applyTimer); applyTimer = null; }
}

function scheduleApplyFilterToPage(mode, intensity) {
  if (applyTimer) clearTimeout(applyTimer);
  const m = mode;
  const i = Number(intensity) || 50;
  applyTimer = setTimeout(() => {
    applyTimer = null;
    applyFilterToPage(m, i);
  }, 60);
}


// =========================================================================
// B. 统一消息监听 (接收来自 popup.js 的设置)
// =========================================================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Message] Content Script 收到消息:', request);
  if (request.action === 'UPDATE_ALL_SETTINGS') {
    currentFilterSettings = {
      mode: request.mode,
      intensity: request.intensity,
      enabled: request.enabled,
      shortcut: request.shortcut
    };
    const host = location.hostname || '';
    const intensity = Number(currentFilterSettings.intensity);
    const baseEnabled = !!currentFilterSettings.enabled && intensity > 0;
    chrome.storage.sync.get({ domainRulesMap: null, domainPauseList: [], domainEnableOnlyList: [] }, (data) => {
      let map = data.domainRulesMap;
      if (!map) {
        map = {};
        (data.domainPauseList || []).forEach(d => { map[d] = 'off'; });
        (data.domainEnableOnlyList || []).forEach(d => { map[d] = 'on'; });
        chrome.storage.sync.set({ domainRulesMap: map });
      }
      const rule = map[host];
      let finalEnabled = baseEnabled;
      if (rule === 'off') finalEnabled = false;
      else if (rule === 'on') finalEnabled = intensity > 0;
      if (finalEnabled) scheduleApplyFilterToPage(currentFilterSettings.mode, intensity);
      else removeFilterFromPage();
      sendResponse({ success: true, message: 'Settings applied with domain rules.' });
    });
  } else if (request.action === 'pickColorFromPage') {
    console.log('[Message] 收到取色请求, 将转发给 Service Worker.');
  }
  return true;
});


// =========================================================================
// C. 自定义快捷键监听逻辑 (保持不变)
// =========================================================================

// ... [快捷键逻辑保持不变] ...
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

  const sc = currentFilterSettings.shortcut; 
  
  if (checkShortcutMatch(e, sc)) {
      
      if (isShortcutActive) {
          e.preventDefault(); 
          return;
      }
      
      isShortcutActive = true;
      
      console.log(`[Shortcut] 自定义取色快捷键触发: ${e.key.toUpperCase()}`);
      e.preventDefault();
      
      chrome.runtime.sendMessage({ action: 'pickColorFromPage' });
  }
}, true);

window.addEventListener('keyup', (e) => {
  const sc = currentFilterSettings.shortcut;
  if (checkShortcutMatch(e, sc)) {
      isShortcutActive = false;
  }
}, true);


// =========================================================================
// D. 页面加载初始化 (确保正确读取和应用)
// =========================================================================

// 页面加载时，从存储中读取设置并应用
chrome.storage.local.get(['colorMode', 'enabled', 'intensity', 'shortcut'], (result) => {
  console.log('[Init] 从存储中读取结果:', result);
  
  const savedMode = result.colorMode || 'protanomaly';
  const savedIntensity = result.intensity !== undefined ? Number(result.intensity) : 50;
  const isEnabled = result.enabled !== false;
  const savedShortcut = result.shortcut || { ctrl: false, alt: true, shift: true, key: 'C' }; 
  
  currentFilterSettings = {
    mode: savedMode,
    intensity: savedIntensity,
    enabled: isEnabled,
    shortcut: savedShortcut
  };
  const intensity = Number(savedIntensity);
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
    let shouldEnable = isEnabled && intensity > 0;
    if (rule === 'off') shouldEnable = false;
    else if (rule === 'on') shouldEnable = intensity > 0;
    if (shouldEnable) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          scheduleApplyFilterToPage(savedMode, intensity);
        });
      } else {
        scheduleApplyFilterToPage(savedMode, intensity);
      }
    } else {
      removeFilterFromPage();
    }
  });
});
