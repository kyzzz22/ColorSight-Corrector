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
    const { lang } = await chrome.storage.local.get({ lang: 'en' });
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: pickColorAndDescribe,
      args: [lang || 'en']
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
function pickColorAndDescribe(lang) {
  function tt(key) {
    const zh = {
      toastUnavailableTitle: '取色不可用',
      toastUnavailableLine1: '当前浏览器不支持 EyeDropper API',
      toastUnavailableLine2: '请使用较新的 Chromium 浏览器版本',
      toastResultTitle: '取色结果',
      lineColorPrefix: '颜色：',
      lineHexPrefix: 'HEX：',
      hueNearWhite: '接近白色',
      hueNearBlack: '接近黑色',
      hueGray: '灰色',
      hueRed: '红色',
      hueOrange: '橙色',
      hueYellow: '黄色',
      hueGreen: '绿色',
      hueCyan: '青色',
      hueBlue: '蓝色',
      hueIndigo: '靛色',
      huePurple: '紫色',
      lightVeryBright: '非常亮',
      lightBright: '偏亮',
      lightVeryDark: '非常暗',
      lightDark: '偏暗',
      satHigh: '高饱和度',
      satMedium: '中等饱和度',
      satLow: '低饱和度',
      satVeryLow: '非常低饱和度',
      descTemplate: (h, s, l) => `色相≈${Math.round(h)}°，饱和度≈${Math.round(s)}%，亮度≈${Math.round(l)}%。`,
      composeName: (light, sat, hue) => (light ? light + '的' : '') + (sat ? sat + ' ' : '') + hue
      ,copiedHex: '已复制 HEX 到剪贴板'
    };
    const en = {
      toastUnavailableTitle: 'Eyedropper unavailable',
      toastUnavailableLine1: 'Your browser does not support EyeDropper API',
      toastUnavailableLine2: 'Please use a modern Chromium-based browser',
      toastResultTitle: 'Picked color',
      lineColorPrefix: 'Color: ',
      lineHexPrefix: 'HEX: ',
      hueNearWhite: 'near white',
      hueNearBlack: 'near black',
      hueGray: 'gray',
      hueRed: 'red',
      hueOrange: 'orange',
      hueYellow: 'yellow',
      hueGreen: 'green',
      hueCyan: 'cyan',
      hueBlue: 'blue',
      hueIndigo: 'indigo',
      huePurple: 'purple',
      lightVeryBright: 'very bright',
      lightBright: 'bright',
      lightVeryDark: 'very dark',
      lightDark: 'dark',
      satHigh: 'high saturation',
      satMedium: 'medium saturation',
      satLow: 'low saturation',
      satVeryLow: 'very low saturation',
      descTemplate: (h, s, l) => `Hue ≈ ${Math.round(h)}°, Saturation ≈ ${Math.round(s)}%, Lightness ≈ ${Math.round(l)}%`,
      composeName: (light, sat, hue) => {
        const parts = [];
        if (light) parts.push(light);
        if (sat) parts.push(sat);
        if (parts.length) return parts.join(', ') + ' ' + hue;
        return hue;
      }
      ,copiedHex: 'Copied HEX to clipboard'
    };
    const ja = {
      toastUnavailableTitle: 'スポイトは利用不可',
      toastUnavailableLine1: 'お使いのブラウザは EyeDropper API をサポートしていません',
      toastUnavailableLine2: '新しい Chromium 系ブラウザをご利用ください',
      toastResultTitle: '取得した色',
      lineColorPrefix: '色：',
      lineHexPrefix: 'HEX：',
      hueNearWhite: '白に近い',
      hueNearBlack: '黒に近い',
      hueGray: '灰色',
      hueRed: '赤',
      hueOrange: 'オレンジ',
      hueYellow: '黄色',
      hueGreen: '緑',
      hueCyan: 'シアン',
      hueBlue: '青',
      hueIndigo: '藍',
      huePurple: '紫',
      lightVeryBright: 'とても明るい',
      lightBright: '明るめ',
      lightVeryDark: 'とても暗い',
      lightDark: '暗め',
      satHigh: '高彩度',
      satMedium: '中彩度',
      satLow: '低彩度',
      satVeryLow: '極低彩度',
      descTemplate: (h, s, l) => `色相≈${Math.round(h)}°、彩度≈${Math.round(s)}%、明度≈${Math.round(l)}%`,
      composeName: (light, sat, hue) => {
        const parts = [];
        if (light) parts.push(light);
        if (sat) parts.push(sat);
        if (parts.length) return parts.join('・') + 'の' + hue;
        return hue;
      }
      ,copiedHex: 'HEX をクリップボードにコピーしました'
    };
    const packs = { zh, en, ja };
    const p = packs[(lang || 'zh').toLowerCase()] || zh;
    return p[key];
  }
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
  function describeColor(hex, language) {
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);
    let basicHue;
    if (s < 10 && l > 90) {
      basicHue = tt('hueNearWhite');
    } else if (s < 10 && l < 15) {
      basicHue = tt('hueNearBlack');
    } else if (s < 10) {
      basicHue = tt('hueGray');
    } else if (h >= 345 || h < 15) {
      basicHue = tt('hueRed');
    } else if (h >= 15 && h < 45) {
      basicHue = tt('hueOrange');
    } else if (h >= 45 && h < 75) {
      basicHue = tt('hueYellow');
    } else if (h >= 75 && h < 150) {
      basicHue = tt('hueGreen');
    } else if (h >= 150 && h < 210) {
      basicHue = tt('hueCyan');
    } else if (h >= 210 && h < 255) {
      basicHue = tt('hueBlue');
    } else if (h >= 255 && h < 285) {
      basicHue = tt('hueIndigo');
    } else {
      basicHue = tt('huePurple');
    }
    let lightnessDesc = '';
    if (l >= 85) lightnessDesc = tt('lightVeryBright');
    else if (l >= 70) lightnessDesc = tt('lightBright');
    else if (l <= 20) lightnessDesc = tt('lightVeryDark');
    else if (l <= 35) lightnessDesc = tt('lightDark');
    let saturationDesc = '';
    if (s >= 80) saturationDesc = tt('satHigh');
    else if (s >= 50) saturationDesc = tt('satMedium');
    else if (s >= 20) saturationDesc = tt('satLow');
    else saturationDesc = tt('satVeryLow');
    const name = tt('composeName')(lightnessDesc, saturationDesc, basicHue);
    const description = tt('descTemplate')(h, s, l);
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
      swatchEl.style.cursor = 'pointer';
      swatchEl.title = 'Copy HEX';
      swatchEl.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(swatch);
          const copied = document.createElement('div');
          copied.textContent = tt('copiedHex');
          copied.style.fontSize = '11px';
          copied.style.marginTop = '4px';
          copied.style.color = '#16a34a';
          container.appendChild(copied);
          setTimeout(() => copied.remove(), 1200);
        } catch {}
      });
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
      title: tt('toastUnavailableTitle'),
      lines: [tt('toastUnavailableLine1'), tt('toastUnavailableLine2')],
      theme: 'error',
    });
    return;
  }

  const eyeDropper = new EyeDropper();

  eyeDropper
    .open()
    .then((result) => {
      const hex = result.sRGBHex; // 例如 "#RRGGBB"
      const info = describeColor(hex, lang);
      const { r, g, b } = hexToRgb(hex);
      const hsl = rgbToHsl(r, g, b);
      const rgbText = `RGB: ${r}, ${g}, ${b}`;
      const hslText = `HSL: ${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
      showColorToast({
        title: tt('toastResultTitle'),
        swatch: hex,
        lines: [
          `${tt('lineColorPrefix')}${info.name}`,
          `${tt('lineHexPrefix')}${hex}`,
          rgbText,
          hslText,
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
