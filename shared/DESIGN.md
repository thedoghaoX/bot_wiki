# bot_wiki 共用設計規範

- 字型：`"Noto Sans CJK TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif`
- 主題：預設淺色；HTML 以 `prefers-color-scheme: dark` 自動切換深色，並宣告 `color-scheme: light dark`
- 色彩：主色藍 `#2563eb`、成功綠 `#1a7a41`（淺色底需達 WCAG AA）、警告琥珀 `#b45309`、危險紅 `#b91c1c`
- Canvas：只用 `grok/canvas` 元件與其內建主題，不自訂顏色
- 數據：圖表數字一律來自 `shared/*.json`，並在頁面標註「典型區間、隨版本變動」
