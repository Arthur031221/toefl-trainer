# Claude 管道（Cloudflare Worker）

網頁是靜態的，不能放金鑰。這個 Worker 夾在中間：網頁把題目送到 Worker，Worker 用你的
Anthropic 金鑰去問 Claude，再把答案送回網頁。金鑰只存在 Cloudflare，不會出現在網頁原始碼。

## 部署（約 10 分鐘，免費方案就夠）

1. 到 https://console.anthropic.com 申請一把 API 金鑰。這跟 Claude 訂閱是分開計費的。
2. 到 https://dash.cloudflare.com 註冊，左側選 Workers & Pages，Create → Create Worker，取名 `toefl-ai`，Deploy。
3. 進 Worker → Edit code，把 `worker.js` 全部貼進去，Deploy。
4. Worker → Settings → Variables and Secrets 新增：
   - `ANTHROPIC_API_KEY`（Secret）你的金鑰
   - `APP_KEY`（Secret）自己打一串長的亂碼，例如 32 個字元
   - `ALLOW_ORIGIN`（Text）`https://arthur031221.github.io`
   - `MODEL`（Text，可略）預設 `claude-sonnet-5`
5. 複製 Worker 網址（像 `https://toefl-ai.xxx.workers.dev`）。
6. 打開訓練站 → 設定 → AI 管道選「一律用自架管道」，貼上網址與通行碼，按「測試管道」，看到「管道正常」就好了。

## 費用

每天的量大約是出題與批改加起來幾萬個 token，以目前的價格大概是每天零點幾美元，
十一週下來通常在二十美元以內。實際價格以 Anthropic 官網為準。
可以在 Anthropic 後台設每月上限，避免意外。

## 安全

- `APP_KEY` 擋掉路人。它會出現在你自己瀏覽器的 localStorage，但不會出現在 repo 裡。
- `ALLOW_ORIGIN` 限制只有你的 GitHub Pages 網域可以呼叫。
- 真的擔心被亂用就換一把新的 `APP_KEY` 並重新部署。
