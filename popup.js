// 弹出窗口脚本 - 处理用户交互和设置管理

// DOM 元素引用
let colorModeSelect;
let statusMessage;
let toggleSwitch;
let intensitySlider;
let intensityValue;

// 新增：快捷键 UI 引用
let shortcutCtrl;
let shortcutAlt;
let shortcutShift;
let shortcutKeyInput;
let shortcutPreview;
let langSelect;
let currentLang = 'zh';
let currentDomain = '';
const translations = {
  zh: {
    titleApp: '色弱色彩增强器',
    subtitle: '帮助您更清晰地浏览网页',
    toggleLabel: '启用色彩校正',
    labelMode: '选择类型：',
    optgroupRed: '红色相关',
    optgroupGreen: '绿色相关',
    optgroupBlue: '蓝色相关',
    optionProtanomaly: '红色弱 (Protanomaly) - 轻度',
    optionProtanopia: '红色盲 (Protanopia) - 完全',
    optionDeuteranomaly: '绿色弱 (Deuteranomaly) - 轻度',
    optionDeuteranopia: '绿色盲 (Deuteranopia) - 完全',
    optionTritanomaly: '蓝色弱 (Tritanomaly) - 轻度',
    optionTritanopia: '蓝色盲 (Tritanopia) - 完全',
    intensityLabelPrefix: '校正强度',
    intensityLow: '轻微',
    intensityMedium: '中等',
    intensityHigh: '强烈',
    infoSelectDrag: '选择您的色弱/色盲类型，拖动强度条实时调整效果。',
    shortcutLabel: '取色快捷键：',
    shortcutDesc: '在网页中按下此快捷键，启动取色器并显示颜色信息。',
    shortcutCurrentPrefix: '当前快捷键：',
    shortcutNotSet: '未设置',
    shortcutNotSetFull: '未设置自定义快捷键',
    shortcutNote: '注意：快捷键仅在网页处于激活状态时生效，且可能与系统/浏览器快捷键冲突。',
    statusUpdatedApplied: '设置已更新并应用',
    statusDisabled: '色彩校正已关闭',
    statusFailedRefresh: '操作失败，请尝试刷新页面后重试',
    statusFailedGeneric: '操作失败'
    ,domainControlsLabel: '站点控制：'
    ,btnPauseShort: '暂停'
    ,btnEnableOnlyShort: '仅此站'
    ,currentSiteLabel: '此站点：'
    ,domainStatusPaused: '已暂停'
    ,domainStatusOnly: '仅此站'
    ,domainStatusFollow: '跟随全局'
    ,btnFollowShort: '跟随'
  },
  en: {
    titleApp: 'Color Vision Enhancer',
    subtitle: 'Helps you view the web more clearly',
    toggleLabel: 'Enable color correction',
    labelMode: 'Select type:',
    optgroupRed: 'Red-related',
    optgroupGreen: 'Green-related',
    optgroupBlue: 'Blue-related',
    optionProtanomaly: 'Protanomaly (red weak) - mild',
    optionProtanopia: 'Protanopia (red blind) - full',
    optionDeuteranomaly: 'Deuteranomaly (green weak) - mild',
    optionDeuteranopia: 'Deuteranopia (green blind) - full',
    optionTritanomaly: 'Tritanomaly (blue weak) - mild',
    optionTritanopia: 'Tritanopia (blue blind) - full',
    intensityLabelPrefix: 'Correction intensity',
    intensityLow: 'Low',
    intensityMedium: 'Medium',
    intensityHigh: 'High',
    infoSelectDrag: 'Select your type and adjust intensity in real time.',
    shortcutLabel: 'Eyedropper shortcut:',
    shortcutDesc: 'Press this shortcut on a page to start the eyedropper and show color info.',
    shortcutCurrentPrefix: 'Current shortcut: ',
    shortcutNotSet: 'Not set',
    shortcutNotSetFull: 'Custom shortcut not set',
    shortcutNote: 'Note: The shortcut works only when the page is active and may conflict with system/browser shortcuts.',
    statusUpdatedApplied: 'Settings updated and applied',
    statusDisabled: 'Color correction is off',
    statusFailedRefresh: 'Operation failed, please refresh the page and retry',
    statusFailedGeneric: 'Operation failed'
    ,domainControlsLabel: 'Site controls:'
    ,btnPauseShort: 'Pause'
    ,btnEnableOnlyShort: 'Only'
    ,currentSiteLabel: 'Site: '
    ,domainStatusPaused: 'Paused'
    ,domainStatusOnly: 'Only'
    ,domainStatusFollow: 'Follow'
    ,btnFollowShort: 'Follow'
  },
  ja: {
    titleApp: '色覚補助エンハンサー',
    subtitle: 'より見やすくウェブを閲覧できます',
    toggleLabel: '色補正を有効にする',
    labelMode: '種類を選択：',
    optgroupRed: '赤系',
    optgroupGreen: '緑系',
    optgroupBlue: '青系',
    optionProtanomaly: '赤弱視（Protanomaly）- 軽度',
    optionProtanopia: '赤色盲（Protanopia）- 完全',
    optionDeuteranomaly: '緑弱視（Deuteranomaly）- 軽度',
    optionDeuteranopia: '緑色盲（Deuteranopia）- 完全',
    optionTritanomaly: '青弱視（Tritanomaly）- 軽度',
    optionTritanopia: '青色盲（Tritanopia）- 完全',
    intensityLabelPrefix: '補正強度',
    intensityLow: '弱',
    intensityMedium: '中',
    intensityHigh: '強',
    infoSelectDrag: '種類を選び、強度をリアルタイムに調整します。',
    shortcutLabel: 'スポイトのショートカット：',
    shortcutDesc: 'ページ上でこのショートカットを押すと、スポイトを起動して色情報を表示します。',
    shortcutCurrentPrefix: '現在のショートカット：',
    shortcutNotSet: '未設定',
    shortcutNotSetFull: 'カスタムショートカットは未設定',
    shortcutNote: '注意：ショートカットはページがアクティブな時のみ有効で、システム/ブラウザのショートカットと競合する場合があります。',
    statusUpdatedApplied: '設定が更新され適用されました',
    statusDisabled: '色補正はオフです',
    statusFailedRefresh: '操作に失敗しました。ページを更新して再試行してください',
    statusFailedGeneric: '操作に失敗しました'
    ,domainControlsLabel: 'サイト設定：'
    ,btnPauseShort: '停止'
    ,btnEnableOnlyShort: 'このサイトのみ'
    ,currentSiteLabel: 'サイト：'
    ,domainStatusPaused: '停止'
    ,domainStatusOnly: 'このサイトのみ'
    ,domainStatusFollow: '継承'
    ,btnFollowShort: '継承'
  }
};
function getDefaultLang() {
  const ui = chrome.i18n && typeof chrome.i18n.getUILanguage === 'function' ? chrome.i18n.getUILanguage() : 'en';
  const l = ui.toLowerCase();
  if (l.startsWith('zh')) return 'zh';
  if (l.startsWith('ja')) return 'ja';
  return 'en';
}
function t(key) {
  const pack = translations[currentLang] || translations.zh;
  return pack[key] || key;
}
function applyTranslations() {
  const elTitle = document.getElementById('titleApp');
  const elSubtitle = document.getElementById('subtitle');
  const elToggleLabel = document.getElementById('toggleLabel');
  const elLabelMode = document.getElementById('labelMode');
  const ogRed = document.getElementById('optgroupRed');
  const ogGreen = document.getElementById('optgroupGreen');
  const ogBlue = document.getElementById('optgroupBlue');
  const optProtanomaly = document.getElementById('optionProtanomaly');
  const optProtanopia = document.getElementById('optionProtanopia');
  const optDeuteranomaly = document.getElementById('optionDeuteranomaly');
  const optDeuteranopia = document.getElementById('optionDeuteranopia');
  const optTritanomaly = document.getElementById('optionTritanomaly');
  const optTritanopia = document.getElementById('optionTritanopia');
  const elIntensityPrefix = document.getElementById('intensityLabelPrefix');
  const elIntensityLow = document.getElementById('intensityLow');
  const elIntensityMedium = document.getElementById('intensityMedium');
  const elIntensityHigh = document.getElementById('intensityHigh');
  const elInfoSelectDrag = document.getElementById('infoSelectDrag');
  const elShortcutLabel = document.getElementById('shortcutLabel');
  const elShortcutDesc = document.getElementById('shortcutDesc');
  const elShortcutPreview = document.getElementById('shortcutPreview');
  const elShortcutNote = document.getElementById('shortcutNote');
  const elDomainControlsLabel = document.getElementById('domainControlsLabel');
  const btnPauseDomain = document.getElementById('btnPauseDomain');
  const btnEnableOnlyDomain = document.getElementById('btnEnableOnlyDomain');
  const btnFollowDomain = document.getElementById('btnFollowDomain');
  const domainLabel = document.getElementById('domainLabel');
  const domainStatusPill = document.getElementById('domainStatusPill');
  if (elTitle) elTitle.textContent = t('titleApp');
  if (elSubtitle) elSubtitle.textContent = t('subtitle');
  if (elToggleLabel) elToggleLabel.textContent = t('toggleLabel');
  if (elLabelMode) elLabelMode.textContent = t('labelMode');
  if (ogRed) ogRed.label = t('optgroupRed');
  if (ogGreen) ogGreen.label = t('optgroupGreen');
  if (ogBlue) ogBlue.label = t('optgroupBlue');
  if (optProtanomaly) optProtanomaly.textContent = t('optionProtanomaly');
  if (optProtanopia) optProtanopia.textContent = t('optionProtanopia');
  if (optDeuteranomaly) optDeuteranomaly.textContent = t('optionDeuteranomaly');
  if (optDeuteranopia) optDeuteranopia.textContent = t('optionDeuteranopia');
  if (optTritanomaly) optTritanomaly.textContent = t('optionTritanomaly');
  if (optTritanopia) optTritanopia.textContent = t('optionTritanopia');
  if (elIntensityPrefix) elIntensityPrefix.textContent = t('intensityLabelPrefix');
  if (elIntensityLow) elIntensityLow.textContent = t('intensityLow');
  if (elIntensityMedium) elIntensityMedium.textContent = t('intensityMedium');
  if (elIntensityHigh) elIntensityHigh.textContent = t('intensityHigh');
  if (elInfoSelectDrag) elInfoSelectDrag.textContent = t('infoSelectDrag');
  if (elShortcutLabel) elShortcutLabel.textContent = t('shortcutLabel');
  if (elShortcutDesc) elShortcutDesc.textContent = t('shortcutDesc');
  if (elShortcutNote) elShortcutNote.textContent = t('shortcutNote');
  if (elDomainControlsLabel) elDomainControlsLabel.textContent = t('domainControlsLabel');
  if (btnPauseDomain) btnPauseDomain.textContent = t('btnPauseShort');
  if (btnEnableOnlyDomain) btnEnableOnlyDomain.textContent = t('btnEnableOnlyShort');
  if (btnFollowDomain) btnFollowDomain.textContent = t('btnFollowShort');
  if (domainLabel) domainLabel.textContent = t('currentSiteLabel') + (currentDomain || '');
  if (domainStatusPill) domainStatusPill.textContent = buildDomainStatusText();
  const sc = getShortcutSettings();
  if (elShortcutPreview) elShortcutPreview.textContent = t('shortcutCurrentPrefix') + buildShortcutPreviewText(sc);
}


// =========================================================================
// A. 初始化：加载保存的设置和绑定事件
// =========================================================================

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Popup DOM 加载完成，开始初始化');
  
  try {
    // 1. 获取元素引用
    colorModeSelect = document.getElementById('colorModeSelect');
    intensitySlider = document.getElementById('intensitySlider');
    intensityValue = document.getElementById('intensityValue');
    toggleSwitch = document.getElementById('toggleSwitch');
    statusMessage = document.getElementById('statusMessage');

    // 新增：获取快捷键元素引用
    shortcutCtrl = document.getElementById('shortcutCtrl');
    shortcutAlt = document.getElementById('shortcutAlt');
    shortcutShift = document.getElementById('shortcutShift');
    shortcutKeyInput = document.getElementById('shortcutKeyInput');
    shortcutPreview = document.getElementById('shortcutPreview');
    langSelect = document.getElementById('langSelect');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    try {
      const u = new URL(tab.url || '');
      currentDomain = u.hostname || '';
    } catch {}
    
    // 2. 加载设置
    const defaultShortcut = { ctrl: false, alt: true, shift: true, key: 'C' };
    const defaultLang = getDefaultLang();
    
    const result = await chrome.storage.local.get({
        colorMode: 'protanomaly', 
        enabled: true, 
        intensity: 50,
        shortcut: defaultShortcut,
        lang: defaultLang
    });
    const domainRules = await chrome.storage.sync.get({ domainPauseList: [], domainEnableOnlyList: [] });
    
    // 3. 初始化色彩增强 UI
    const isEnabled = result.enabled;
    if (colorModeSelect) colorModeSelect.value = result.colorMode;
    if (intensitySlider) intensitySlider.value = result.intensity;
    if (intensityValue) intensityValue.textContent = result.intensity;
    if (toggleSwitch) toggleSwitch.checked = isEnabled;
    
    // 4. 初始化快捷键 UI
    const sc = result.shortcut;
    if (shortcutCtrl) shortcutCtrl.checked = sc.ctrl;
    if (shortcutAlt) shortcutAlt.checked = sc.alt;
    if (shortcutShift) shortcutShift.checked = sc.shift;
    if (shortcutKeyInput) shortcutKeyInput.value = sc.key;

    currentLang = result.lang || defaultLang;
    if (langSelect) langSelect.value = currentLang;
    
    // 5. 绑定事件监听器
    bindEventListeners();

    // 6. 初始化 UI 状态和滤镜
    updateUIState(isEnabled);
    // 将所有设置（包括快捷键）发送给 content script
    await applyAllSettings(result.colorMode, result.intensity, isEnabled, sc); 
    applyTranslations();
    updateDomainControlsUI(domainRules);

  } catch (error) {
    console.error('加载设置失败:', error);
    showStatus(t('statusFailedGeneric'), 'error');
  }
});

// 绑定所有事件监听器
function bindEventListeners() {
  console.log('绑定事件监听器');

  // --- 色彩增强事件 ---
  // 开关切换事件
  if (toggleSwitch) {
    toggleSwitch.addEventListener('change', async (e) => {
      const isEnabled = e.target.checked;
      updateUIState(isEnabled);
      await applyAllSettings(colorModeSelect.value, parseInt(intensitySlider.value), isEnabled, getShortcutSettings());
    });
  }

  // 下拉菜单变化事件 - 直接应用
  if (colorModeSelect) {
    colorModeSelect.addEventListener('change', async (e) => {
      await applyAllSettings(e.target.value, parseInt(intensitySlider.value), true, getShortcutSettings());
    });
  }

  // 强度滑块 input 事件：实时更新数值显示和应用滤镜（拖动时）
  if (intensitySlider) {
    intensitySlider.addEventListener('input', async (e) => {
      const value = parseInt(e.target.value) || 50;
      if (intensityValue) intensityValue.textContent = value;
      
      // 实时应用（不保存到 storage）
      await applyAllSettings(colorModeSelect.value, value, toggleSwitch.checked, getShortcutSettings(), { skipStorage: true });
    });
    
    // 强度滑块 change 事件：保存设置（释放鼠标时）
    intensitySlider.addEventListener('change', async (e) => {
      const intensity = parseInt(e.target.value) || 50;
      // 保存并应用
      await applyAllSettings(colorModeSelect.value, intensity, toggleSwitch.checked, getShortcutSettings());
    });
  }
  if (langSelect) {
    langSelect.addEventListener('change', async (e) => {
      currentLang = e.target.value;
      await chrome.storage.local.set({ lang: currentLang });
      applyTranslations();
      const mode = colorModeSelect ? colorModeSelect.value : 'protanomaly';
      const intensity = intensitySlider ? parseInt(intensitySlider.value) : 50;
      const isEnabled = toggleSwitch ? toggleSwitch.checked : true;
      await applyAllSettings(mode, intensity, isEnabled, getShortcutSettings());
    });
  }
  const btnPauseDomain = document.getElementById('btnPauseDomain');
  const btnEnableOnlyDomain = document.getElementById('btnEnableOnlyDomain');
  const btnFollowDomain = document.getElementById('btnFollowDomain');
  if (btnPauseDomain) {
    btnPauseDomain.addEventListener('click', async () => {
      const rules = await loadDomainRulesMapWithMigration();
      if (rules[currentDomain] === 'off') delete rules[currentDomain]; else rules[currentDomain] = 'off';
      await chrome.storage.sync.set({ domainRulesMap: rules });
      updateDomainControlsUIFromMap(rules);
      const mode = colorModeSelect ? colorModeSelect.value : 'protanomaly';
      const intensity = intensitySlider ? parseInt(intensitySlider.value) : 50;
      const isEnabled = toggleSwitch ? toggleSwitch.checked : true;
      await applyAllSettings(mode, intensity, isEnabled, getShortcutSettings());
    });
  }
  if (btnEnableOnlyDomain) {
    btnEnableOnlyDomain.addEventListener('click', async () => {
      const rules = await loadDomainRulesMapWithMigration();
      if (rules[currentDomain] === 'on') delete rules[currentDomain]; else rules[currentDomain] = 'on';
      await chrome.storage.sync.set({ domainRulesMap: rules });
      updateDomainControlsUIFromMap(rules);
      const mode = colorModeSelect ? colorModeSelect.value : 'protanomaly';
      const intensity = intensitySlider ? parseInt(intensitySlider.value) : 50;
      const isEnabled = toggleSwitch ? toggleSwitch.checked : true;
      await applyAllSettings(mode, intensity, isEnabled, getShortcutSettings());
    });
  }
  if (btnFollowDomain) {
    btnFollowDomain.addEventListener('click', async () => {
      const rules = await loadDomainRulesMapWithMigration();
      if (rules[currentDomain]) delete rules[currentDomain]; else rules[currentDomain] = 'follow';
      await chrome.storage.sync.set({ domainRulesMap: rules });
      updateDomainControlsUIFromMap(rules);
      const mode = colorModeSelect ? colorModeSelect.value : 'protanomaly';
      const intensity = intensitySlider ? parseInt(intensitySlider.value) : 50;
      const isEnabled = toggleSwitch ? toggleSwitch.checked : true;
      await applyAllSettings(mode, intensity, isEnabled, getShortcutSettings());
    });
  }
  
  // --- 快捷键事件 ---
  // 监听所有快捷键输入变化
  [shortcutCtrl, shortcutAlt, shortcutShift].forEach(el => {
    if (el) el.addEventListener('change', handleShortcutChange);
  });

  if (shortcutKeyInput) {
    shortcutKeyInput.addEventListener('input', handleShortcutChange);
    // 确保只能输入一个字母或数字
    shortcutKeyInput.addEventListener('keydown', (e) => {
        const key = e.key.toUpperCase();
        if (key.length === 1 && /[A-Z0-9]/.test(key)) {
            // 允许输入一个字母或数字
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
             // 允许删除
        } else {
             e.preventDefault();
        }
    });
  }
}

// =========================================================================
// B. 快捷键辅助函数
// =========================================================================

/**
 * 从 UI 获取当前的快捷键设置对象
 */
function getShortcutSettings() {
    return {
        ctrl: shortcutCtrl ? shortcutCtrl.checked : false,
        alt: shortcutAlt ? shortcutAlt.checked : false,
        shift: shortcutShift ? shortcutShift.checked : false,
        key: shortcutKeyInput ? shortcutKeyInput.value.toUpperCase() : ''
    };
}

/**
 * 处理快捷键变化：更新预览，保存设置
 */
function handleShortcutChange() {
    const sc = getShortcutSettings();

    // 更新预览
    const modifiers = [];
    if (sc.ctrl) modifiers.push('Ctrl');
    if (sc.alt) modifiers.push('Alt');
    if (sc.shift) modifiers.push('Shift');
    const key = sc.key || t('shortcutNotSet');
    
    let previewText = '';
    if (modifiers.length > 0) {
        previewText = modifiers.join(' + ') + ' + ' + key;
    } else if (key !== t('shortcutNotSet')) {
         previewText = key;
    } else {
        previewText = t('shortcutNotSetFull');
    }

    if (shortcutPreview) {
        shortcutPreview.textContent = t('shortcutCurrentPrefix') + previewText;
    }

    // 保存设置 (连同色彩校正设置一起)
    const mode = colorModeSelect ? colorModeSelect.value : 'protanomaly';
    const intensity = intensitySlider ? parseInt(intensitySlider.value) : 50;
    const isEnabled = toggleSwitch ? toggleSwitch.checked : false;

    applyAllSettings(mode, intensity, isEnabled, sc);
}


// =========================================================================
// C. 核心通信和存储函数
// =========================================================================

/**
 * 统一应用和保存所有设置（色彩增强和快捷键）
 * @param {string} mode - 颜色模式
 * @param {number} intensity - 强度
 * @param {boolean} isEnabled - 是否启用
 * @param {object} shortcutSettings - 快捷键设置对象
 * @param {object} options - 选项，如 { skipStorage: true }
 */
async function applyAllSettings(mode, intensity, isEnabled, shortcutSettings, options = {}) {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab.id) {
            console.error('无法获取标签页ID');
            return;
        }

        // 1. 通知 content script 更新所有设置
        await chrome.tabs.sendMessage(tab.id, {
            action: 'UPDATE_ALL_SETTINGS', // 新增统一的 action
            mode: mode,
            intensity: intensity,
            enabled: isEnabled,
            shortcut: shortcutSettings,
            lang: currentLang
        });
        
        // 2. 保存设置到 storage (如果不是实时拖动)
        if (!options.skipStorage) {
             await chrome.storage.local.set({ 
                colorMode: mode,
                intensity: intensity,
                enabled: isEnabled,
                shortcut: shortcutSettings,
                lang: currentLang
            });
            showStatus(isEnabled ? t('statusUpdatedApplied') : t('statusDisabled'), isEnabled ? 'success' : 'info');
        }

    } catch (error) {
        console.error('应用所有设置失败:', error);
        if (error.message && error.message.includes('Could not establish connection')) {
            // Content script 未加载，用户需要刷新页面
            showStatus(t('statusFailedRefresh'), 'error');
        } else {
            showStatus(t('statusFailedGeneric'), 'error');
        }
    }
}

// 移除滤镜 (仅用于兼容性，实际逻辑已集成到 applyAllSettings)
async function removeFilter() {
    await applyAllSettings('protanomaly', 50, false, getShortcutSettings());
}

// 应用滤镜 (仅用于兼容性，实际逻辑已集成到 applyAllSettings)
async function applyFilter(mode, intensity = 50) {
    await applyAllSettings(mode, intensity, true, getShortcutSettings());
}

// =========================================================================
// D. 通用 UI 辅助函数
// =========================================================================

// 显示状态消息
function showStatus(message, type = 'success') {
  if (!statusMessage) return;
  
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  
  // 3秒后清除消息
  clearTimeout(statusMessage.timer);
  statusMessage.timer = setTimeout(() => {
    statusMessage.textContent = '';
    statusMessage.className = 'status-message';
  }, 3000);
}

// 更新UI状态（启用/禁用设置控件）
function updateUIState(enabled) {
  if (colorModeSelect) colorModeSelect.disabled = !enabled;
  if (intensitySlider) intensitySlider.disabled = !enabled;
}
function buildShortcutPreviewText(sc) {
  const modifiers = [];
  if (sc.ctrl) modifiers.push('Ctrl');
  if (sc.alt) modifiers.push('Alt');
  if (sc.shift) modifiers.push('Shift');
  const key = sc.key || t('shortcutNotSet');
  if (modifiers.length > 0) return modifiers.join(' + ') + ' + ' + key;
  if (key !== t('shortcutNotSet')) return key;
  return t('shortcutNotSetFull');
}
function updateDomainControlsUI(rulesObj) {
  updateDomainControlsUIFromMap(rulesObj || {});
}
function updateDomainControlsUIFromMap(rulesMap) {
  const btnPauseDomain = document.getElementById('btnPauseDomain');
  const btnEnableOnlyDomain = document.getElementById('btnEnableOnlyDomain');
  const btnFollowDomain = document.getElementById('btnFollowDomain');
  const domainStatusPill = document.getElementById('domainStatusPill');
  const rule = (rulesMap && currentDomain) ? rulesMap[currentDomain] : undefined;
  const paused = rule === 'off';
  const enableOnly = rule === 'on';
  const follow = !rule || rule === 'follow';
  if (btnPauseDomain) btnPauseDomain.classList.toggle('active', !!paused);
  if (btnEnableOnlyDomain) btnEnableOnlyDomain.classList.toggle('active', !!enableOnly);
  if (btnFollowDomain) btnFollowDomain.classList.toggle('active', !!follow);
  if (domainStatusPill) {
    domainStatusPill.textContent = buildDomainStatusText(paused, enableOnly, follow);
    domainStatusPill.classList.remove('pill--paused', 'pill--only', 'pill--none');
    domainStatusPill.classList.add(paused ? 'pill--paused' : enableOnly ? 'pill--only' : 'pill--none');
  }
}
function buildDomainStatusText(paused, enableOnly, follow) {
  if (paused) return t('domainStatusPaused');
  if (enableOnly) return t('domainStatusOnly');
  return t('domainStatusFollow');
}
async function loadDomainRulesMapWithMigration() {
  const data = await chrome.storage.sync.get({ domainRulesMap: null, domainPauseList: [], domainEnableOnlyList: [] });
  let map = data.domainRulesMap;
  if (!map) {
    map = {};
    (data.domainPauseList || []).forEach(d => { map[d] = 'off'; });
    (data.domainEnableOnlyList || []).forEach(d => { map[d] = 'on'; });
    await chrome.storage.sync.set({ domainRulesMap: map });
  }
  return map;
}
