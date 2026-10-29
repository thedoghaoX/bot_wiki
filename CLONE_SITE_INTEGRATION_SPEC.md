# 分身官網引流整合規格（Bot Wiki → 官網）

## 目的
讓分身維護的官網能連到公開 Bot Wiki，並把讀者導回官網下載頁。

## 入口與連結
| 位置 | 連結目標 | 文字 |
|---|---|---|
| 官網頂部選單 | `bot_wiki/index.html` | 知識庫 |
| 官網下載頁側欄 | `pages/smith/lmwbot-system-guide.html` | 使用指南 |
| 官網比較頁 | `pages/smith/model-providers-live-benchmark.html` | 模型實測 |
| Bot Wiki 每頁底部 | 官網下載頁 | 立即下載 |

## 視覺規範
- 字型：`Noto Sans CJK TC`，備援 `PingFang TC`、`Microsoft JhengHei`。
- 預設淺色主題、圓角卡片、單欄閱讀寬度不超過 960px。
- 全站繁體中文，零日文字元。

## 內容紅線（公開版）
- 禁止出現任何內部機器代號、主機名稱或內網位址。
- 禁止出現認電路與工程圖辨識的內部演算法細節、參數或題庫內容。
- 禁止出現內部流程代號與內部專案代號；對外一律以白話描述功能。
- 只放已公開的成績摘要，不放原始考卷或標準答案。

## 上架前檢查
1. `python3 scripts/check_no_jp_font_or_text.py <檔案…>`：`violation_count` 必為 0。
2. `python3 scripts/precommit_scan.py bot_wiki`：`hits` 必為 0。
3. 人工抽查一次內部代號關鍵字；推送前取得老闆核准。
