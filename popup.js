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
    
    // 2. 加载设置
    const defaultShortcut = { ctrl: false, alt: true, shift: true, key: 'C' };
    
    const result = await chrome.storage.local.get({
        colorMode: 'protanomaly', 
        enabled: true, 
        intensity: 50,
        // 默认的快捷键设置
        shortcut: defaultShortcut 
    });
    
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
    
    // 5. 绑定事件监听器
    bindEventListeners();

    // 6. 初始化 UI 状态和滤镜
    updateUIState(isEnabled);
    // 将所有设置（包括快捷键）发送给 content script
    await applyAllSettings(result.colorMode, result.intensity, isEnabled, sc); 

  } catch (error) {
    console.error('加载设置失败:', error);
    showStatus('加载设置失败', 'error');
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
    const key = sc.key || '未设置';
    
    let previewText = '';
    if (modifiers.length > 0) {
        previewText = modifiers.join(' + ') + ' + ' + key;
    } else if (key !== '未设置') {
         previewText = key;
    } else {
        previewText = '未设置自定义快捷键';
    }

    if (shortcutPreview) {
        shortcutPreview.textContent = `当前快捷键：${previewText}`;
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
            shortcut: shortcutSettings
        });
        
        // 2. 保存设置到 storage (如果不是实时拖动)
        if (!options.skipStorage) {
             await chrome.storage.local.set({ 
                colorMode: mode,
                intensity: intensity,
                enabled: isEnabled,
                shortcut: shortcutSettings
            });
            showStatus(isEnabled ? '设置已更新并应用' : '色彩校正已关闭', isEnabled ? 'success' : 'info');
        }

    } catch (error) {
        console.error('应用所有设置失败:', error);
        if (error.message && error.message.includes('Could not establish connection')) {
            // Content script 未加载，用户需要刷新页面
            showStatus('操作失败，请尝试刷新页面后重试', 'error');
        } else {
            showStatus('操作失败', 'error');
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