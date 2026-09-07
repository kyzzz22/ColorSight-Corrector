// 弹出窗口脚本 - 处理用户交互和设置管理

// DOM 元素引用
let colorModeSelect;
let statusMessage;
let toggleSwitch;
let intensitySlider;
let intensityValue;
let saturationSlider, saturationValue;
let contrastSlider, contrastValue;

// 新增：快捷键 UI 引用
let shortcutCtrl, shortcutAlt, shortcutShift, shortcutKeyInput;
let scFilterCtrl, scFilterAlt, scFilterShift, scFilterKey; // 滤镜开关快捷键
let shortcutPreview; // (已废弃，直接在 input 中显示)
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
    labelShortcuts: '快捷键设置',
    shortcutPickerLabel: '屏幕取色',
    shortcutFilterLabel: '一键开关滤镜 (透视)',
    shortcutDesc: '在网页中按下此快捷键，启动取色器并显示颜色信息。',
    shortcutCurrentPrefix: '当前快捷键：',
    shortcutNotSet: '未设置',
    shortcutNotSetFull: '未设置自定义快捷键',
    shortcutNote: '注意：快捷键仅在网页处于激活状态时生效。',
    shortcutGlobalToggle: '提示：使用 Alt+Shift+F 快速开关滤镜',
    statusUpdatedApplied: '设置已保存',
    statusDisabled: '色彩校正已关闭',
    statusFailedRefresh: '操作失败，请尝试刷新页面',
    statusFailedGeneric: '操作失败'
    ,domainControlsLabel: '站点控制：'
    ,btnPauseShort: '暂停'
    ,btnEnableOnlyShort: '仅此站'
    ,currentSiteLabel: '此站点：'
    ,domainStatusPaused: '已暂停'
    ,domainStatusOnly: '仅此站'
    ,domainStatusFollow: '跟随全局'
    ,btnFollowShort: '跟随'
    ,labelEnhance: '画面增强'
    ,saturationLabel: '饱和度'
    ,contrastLabel: '对比度'
  },
  en: {
    titleApp: 'Color Vision Enhancer',
    subtitle: 'Helps you view the web more clearly',
    toggleLabel: 'Enable Correction',
    labelMode: 'Correction Type',
    optgroupRed: 'Red Deficiency',
    optgroupGreen: 'Green Deficiency',
    optgroupBlue: 'Blue Deficiency',
    optionProtanomaly: 'Protanomaly (Red-Weak)',
    optionProtanopia: 'Protanopia (Red-Blind)',
    optionDeuteranomaly: 'Deuteranomaly (Green-Weak)',
    optionDeuteranopia: 'Deuteranopia (Green-Blind)',
    optionTritanomaly: 'Tritanomaly (Blue-Weak)',
    optionTritanopia: 'Tritanopia (Blue-Blind)',
    intensityLabelPrefix: 'Intensity',
    intensityLow: 'Low',
    intensityMedium: 'Med',
    intensityHigh: 'High',
    infoSelectDrag: 'Select type and drag slider to adjust.',
    shortcutLabel: 'Eyedropper Shortcut:',
    labelShortcuts: 'Shortcuts',
    shortcutPickerLabel: 'Color Picker',
    shortcutFilterLabel: 'Toggle Filter (Peek)',
    shortcutDesc: 'Press to pick color from page.',
    shortcutCurrentPrefix: 'Current: ',
    shortcutNotSet: 'None',
    shortcutNotSetFull: 'Not set',
    shortcutNote: 'Shortcuts work when page is active.',
    shortcutGlobalToggle: 'Tip: Use Alt+Shift+F to toggle',
    statusUpdatedApplied: 'Settings Saved',
    statusDisabled: 'Correction Disabled',
    statusFailedRefresh: 'Failed, please refresh page',
    statusFailedGeneric: 'Operation failed'
    ,domainControlsLabel: 'Site Rules'
    ,btnPauseShort: 'Pause'
    ,btnEnableOnlyShort: 'Only Here'
    ,currentSiteLabel: 'Site: '
    ,domainStatusPaused: 'Paused'
    ,domainStatusOnly: 'Only Here'
    ,domainStatusFollow: 'Follow'
    ,btnFollowShort: 'Follow'
    ,labelEnhance: 'Image Enhance'
    ,saturationLabel: 'Saturation'
    ,contrastLabel: 'Contrast'
  },
  ja: {
    titleApp: '色覚補助エンハンサー',
    subtitle: 'より見やすくウェブを閲覧',
    toggleLabel: '色補正を有効にする',
    labelMode: '補正タイプ',
    optgroupRed: '赤系 (1型)',
    optgroupGreen: '緑系 (2型)',
    optgroupBlue: '青系 (3型)',
    optionProtanomaly: '赤弱視 (1型3色覚)',
    optionProtanopia: '赤色盲 (1型2色覚)',
    optionDeuteranomaly: '緑弱視 (2型3色覚)',
    optionDeuteranopia: '緑色盲 (2型2色覚)',
    optionTritanomaly: '青弱視 (3型3色覚)',
    optionTritanopia: '青色盲 (3型2色覚)',
    intensityLabelPrefix: '強度',
    intensityLow: '弱',
    intensityMedium: '中',
    intensityHigh: '強',
    infoSelectDrag: '種類を選び、強度を調整します。',
    shortcutLabel: 'スポイト:',
    labelShortcuts: 'ショートカット設定',
    shortcutPickerLabel: 'スポイト (色取得)',
    shortcutFilterLabel: 'フィルター切替 (透視)',
    shortcutDesc: 'ページ上で押すと色を取得します。',
    shortcutCurrentPrefix: '現在: ',
    shortcutNotSet: 'なし',
    shortcutNotSetFull: '未設定',
    shortcutNote: 'ページがアクティブな時のみ有効です。',
    shortcutGlobalToggle: 'ヒント: Alt+Shift+F で切替',
    statusUpdatedApplied: '設定を保存しました',
    statusDisabled: '色補正はオフです',
    statusFailedRefresh: '失敗しました。ページを更新してください',
    statusFailedGeneric: '失敗しました'
    ,domainControlsLabel: 'サイト設定'
    ,btnPauseShort: '停止'
    ,btnEnableOnlyShort: 'このサイトのみ'
    ,currentSiteLabel: 'サイト: '
    ,domainStatusPaused: '停止中'
    ,domainStatusOnly: 'このサイトのみ'
    ,domainStatusFollow: 'グローバル設定'
    ,btnFollowShort: 'グローバル'
    ,labelEnhance: '画像強化'
    ,saturationLabel: '彩度'
    ,contrastLabel: 'コントラスト'
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
  const ids = [
    'titleApp', 'subtitle', 'toggleLabel', 'labelMode', 'optgroupRed', 'optgroupGreen', 'optgroupBlue',
    'optionProtanomaly', 'optionProtanopia', 'optionDeuteranomaly', 'optionDeuteranopia', 'optionTritanomaly', 'optionTritanopia',
    'intensityLabelPrefix', 'intensityLow', 'intensityMedium', 'intensityHigh', 'infoSelectDrag',
    'shortcutLabel', 'shortcutDesc', 'shortcutNote', 'shortcutGlobalToggle', 'domainControlsLabel',
    'btnPauseShort', 'btnEnableOnlyShort', 'btnFollowShort', 'labelShortcuts', 'shortcutPickerLabel', 'shortcutFilterLabel',
    'labelEnhance', 'saturationLabel', 'contrastLabel'
  ];
  
  ids.forEach(id => {
      const el = document.getElementById(id);
      // 特殊处理 button 的 textContent，因为它们在 HTML 里有特定的 ID
      if (id === 'btnPauseShort') { if(document.getElementById('btnPauseDomain')) document.getElementById('btnPauseDomain').textContent = t('btnPauseShort'); }
      else if (id === 'btnEnableOnlyShort') { if(document.getElementById('btnEnableOnlyDomain')) document.getElementById('btnEnableOnlyDomain').textContent = t('btnEnableOnlyShort'); }
      else if (id === 'btnFollowShort') { if(document.getElementById('btnFollowDomain')) document.getElementById('btnFollowDomain').textContent = t('btnFollowShort'); }
      // 特殊处理 optgroup，只更新 label 属性，避免覆盖子元素 option
      else if (id.startsWith('optgroup')) {
          if (el) el.setAttribute('label', t(id));
      }
      else if (el) el.textContent = t(id);
  });

  const domainLabel = document.getElementById('domainLabel');
  const domainStatusPill = document.getElementById('domainStatusPill');
  if (domainLabel) domainLabel.textContent = (currentDomain || '');
  if (document.getElementById('currentSiteLabel')) document.getElementById('currentSiteLabel').textContent = t('currentSiteLabel');
  if (domainStatusPill) domainStatusPill.textContent = buildDomainStatusText();
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
    
    saturationSlider = document.getElementById('saturationSlider');
    saturationValue = document.getElementById('saturationValue');
    contrastSlider = document.getElementById('contrastSlider');
    contrastValue = document.getElementById('contrastValue');

    // 快捷键元素引用 (取色)
    shortcutCtrl = document.getElementById('shortcutCtrl');
    shortcutAlt = document.getElementById('shortcutAlt');
    shortcutShift = document.getElementById('shortcutShift');
    shortcutKeyInput = document.getElementById('shortcutKeyInput');

    // 快捷键元素引用 (滤镜开关)
    scFilterCtrl = document.getElementById('scFilterCtrl');
    scFilterAlt = document.getElementById('scFilterAlt');
    scFilterShift = document.getElementById('scFilterShift');
    scFilterKey = document.getElementById('scFilterKey');

    langSelect = document.getElementById('langSelect');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    try {
      const u = new URL(tab.url || '');
      currentDomain = u.hostname || '';
    } catch {}
    
    // 2. 加载设置
    const defaultPickerShortcut = { ctrl: false, alt: true, shift: true, key: 'C' };
    const defaultFilterShortcut = { ctrl: false, alt: true, shift: true, key: 'F' };
    const defaultLang = getDefaultLang();
    
    const result = await chrome.storage.local.get({
        colorMode: 'protanomaly', 
        enabled: true, 
        intensity: 50,
        saturation: 100,
        contrast: 100,
        shortcut: defaultPickerShortcut,      // 取色快捷键
        filterShortcut: defaultFilterShortcut, // 滤镜开关快捷键
        lang: defaultLang
    });
    const domainRules = await chrome.storage.sync.get({ domainPauseList: [], domainEnableOnlyList: [] });
    
    // 3. 初始化色彩增强 UI
    const isEnabled = result.enabled;
    if (colorModeSelect) colorModeSelect.value = result.colorMode;
    if (intensitySlider) intensitySlider.value = result.intensity;
    if (intensityValue) intensityValue.textContent = result.intensity + '%';
    if (saturationSlider) saturationSlider.value = result.saturation;
    if (saturationValue) saturationValue.textContent = result.saturation + '%';
    if (contrastSlider) contrastSlider.value = result.contrast;
    if (contrastValue) contrastValue.textContent = result.contrast + '%';
    if (toggleSwitch) toggleSwitch.checked = isEnabled;
    
    // 4. 初始化快捷键 UI
    const scPicker = result.shortcut;
    if (shortcutCtrl) shortcutCtrl.checked = scPicker.ctrl;
    if (shortcutAlt) shortcutAlt.checked = scPicker.alt;
    if (shortcutShift) shortcutShift.checked = scPicker.shift;
    if (shortcutKeyInput) shortcutKeyInput.value = scPicker.key;

    const scFilter = result.filterShortcut || defaultFilterShortcut;
    if (scFilterCtrl) scFilterCtrl.checked = scFilter.ctrl;
    if (scFilterAlt) scFilterAlt.checked = scFilter.alt;
    if (scFilterShift) scFilterShift.checked = scFilter.shift;
    if (scFilterKey) scFilterKey.value = scFilter.key;

    currentLang = result.lang || defaultLang;
    if (langSelect) langSelect.value = currentLang;
    
    // 5. 绑定事件监听器
    bindEventListeners();

    // 6. 初始化 UI 状态和滤镜
    updateUIState(isEnabled);
    // 将所有设置（包括快捷键）发送给 content script
    await applyAllSettings(result.colorMode, result.intensity, isEnabled, scPicker, scFilter, { saturation: result.saturation, contrast: result.contrast }); 
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
      await saveAndApply();
    });
  }

  // 下拉菜单变化事件
  if (colorModeSelect) {
    colorModeSelect.addEventListener('change', async (e) => {
      await saveAndApply();
    });
  }

  // 强度滑块 input 事件
  if (intensitySlider) {
    intensitySlider.addEventListener('input', async (e) => {
      const value = parseInt(e.target.value) || 50;
      if (intensityValue) intensityValue.textContent = value + '%';
      // 实时应用（不保存到 storage）
      await applyAllSettings(colorModeSelect.value, value, toggleSwitch.checked, getPickerShortcutSettings(), getFilterShortcutSettings(), { 
          skipStorage: true,
          saturation: saturationSlider ? parseInt(saturationSlider.value) : 100,
          contrast: contrastSlider ? parseInt(contrastSlider.value) : 100
      });
    });
    
    // 强度滑块 change 事件
    intensitySlider.addEventListener('change', async (e) => {
      await saveAndApply();
    });
  }

  // 饱和度滑块
  if (saturationSlider) {
      saturationSlider.addEventListener('input', async (e) => {
          let value = parseInt(e.target.value);
          if (isNaN(value)) value = 100;
          if (saturationValue) saturationValue.textContent = value + '%';
          await applyAllSettings(colorModeSelect.value, parseInt(intensitySlider.value), toggleSwitch.checked, getPickerShortcutSettings(), getFilterShortcutSettings(), { 
              skipStorage: true,
              saturation: value,
              contrast: contrastSlider ? parseInt(contrastSlider.value) : 100
          });
      });
      saturationSlider.addEventListener('change', async (e) => { await saveAndApply(); });
      // 双击重置
      saturationSlider.addEventListener('dblclick', async () => {
          saturationSlider.value = 100;
          if (saturationValue) saturationValue.textContent = '100%';
          await saveAndApply();
      });
  }

  // 对比度滑块
  if (contrastSlider) {
      contrastSlider.addEventListener('input', async (e) => {
          let value = parseInt(e.target.value);
          if (isNaN(value)) value = 100;
          if (contrastValue) contrastValue.textContent = value + '%';
          await applyAllSettings(colorModeSelect.value, parseInt(intensitySlider.value), toggleSwitch.checked, getPickerShortcutSettings(), getFilterShortcutSettings(), { 
              skipStorage: true,
              saturation: saturationSlider ? parseInt(saturationSlider.value) : 100,
              contrast: value
          });
      });
      contrastSlider.addEventListener('change', async (e) => { await saveAndApply(); });
      // 双击重置
      contrastSlider.addEventListener('dblclick', async () => {
          contrastSlider.value = 100;
          if (contrastValue) contrastValue.textContent = '100%';
          await saveAndApply();
      });
  }

  if (langSelect) {
    langSelect.addEventListener('change', async (e) => {
      currentLang = e.target.value;
      await chrome.storage.local.set({ lang: currentLang });
      applyTranslations();
      await saveAndApply();
    });
  }

  // 站点控制按钮
  const btnPauseDomain = document.getElementById('btnPauseDomain');
  const btnEnableOnlyDomain = document.getElementById('btnEnableOnlyDomain');
  const btnFollowDomain = document.getElementById('btnFollowDomain');

  const handleDomainRuleChange = async (type) => { // type: 'off', 'on', 'follow'
      const rules = await loadDomainRulesMapWithMigration();
      if (type === 'follow') {
          if (rules[currentDomain]) delete rules[currentDomain]; else rules[currentDomain] = 'follow'; // Toggle logic if needed, but 'follow' usually means delete rule
          // Better logic: if clicking follow, just remove rule
          delete rules[currentDomain];
      } else {
          // Toggle logic: if already this state, remove rule (go to follow), else set rule
          if (rules[currentDomain] === type) delete rules[currentDomain];
          else rules[currentDomain] = type;
      }
      await chrome.storage.sync.set({ domainRulesMap: rules });
      updateDomainControlsUIFromMap(rules);
      await saveAndApply();
  };

  if (btnPauseDomain) btnPauseDomain.addEventListener('click', () => handleDomainRuleChange('off'));
  if (btnEnableOnlyDomain) btnEnableOnlyDomain.addEventListener('click', () => handleDomainRuleChange('on'));
  if (btnFollowDomain) btnFollowDomain.addEventListener('click', () => handleDomainRuleChange('follow'));
  
  // --- 快捷键事件 ---
  const bindShortcutInputs = (els, handler) => {
      els.forEach(el => { if (el) el.addEventListener('change', handler); });
  };
  
  // Picker Shortcut
  bindShortcutInputs([shortcutCtrl, shortcutAlt, shortcutShift], handleShortcutChange);
  if (shortcutKeyInput) {
      shortcutKeyInput.addEventListener('input', handleShortcutChange);
      shortcutKeyInput.addEventListener('keydown', validateKeyInput);
  }

  // Filter Shortcut
  bindShortcutInputs([scFilterCtrl, scFilterAlt, scFilterShift], handleShortcutChange);
  if (scFilterKey) {
      scFilterKey.addEventListener('input', handleShortcutChange);
      scFilterKey.addEventListener('keydown', validateKeyInput);
  }

  // 监听 Storage 变化
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' || areaName === 'local') {
      if (changes.enabled) {
        const isEnabled = changes.enabled.newValue;
        if (toggleSwitch) toggleSwitch.checked = isEnabled;
        updateUIState(isEnabled);
      }
      if (changes.domainRulesMap) {
         updateDomainControlsUIFromMap(changes.domainRulesMap.newValue);
      }
    }
  });
}

function validateKeyInput(e) {
    const key = e.key.toUpperCase();
    if (key.length === 1 && /[A-Z0-9]/.test(key)) {
        // Allow
    } else if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
        // Allow
    } else {
        e.preventDefault();
    }
}

// =========================================================================
// B. 快捷键辅助函数
// =========================================================================

function getPickerShortcutSettings() {
    return {
        ctrl: shortcutCtrl ? shortcutCtrl.checked : false,
        alt: shortcutAlt ? shortcutAlt.checked : false,
        shift: shortcutShift ? shortcutShift.checked : false,
        key: shortcutKeyInput ? shortcutKeyInput.value.toUpperCase() : ''
    };
}

function getFilterShortcutSettings() {
    return {
        ctrl: scFilterCtrl ? scFilterCtrl.checked : false,
        alt: scFilterAlt ? scFilterAlt.checked : false,
        shift: scFilterShift ? scFilterShift.checked : false,
        key: scFilterKey ? scFilterKey.value.toUpperCase() : ''
    };
}

/**
 * 处理快捷键变化：保存设置
 */
async function handleShortcutChange() {
    await saveAndApply();
}

async function saveAndApply() {
    const mode = colorModeSelect ? colorModeSelect.value : 'protanomaly';
    const intensity = intensitySlider ? parseInt(intensitySlider.value) : 50;
    const isEnabled = toggleSwitch ? toggleSwitch.checked : false;
    const saturation = saturationSlider ? parseInt(saturationSlider.value) : 100;
    const contrast = contrastSlider ? parseInt(contrastSlider.value) : 100;
    await applyAllSettings(mode, intensity, isEnabled, getPickerShortcutSettings(), getFilterShortcutSettings(), { saturation, contrast });
}


// =========================================================================
// C. 核心通信和存储函数
// =========================================================================

/**
 * 统一应用和保存所有设置
 */
async function applyAllSettings(mode, intensity, isEnabled, pickerShortcut, filterShortcut, options = {}) {
    try {
        const saturation = options.saturation !== undefined ? options.saturation : 100;
        const contrast = options.contrast !== undefined ? options.contrast : 100;

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab && tab.id) {
            // 1. 通知 content script
            await chrome.tabs.sendMessage(tab.id, {
                action: 'UPDATE_ALL_SETTINGS',
                mode: mode,
                intensity: intensity,
                enabled: isEnabled,
                shortcut: pickerShortcut,
                filterShortcut: filterShortcut,
                saturation: saturation,
                contrast: contrast,
                lang: currentLang
            }).catch(() => {}); // Ignore connection errors
        }
        
        // 2. 保存设置
        if (!options.skipStorage) {
             await chrome.storage.local.set({ 
                colorMode: mode,
                intensity: intensity,
                enabled: isEnabled,
                shortcut: pickerShortcut,
                filterShortcut: filterShortcut,
                saturation: saturation,
                contrast: contrast,
                lang: currentLang
            });
            showStatus(t('statusUpdatedApplied'), 'success');
        }

    } catch (error) {
        console.error('应用设置失败:', error);
    }
}

// =========================================================================
// D. 通用 UI 辅助函数
// =========================================================================

function showStatus(message, type = 'success') {
  if (!statusMessage) return;
  
  statusMessage.textContent = message;
  statusMessage.className = `status-toast show`;
  
  clearTimeout(statusMessage.timer);
  statusMessage.timer = setTimeout(() => {
    statusMessage.className = 'status-toast';
  }, 2000);
}

function updateUIState(enabled) {
  // if (colorModeSelect) colorModeSelect.disabled = !enabled; // 设计上保持启用更好，方便预览调整
  // if (intensitySlider) intensitySlider.disabled = !enabled;
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
  
  if (btnPauseDomain) { btnPauseDomain.className = 'seg-btn'; if (paused) btnPauseDomain.classList.add('active'); }
  if (btnEnableOnlyDomain) { btnEnableOnlyDomain.className = 'seg-btn'; if (enableOnly) btnEnableOnlyDomain.classList.add('active'); }
  if (btnFollowDomain) { btnFollowDomain.className = 'seg-btn'; if (follow) btnFollowDomain.classList.add('active'); }
  
  if (domainStatusPill) {
    domainStatusPill.textContent = buildDomainStatusText(paused, enableOnly, follow);
    domainStatusPill.className = 'domain-status';
    if (paused) domainStatusPill.classList.add('paused');
    else if (enableOnly) domainStatusPill.classList.add('active');
  }
}

function buildDomainStatusText(paused, enableOnly, follow) {
  // If args not provided, re-calculate (lazy way)
  if (paused === undefined) {
      // Not ideal but safe fallback
      return t('domainStatusFollow');
  }
  if (paused) return t('domainStatusPaused');
  if (enableOnly) return t('domainStatusOnly');
  return t('domainStatusFollow');
}

async function loadDomainRulesMapWithMigration() {
  const data = await chrome.storage.sync.get({ domainRulesMap: null });
  let map = data.domainRulesMap || {};
  return map;
}
