/**
 * background.js - 核心背景脚本
 * 功能：处理取色请求（通过快捷键或消息），并将取色逻辑注入到当前页面。
 */

// =========================================================================
// 1. 触发逻辑 (在后台 Service Worker 中运行)
// =========================================================================



// 支持来自 content_script 或 popup 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.action === 'pickColorFromPage') {
    triggerPickColor();
    // 由于取色是异步操作，这里可以不 sendResponse
  }
});

/**
 * 异步函数：查询当前活动标签页，并注入取色函数。
 */
async function triggerPickColor() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

    // 使用 chrome.scripting.executeScript 注入 pickColorAndDescribe 函数及其所有依赖
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      // func 参数会注入这个函数本身及其在同作用域内声明的所有依赖函数
      func: pickColorAndDescribe,
    });
  } catch (error) {
    // 捕获权限不足或 Tab 丢失等错误
    console.error('执行取色命令失败:', error);
  }
}

// =========================================================================
// 2. 取色和描述逻辑 (将被注入到页面上下文中运行)
// =========================================================================

// 在页面上下文中运行的函数
function pickColorAndDescribe() {
  // --- [ 辅助函数：颜色转换 ] ---
  
  /**
   * 将 HEX 字符串转为 RGB 对象。
   */
  function hexToRgb(hex) {
    const value = hex.replace('#', '');
    const r = parseInt(value.substring(0, 2), 16);
    const g = parseInt(value.substring(2, 4), 16);
    const b = parseInt(value.substring(4, 6), 16);
    return { r, g, b };
  }

  /**
   * 0-255 的 RGB 转为 HSL（0-360, 0-100, 0-100）。
   */
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;

    if (max === min) {
      h = 0;
      s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max - min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        default:
          h = (r - g) / d + 4;
          break;
      }

      h *= 60;
    }

    return {
      h: Math.round(h || 0),
      s: Math.round((s || 0) * 100),
      l: Math.round(l * 100),
    };
  }

  /**
   * 将 HEX 转为 HSL 并给出中文颜色名称/描述。
   */
  function describeColor(hex) {
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);

    let basicHue;
    // 基础色相判断
    if (s < 10 && l > 90) {
      basicHue = '接近白色';
    } else if (s < 10 && l < 15) {
      basicHue = '接近黑色';
    } else if (s < 10) {
      basicHue = '灰色';
    } else if (h >= 345 || h < 15) {
      basicHue = '红色';
    } else if (h >= 15 && h < 45) {
      basicHue = '橙色';
    } else if (h >= 45 && h < 75) {
      basicHue = '黄色';
    } else if (h >= 75 && h < 150) {
      basicHue = '绿色';
    } else if (h >= 150 && h < 210) {
      basicHue = '青色';
    } else if (h >= 210 && h < 255) {
      basicHue = '蓝色';
    } else if (h >= 255 && h < 285) {
      basicHue = '靛色';
    } else {
      basicHue = '紫色';
    }

    let lightnessDesc = '';
    if (l >= 85) lightnessDesc = '非常亮';
    else if (l >= 70) lightnessDesc = '偏亮';
    else if (l <= 20) lightnessDesc = '非常暗';
    else if (l <= 35) lightnessDesc = '偏暗';

    let saturationDesc = '';
    if (s >= 80) saturationDesc = '高饱和度';
    else if (s >= 50) saturationDesc = '中等饱和度';
    else if (s >= 20) saturationDesc = '低饱和度';
    else saturationDesc = '非常低饱和度';

    const name =
      (lightnessDesc ? lightnessDesc + '的' : '') +
      (saturationDesc ? saturationDesc + ' ' : '') +
      basicHue;

    const description = `色相≈${Math.round(h)}°，饱和度≈${Math.round(
      s
    )}%，亮度≈${Math.round(l)}%。`;

    return { name, description };
  }

  /**
   * 在页面右上角显示一个简洁的提示浮层 (Toast)。
   */
  function showColorToast({ title, swatch, lines = [], theme = 'info' }) {
    const existing = document.getElementById('color-corrector-toast');
    if (existing) {
      existing.remove();
    }

    const container = document.createElement('div');
    container.id = 'color-corrector-toast';
    // 样式设置
    container.style.position = 'fixed';
    container.style.top = '16px';
    container.style.right = '16px';
    container.style.zIndex = '2147483647';
    container.style.maxWidth = '260px';
    container.style.padding = '12px 14px';
    container.style.borderRadius = '10px';
    container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.18)';
    container.style.fontFamily =
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
    container.style.fontSize = '12px';
    container.style.display = 'flex';
    container.style.gap = '10px';
    container.style.alignItems = 'flex-start';
    // 主题颜色设置
    container.style.background =
      theme === 'error' ? '#fef2f2' : theme === 'success' ? '#f0fdf4' : '#f3f4f6';
    container.style.color =
      theme === 'error' ? '#b91c1c' : theme === 'success' ? '#166534' : '#111827';

    if (swatch) {
      const swatchEl = document.createElement('div');
      swatchEl.style.width = '26px';
      swatchEl.style.height = '26px';
      swatchEl.style.borderRadius = '6px';
      swatchEl.style.border = '1px solid rgba(0,0,0,0.08)';
      swatchEl.style.background = swatch;
      container.appendChild(swatchEl);
    }

    const textBox = document.createElement('div');
    textBox.style.flex = '1';

    if (title) {
      const titleEl = document.createElement('div');
      titleEl.textContent = title;
      titleEl.style.fontWeight = '600';
      titleEl.style.marginBottom = '4px';
      textBox.appendChild(titleEl);
    }

    lines.forEach((line) => {
      const lineEl = document.createElement('div');
      lineEl.textContent = line;
      lineEl.style.lineHeight = '1.4';
      textBox.appendChild(lineEl);
    });

    container.appendChild(textBox);

    document.body.appendChild(container);

    // 3 秒后自动淡出
    setTimeout(() => {
      container.style.transition = 'opacity 0.4s, transform 0.4s';
      container.style.opacity = '0';
      container.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        container.remove();
      }, 400);
    }, 3000);
  }
  
  // --- [ EyeDropper API 主调用 ] ---

  if (!('EyeDropper' in window)) {
    showColorToast({
      title: '取色不可用',
      lines: ['当前浏览器不支持 EyeDropper API', '请使用较新的 Chromium 浏览器版本'],
      theme: 'error',
    });
    return;
  }

  const eyeDropper = new EyeDropper();

  eyeDropper
    .open()
    .then((result) => {
      const hex = result.sRGBHex; // 例如 "#RRGGBB"
      const info = describeColor(hex);
      showColorToast({
        title: '取色结果',
        swatch: hex,
        lines: [
          `颜色：${info.name}`,
          `HEX：${hex}`,
          info.description,
        ],
        theme: 'success',
      });
    })
    .catch((err) => {
      // 用户取消取色 (如按 ESC 键) 或失败
      console.log('取色被取消或失败:', err);
    });
}