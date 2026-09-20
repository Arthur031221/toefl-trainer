# TOEFL Trainer

新制托福（iBT 2026，1–6 級分）每日訓練站。閱讀、聽力、寫作、口說，
題型與時間限制對齊 ETS 2026 測驗規格。

網址：https://arthur031221.github.io/toefl-trainer/

## 每日六個區塊

| | 內容 | 時間 | 需要 AI |
|---|---|---|---|
| A | Complete the Words 60 格 | 60 分 | 出題 |
| B | Listen and Choose a Response 40 題 | 45 分 | 出題 |
| C | 整段計時（閱讀或聽力） | 45 分 | 出題 |
| D | Build a Sentence 10 題 + Email 或 Discussion | 60 分 | 出題與批改 |
| E | Listen and Repeat 7 句 + Interview 4 題 | 45 分 | 內建題庫即可 |
| F | 錯題本分類 | 20 分 | 不需要 |

口說的評分（Listen and Repeat 的逐字比對）在瀏覽器本機算，不需要連線。

## AI 管道

網頁本身不持有金鑰。設定頁可以選三種來源：

- **claude.ai 內建**：把同一份 `index.html` 發布成 claude.ai artifact 時自動可用，不需要設定。缺點是那個環境的框架擋麥克風。
- **自架管道**：部署 `worker/worker.js` 到 Cloudflare Workers，填入網址與通行碼。這是在 GitHub Pages 上全自動的做法，見 `worker/README.md`。
- **手動貼上**：不需要任何設定。按出題時會跳出視窗，把題目複製到任一個 Claude 對話，再把回覆貼回來。

## 麥克風

這個頁面用 https 從 GitHub Pages 開啟時是最上層頁面，麥克風與語音辨識可以正常使用，
iPhone Safari 也可以。放在 claude.ai 的 artifact 框架裡則會被擋（NotAllowedError），
那是平台的沙箱限制，網頁端無法繞過。

## 檔案

- `index.html` 整個應用，單一檔案
- `.nojekyll` 讓 GitHub Pages 原樣提供檔案
- `worker/` Cloudflare Worker 管道
