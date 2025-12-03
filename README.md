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

* **全面的色彩校正：** 支持六种主要的色觉缺陷类型：先色弱/盲 (Protanomaly/Protanopia)、次色弱/盲 (Deuteranomaly/Deuteranopia)、三色弱/盲 (Tritanomaly/Tritanopia)。
* **强度可调：** 用户可以精确控制滤镜的强度（0% - 100%），以适应个人的视觉需求。
* **页面取色器：** 集成了 EyeDropper API，允许用户快速从页面上取色，并显示其 HEX 值、RGB/HSL 值以及中文颜色描述。
* **自定义快捷键：** 支持用户通过 UI 自定义取色快捷键，实现快速、无干扰的操作。
* **自动保存：** 所有设置（模式、强度、启用状态、快捷键）都会在本地自动保存并应用于所有页面。

### 日文 (Ja) / 英文 (En) 对照表

| 日本語 (Ja) | 英語 (En) |
| :--- | :--- |
| * **包括的な色覚補正:** 主要な6種類の色覚特性に対応しています（1型色覚異常/色盲、2型色覚異常/色盲、3型色覚異常/色盲）。 | * **Comprehensive Correction:** Supports six major types of color vision deficiency: Protanomaly/Protanopia, Deuteranomaly/Deuteranopia, and Tritanomaly/Tritanopia. |
| * **強度調整可能:** ユーザーは個々のニーズに合わせてフィルター強度（0%〜100%）を正確に制御できます。 | * **Adjustable Intensity:** Users can precisely control the filter's intensity (0% - 100%) to suit their individual visual needs. |
| * **ページ色抽出機能:** EyeDropper APIを統合し、ページから色を素早く抽出し、HEX値、RGB/HSL値、中国語の色の説明を表示します。 | * **On-Page Color Picker:** Integrates the EyeDropper API, allowing users to quickly pick colors and display their HEX, RGB/HSL values, and a descriptive Chinese name. |
| * **カスタムショートカット:** ユーザーはUIを通じて色抽出ショートカットをカスタマイズでき、迅速で邪魔にならない操作を実現します。 | * **Custom Hotkeys:** Users can set a custom hotkey via the UI to trigger the color picker for fast, non-disruptive operation. |
| * **自動保存:** すべての設定（モード、強度、有効化ステータス、ショートカット）はローカルに自動保存され、すべてのページに適用されます。 | * **Automatic Persistence:** All settings (mode, intensity, enabled status, shortcut) are automatically saved locally and applied across all pages. |

---

## 🚀 Usage & Installation (使用与安装)

**重要提示：** 本扩展程序需通过 Chrome 的**开发者模式**手动加载。

### 中文 (Zh)

#### 📥 安装步骤（本地导入）

1.  **下载：** 下载项目的最新版本 ZIP 文件（[链接到您的 ZIP 文件]）。
2.  **解压：** 将下载的 ZIP 文件解压到一个您方便找到的本地文件夹中（例如：`ColorSight-Corrector`）。
3.  **打开扩展程序管理页面：** 在 Chrome 浏览器地址栏输入 `chrome://extensions` 并回车。
4.  **开启开发者模式：** 在右上角，打开 **“开发者模式”** 开关。
5.  **导入：** 点击 **“加载已解压的扩展程序”** 按钮，然后选择您在第 2 步中解压的文件夹（即包含 `manifest.json` 文件的那个文件夹）。
6.  **完成：** 扩展程序应已成功加载并显示在列表中。

#### 设置

1.  点击浏览器工具栏中的扩展程序图标，打开设置面板。
2.  选择您的色觉缺陷类型（如 Protanomaly）。
3.  调整强度滑块以找到最舒适的显示效果。

#### 取色

使用您自定义的快捷键（默认为 `Alt + Shift + C`）在任何网页上激活取色器。

### 日本語 (Ja) / 英語 (En)

| 日本語 (Ja) | 英語 (En) |
| :--- | :--- |
| **📥 インストール手順（ローカルインポート）** | **📥 Installation Steps (Local Import)** |
| 1. **ダウンロード:** プロジェクトの最新版 ZIP ファイルをダウンロードしてください（[ZIP ファイルへのリンク]）。 | 1. **Download:** Download the latest version ZIP file of the project ([Link to your ZIP file]). |
| 2. **解凍:** ダウンロードした ZIP ファイルを、アクセスしやすいローカルフォルダーに解凍します（例：`ColorSight-Corrector`）。 | 2. **Extract:** Unzip the downloaded file into an easily accessible local folder (e.g., `ColorSight-Corrector`). |
| 3. **拡張機能管理ページを開く:** Chrome のアドレスバーに `chrome://extensions` と入力し、Enterキーを押します。 | 3. **Open Extensions Page:** In your Chrome address bar, type `chrome://extensions` and press Enter. |
| 4. **デベロッパーモードを有効にする:** 右上隅にある **“デベロッパーモード”** のトグルスイッチをオンにします。 | 4. **Enable Developer Mode:** Turn on the **“Developer mode”** toggle switch in the top right corner. |
| 5. **インポート:** **“パッケージ化されていない拡張機能を読み込む”** ボタンをクリックし、ステップ2で解凍したフォルダー（`manifest.json` ファイルを含むフォルダー）を選択します。 | 5. **Load:** Click the **“Load unpacked”** button and select the folder you extracted in step 2 (the folder containing `manifest.json`). |
| 6. **完了:** 拡張機能が正常に読み込まれ、リストに表示されます。 | 6. **Done:** The extension should now be successfully loaded and displayed in the list. |
| **設定:** | **Settings:** |
| 1. ブラウザのツールバーにある拡張機能アイコンをクリックして、設定パネルを開きます。 2. 色覚特性のタイプを選択します（例：Protanomaly）。 3. 強度スライダーを調整して、最も快適な表示効果を見つけます。 | 1. Click the extension icon in the browser toolbar to open the settings panel. 2. Select your type of color vision deficiency (e.g., Protanomaly). 3. Adjust the intensity slider to find the most comfortable viewing effect. |
| **色抽出:** カスタムショートカット（デフォルトは `Alt + Shift + C`）を使用して、任意のウェブページで色抽出機能を有効にします。 | **Color Picker:** Use your custom hotkey (default is `Alt + Shift + C`) to activate the color picker on any web page. |

---

## ⚙️ Technologies Used (使用的技术)

* **Manifest V3 (MV3):** 现代 Chrome 扩展程序架构。
* **Chrome Scripting API:** 用于安全地将取色逻辑注入到当前标签页。
* **EyeDropper API:** 用于网页上的高效色彩采集。
* **CSS Filters (`<feColorMatrix>`):** 基于 SVG Color Matrix 的复杂色彩校正算法。
