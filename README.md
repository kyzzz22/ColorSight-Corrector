# 🎨 ColorSight Corrector: 色覚補正フィルター (色觉矫正滤镜)

## 💡 Introduction (项目简介)

| 语言 | 描述 |
| :--- | :--- |
| **中文 (Zh)** | 这是一个强大的 Chrome 扩展程序，旨在帮助患有各种类型色弱和色盲的用户更清晰地感知和区分网页上的色彩。它通过实时应用融合了色彩矩阵与画面增强的 SVG `feColorMatrix` 滤镜，为用户提供个性化、可调节强度的视觉增强体验。 |
| **日文 (Ja)** | このプロジェクトは、様々なタイプの色覚異常や色盲を持つユーザーが、ウェブ上の色をより明確に認識・識別できるように開発された強力な Chrome 拡張機能です。色彩マトリックスと画質強調を融合した SVG `feColorMatrix` フィルターをリアルタイムで適用することで、強度を調整可能な視覚強化体験を提供します。 |
| **英文 (En)** | This is a powerful Chrome extension designed to help users with various types of color vision deficiency (CVD) or color blindness perceive and distinguish colors on web pages more clearly. It applies an SVG `feColorMatrix` filter that fuses color-correction matrices with image enhancement in real time, providing a personalized, adjustable visual experience. |

---

## ✨ Features (核心功能)

### 中文 (Zh)
- **全面的色彩校正：** 支持六种主要的色觉缺陷类型：红色弱/盲 (Protanomaly/Protanopia)、绿色弱/盲 (Deuteranomaly/Deuteranopia)、蓝色弱/盲 (Tritanomaly/Tritanopia)。
- **校正强度可调：** 精确控制校正强度（0% - 100%），适应个人视觉需求。
- **画面增强：** 独立的饱和度与对比度滑块（各 0% - 200%），可与色彩校正融合使用，让画面更鲜艳清晰。
- **单一滤镜防叠加：** 校正矩阵、饱和度、对比度在数学上合并为**一个** `feColorMatrix`，仅作用于 `<html>` 一次，避免多重叠加导致的失真。
- **站点规则：** 对每个网站可分别设置「跟随全局 / 仅此站开启 / 暂停」，默认跟随全局设置。
- **站点级参数记忆：** 为每个网站可单独记忆模式、强度、饱和度/对比度（「仅此站」一键快照），访问时自动匹配该站设定，其余站点仍跟随全局模板。
- **右键快捷开关：** 在扩展图标或网页上右键 →「切换色彩滤镜」，无需打开弹窗即可全局开/关。
- **色盲模拟预览：** 一键将页面渲染为红/绿/蓝色盲所见（Machado 模拟矩阵），便于对照校正后的增强效果是否到位。
- **页面取色器：** 集成 EyeDropper API，快速取色并显示颜色名称、HEX、RGB、HSL 与色相/饱和度/亮度描述；点击色块可一键复制 HEX。
- **自定义快捷键 ×2：** 取色快捷键（默认 `Alt + Shift + C`）与滤镜开关快捷键（默认 `Alt + Shift + F`）均可通过 UI 自定义。
- **取色不偏色：** 取色期间自动临时挂起滤镜，确保取到页面**原始**颜色。
- **多语言界面：** 简体中文 / 日本語 / English 一键切换，自动跟随浏览器语言。
- **自动保存：** 所有设置保存在本地，应用于所有页面，并随 `storage` 变更实时同步（无需刷新）。

### 日文 (Ja) / 英文 (En) 对照表

| 日本語 (Ja) | 英語 (En) |
| :--- | :--- |
| **包括的な色覚補正:** 6種類（1型・2型・3型の色弱/色盲）に対応。 | **Comprehensive Correction:** Supports six major CVD types: Protanomaly/Protanopia, Deuteranomaly/Deuteranopia, Tritanomaly/Tritanopia. |
| **補正強度調整:** 強度スライダー（0%〜100%）で個々の見え方に最適化。 | **Adjustable Intensity:** Finely control correction intensity (0% - 100%). |
| **画質強調:** 彩度（0%〜200%）とコントラストの独立スライダーを補正と融合。 | **Image Enhancement:** Independent saturation (0% - 200%) and contrast sliders, composable with correction. |
| **重畳防止フィルター:** 補正・彩度・コントラストを単一の `feColorMatrix` に合成し、`<html>` に一度だけ適用。 | **No Double Filtering:** Correction, saturation and contrast are merged into one `feColorMatrix`, applied once on `<html>`. |
| **サイト単位のルール:** サイトごとに「グローバル追従 / このサイトのみ / 停止」を設定可能。 | **Per-Site Rules:** Follow / Enable-only-here / Pause for each website. |
| **サイト単位のカスタム:** サイトごとにモード・強度・彩度・コントラストを保存し自動適用。「このサイトのみ」で即座に保存。 | **Per-Site Presets:** Save mode/intensity/saturation/contrast per website and apply automatically; one-click "This site only". |
| **右クリックで切替:** 拡張アイコンやページの右クリック→「色フィルターを切替」。 | **Right-Click Toggle:** Icon/page context menu → "Toggle color filter", no popup needed. |
| **色覚シミュレーション:** ページを1型/2型/3型色盲の見え方でプレビュー（Machado 行列）。 | **CVD Simulation:** Preview pages as seen with protanopia/deuteranopia/tritanopia (Machado matrices). |
| **ページ色抽出:** EyeDropper API で色名・HEX・RGB・HSL・説明を表示し、クリックで HEX をコピー。 | **On-Page Color Picker:** Shows color name, HEX, RGB/HSL values and description; click swatch to copy HEX. |
| **カスタムショートカット×2:** スポイト（既定 `Alt+Shift+C`）とフィルター切替（既定 `Alt+Shift+F`）を UI で変更可能。 | **Two Custom Hotkeys:** Picker (default `Alt+Shift+C`) and filter toggle (default `Alt+Shift+F`) are configurable. |
| **正確な色抽出:** スポイト中はフィルターを一時停止し、ページ本来の色を取得。 | **Accurate Picking:** The filter is temporarily suspended while picking the original color. |
| **多言語 UI:** 中文 / 日本語 / English、ブラウザ言語に自動追従。 | **Multilingual UI:** 中文 / 日本語 / English, auto-follows browser language. |
| **自動保存・同期:** 設定はローカル保存され、全ページへ即時反映（再読み込み不要）。 | **Auto-Save & Sync:** Settings persist locally and apply to all pages instantly. |

---

## 🚀 Usage & Installation (使用与安装)

**推荐安装方式（最简单、安全、支持自动更新）：**  
直接从 Chrome 网上应用店安装。

- **官方下载链接：** [Chrome Web Store - ColorSight Corrector](https://chromewebstore.google.com/detail/jolkoanakignhnbpbcdmdohkjkiecagk)

### 设置 (中文步骤)
1. 点击浏览器工具栏中的扩展程序图标，打开设置面板（或按 `Ctrl+Shift+E`）。
2. 开启「启用色彩校正」总开关。
3. 选择您的色觉缺陷类型（如 Protanomaly）。
4. 调整校正强度；如需更鲜艳的画面，可上调饱和度 / 对比度。
5. 需要时为特定网站设置「仅此站 / 暂停」，其余默认跟随全局。

### 快捷键 (中文)
- **取色：** 在任意网页按 `Alt + Shift + C`（可自定义）激活取色器。
- **滤镜开关：** 在任意网页按 `Alt + Shift + F`（可自定义）快速开启/关闭滤镜，便于与原图对比。
- **面板：** `Ctrl+Shift+E`（Mac 为 `Command+Shift+E`）打开设置弹窗。

> 提示：滤镜开关与取色快捷键由页面内的扩展脚本监听，仅在普通网页处于激活状态时生效。

### 备选方式：开发者模式本地加载（适用于测试开发版）
#### 中文步骤
1. 从项目仓库下载最新版本 ZIP 文件并解压到一个本地文件夹（例如：`ColorSight-Corrector`）。
2. 在 Chrome 地址栏输入 `chrome://extensions` 并回车。
3. 右上角开启 **开发者模式**。
4. 点击 **加载已解压的扩展程序**，选择解压后的文件夹（包含 `manifest.json` 的文件夹）。
5. 完成加载。**修改代码后请点击该扩展卡片上的「重新加载」，并刷新已打开的测试页面。**

#### 日本語 (Ja) / 英語 (En)

| 日本語 (Ja) | 英語 (En) |
| :--- | :--- |
| **推奨インストール:** Chrome ウェブストアから直接インストール。<br>**公式リンク:** [Chrome Web Store](https://chromewebstore.google.com/detail/jolkoanakignhnbpbcdmdohkjkiecagk) | **Recommended:** Install from Chrome Web Store.<br>**Official Link:** [Chrome Web Store](https://chromewebstore.google.com/detail/jolkoanakignhnbpbcdmdohkjkiecagk) |
| **設定:** ツールバーのアイコン（または `Ctrl+Shift+E`）でパネルを開き、種別・強度・彩度/コントラスト・サイトルールを調整。 | **Settings:** Open the panel from the toolbar icon (or `Ctrl+Shift+E`) to adjust type, intensity, saturation/contrast and site rules. |
| **ショートカット:** スポイト `Alt+Shift+C` / フィルター切替 `Alt+Shift+F` / パネル `Ctrl+Shift+E`（すべて変更可）。 | **Shortcuts:** Picker `Alt+Shift+C` / Toggle filter `Alt+Shift+F` / Panel `Ctrl+Shift+E` (customizable). |
| **代替（デベロッパーモード）:** ZIP を解凍 → `chrome://extensions` → デベロッパーモードON → 「パッケージ化されていない拡張機能を読み込む」。 | **Alternative (Developer Mode):** Unzip → `chrome://extensions` → enable Developer mode → "Load unpacked". |

---

## ⚙️ Technologies Used (使用的技术)
- **Manifest V3 (MV3):** 现代 Chrome 扩展程序架构。
- **SVG `feColorMatrix`:** 将六类色觉校正矩阵、饱和度矩阵与对比度矩阵通过 5×5 齐次矩阵乘法合成为单一滤镜，仅一次应用到 `<html>`。
- **Chrome Storage API:** `storage.local` 保存全局设置，`storage.sync` 同步站点规则，跨页面实时生效。
- **EyeDropper API:** 网页取色；取色期间临时挂起滤镜以保证颜色准确。
- **Chrome Tabs / Scripting API:** 向当前标签页安全注入取色逻辑。

---

## 📦 Release Notes (版本记录)

| 版本 | 变更摘要 |
| :--- | :--- |
| **v1.4** | 新增右键菜单「切换色彩滤镜」；色盲模拟预览（红/绿/蓝色盲视角）；站点级参数记忆（每站模式/强度/饱和度/对比度，自动匹配）。 |
| **v1.3** | 新增画面增强（饱和度 / 对比度）；站点规则（跟随/仅此站/暂停）；多语言界面；滤镜开关自定义快捷键；修复滤镜双重叠加。 |
| **v1.2** | 采用官方 Mac 版扩展基线；矩阵引擎升级；取色结果支持三语描述与复制。 |
| **v1.1** | 增强色彩校正引擎与交互体验。 |
