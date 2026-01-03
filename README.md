# 🎨 ColorSight Corrector: 色覚補正フィルター (色觉矫正滤镜)

## 💡 Introduction (项目简介)

| 语言 | 描述 |
| :--- | :--- |
| **中文 (Zh)** | 这是一个强大的 Chrome 扩展程序，旨在帮助患有各种类型色弱和色盲的用户更清晰地感知和区分网页上的色彩。它通过实时应用先进的 CSS 色彩矩阵滤镜，为用户提供个性化、可调节强度的视觉增强体验。 |
| **日文 (Ja)** | このプロジェクトは、様々なタイプの色覚異常や色盲を持つユーザーが、ウェブ上の色をより明確に認識・識別できるように開発された強力な Chrome 拡張機能です。高度な CSS カラーマトリックスフィルターをリアルタイムで適用することで、強度を調整可能な、パーソナライズされた視覚強化体験を提供します。 |
| **英文 (En)** | This is a powerful Chrome extension designed to help users with various types of color vision deficiency (CVD) or color blindness perceive and distinguish colors on web pages more clearly. It works by applying advanced CSS color matrix filters in real-time, providing a personalized and adjustable-intensity visual enhancement experience. |

---

## ✨ Features (核心功能)

### 中文 (Zh)
- **全面的色彩校正：** 支持六种主要的色觉缺陷类型：先色弱/盲 (Protanomaly/Protanopia)、次色弱/盲 (Deuteranomaly/Deuteranopia)、三色弱/盲 (Tritanomaly/Tritanopia)。
- **强度可调（优化曲线）：** 用户可以精确控制滤镜强度（0% - 200%+），饱和度超过 100% 时斜率更大（最高 3.0 倍）以增强鲜艳度，对比度超过 100% 时斜率更缓（最高 1.6 倍）以避免过曝。
- **页面取色器：** 集成了 EyeDropper API，允许用户快速从页面上取色，并显示其 HEX 值、RGB/HSL 值以及中文颜色描述。
- **自定义快捷键：** 支持用户通过 UI 自定义取色快捷键，实现快速、无干扰的操作。
- **自动保存：** 所有设置（模式、强度、启用状态、快捷键）都会在本地自动保存并应用于所有页面。
- **稳定性提升：** 通过动态 SVG 滤镜 ID（带时间戳）强制浏览器刷新，确保强度调节实时生效。

### 日文 (Ja) / 英文 (En) 对照表

| 日本語 (Ja) | 英語 (En) |
| :--- | :--- |
| **包括的な色覚補正:** 主要な6種類の色覚特性に対応しています（1型色覚異常/色盲、2型色覚異常/色盲、3型色覚異常/色盲）。 | **Comprehensive Correction:** Supports six major types of color vision deficiency: Protanomaly/Protanopia, Deuteranomaly/Deuteranopia, and Tritanomaly/Tritanopia. |
| **強度調整可能（最適化カーブ）:** フィルター強度を0%〜200%+で精密制御。100%超の飽和度は急勾配（最大3.0倍）で鮮やかさを強化、コントラストは緩勾配（最大1.6倍）で過曝を防止。 | **Adjustable Intensity (Optimized Curves):** Precise control from 0% to 200%+. Saturation beyond 100% has steeper slope (up to 3.0×) for vivid colors; contrast has gentler slope (up to 1.6×) to prevent overexposure. |
| **ページ色抽出機能:** EyeDropper APIを統合し、ページから色を素早く抽出し、HEX値、RGB/HSL値、中国語の色の説明を表示します。 | **On-Page Color Picker:** Integrates the EyeDropper API, allowing users to quickly pick colors and display their HEX, RGB/HSL values, and a descriptive Chinese name. |
| **カスタムショートカット:** ユーザーはUIを通じて色抽出ショートカットをカスタマイズでき、迅速で邪魔にならない操作を実現します。 | **Custom Hotkeys:** Users can set a custom hotkey via the UI to trigger the color picker for fast, non-disruptive operation. |
| **自動保存:** すべての設定（モード、強度、有効化ステータス、ショートカット）はローカルに自動保存され、すべてのページに適用されます。 | **Automatic Persistence:** All settings (mode, intensity, enabled status, shortcut) are automatically saved locally and applied across all pages. |
| **安定性向上:** 動的SVGフィルターID（タイムスタンプ付き）によりブラウザの再描画を強制、強度調整が確実に反映されます。 | **Improved Stability:** Dynamic SVG filter IDs with timestamps force browser redraw, ensuring intensity changes take effect immediately. |

---

## 🆕 Recent Updates (最近优化 - v1.2.0)

本次更新重点优化了颜色校正核心引擎与用户体验：

- **矩阵乘法引擎**：新增自定义 `multiplyMatrices` 函数，支持 4×5 矩阵扩展至 5×5 乘法，为未来多重效果叠加（如饱和度 + 对比度）奠定基础。
- **更人性化的调节曲线**：
  - 饱和度：100% 以上斜率显著增大（最高 3.0 倍），可调出更鲜艳色彩，显著辅助辨色。
  - 对比度：100% 以上斜率放缓（最高 1.6 倍），避免轻微调节导致过曝或细节丢失。
- **动态重绘修复**：SVG 滤镜 ID 添加时间戳（`color-corrector-filter-${timestamp}`），彻底解决调节滑块后页面无反应的问题。
- **UI 优化**：设置面板布局与交互更直观、易用。

这些改进使色彩增强更自然、响应更快、更符合人眼感知特性。

---

## 🚀 Usage & Installation (使用与安装)

**推荐安装方式（最简单、安全、支持自动更新）：**  
直接从 Chrome 网上应用店安装。

- **官方下载链接：** [Chrome Web Store - ColorSight Corrector](https://chromewebstore.google.com/detail/jolkoanakignhnbpbcdmdohkjkiecagk)

### 设置
1. 点击浏览器工具栏中的扩展程序图标，打开设置面板。
2. 选择您的色觉缺陷类型（如 Protanomaly）。
3. 调整强度滑块以找到最舒适的显示效果。

### 取色功能
使用您自定义的快捷键（默认为 `Alt + Shift + C`）在任何网页上激活取色器。

### 备选方式：开发者模式本地加载（适用于测试开发版）
#### 中文步骤
1. 从项目仓库下载最新版本 ZIP 文件并解压到一个本地文件夹（例如：`ColorSight-Corrector`）。
2. 在 Chrome 地址栏输入 `chrome://extensions` 并回车。
3. 右上角开启 **开发者模式**。
4. 点击 **加载已解压的扩展程序**，选择解压后的文件夹（包含 `manifest.json` 的文件夹）。
5. 完成加载。

#### 日本語 (Ja) / 英語 (En)

| 日本語 (Ja) | 英語 (En) |
| :--- | :--- |
| **推奨インストール:** Chrome ウェブストアから直接インストール（最も簡単、安全、自動更新）。<br>**公式リンク:** [Chrome Web Store](https://chromewebstore.google.com/detail/jolkoanakignhnbpbcdmdohkjkiecagk) | **Recommended Installation:** Install directly from the Chrome Web Store (easiest, secure, auto-updates).<br>**Official Link:** [Chrome Web Store](https://chromewebstore.google.com/detail/jolkoanakignhnbpbcdmdohkjkiecagk) |
| **設定:**<br>1. ブラウザツールバーの拡張機能アイコンをクリックして設定パネルを開く。<br>2. 色覚特性のタイプを選択（例：Protanomaly）。<br>3. 強度スライダーを調整して最適な表示を見つける。 | **Settings:**<br>1. Click the extension icon in the browser toolbar to open the settings panel.<br>2. Select your type of color vision deficiency (e.g., Protanomaly).<br>3. Adjust the intensity slider to find the most comfortable viewing effect. |
| **色抽出:** カスタムショートカット（デフォルト：`Alt + Shift + C`）で任意のページで色抽出を起動。 | **Color Picker:** Use your custom hotkey (default: `Alt + Shift + C`) to activate the color picker on any web page. |
| **代替（デベロッパーモード）:** ローカルバージョンをテストする場合に使用。<br>1. ZIP をダウンロード・解凍。<br>2. `chrome://extensions` を開く。<br>3. デベロッパーモードをオン。<br>4. 「パッケージ化されていない拡張機能を読み込む」でフォルダを選択。 | **Alternative (Developer Mode):** For testing local versions.<br>1. Download and extract ZIP.<br>2. Open `chrome://extensions`.<br>3. Enable Developer mode.<br>4. Load unpacked folder. |

---

## ⚙️ Technologies Used (使用的技术)
- **Manifest V3 (MV3):** 现代 Chrome 扩展程序架构。
- **Chrome Scripting API:** 用于安全地将取色逻辑注入到当前标签页。
- **EyeDropper API:** 用于网页上的高效色彩采集。
- **CSS Filters (`<feColorMatrix>`):** 基于 SVG Color Matrix 的复杂色彩校正算法（支持动态矩阵乘法与曲线优化）。
