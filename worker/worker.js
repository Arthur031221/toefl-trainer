/**
 * TOEFL Trainer — Claude 管道（Cloudflare Worker）
 *
 * 網頁不持有任何金鑰。金鑰存在 Worker 的 secret 裡，網頁只送題目過來。
 *
 * 需要設定的 secret / 變數：
 *   ANTHROPIC_API_KEY   你的 Anthropic API 金鑰（secret）
 *   APP_KEY             自己取一串長字串，網頁在設定頁填一樣的，擋住路人亂用（secret）
 *   ALLOW_ORIGIN        允許的來源，例如 https://arthur031221.github.io（變數）
 *   MODEL               可選，預設 claude-sonnet-5
 */
const DEFAULT_MODEL = 'claude-sonnet-5';

function cors(env, extra) {
  return Object.assign({
    'Access-Control-Allow-Origin': env.ALLOW_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-App-Key',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  }, extra || {});
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(env) });
    if (request.method !== 'POST') return new Response('POST only', { status: 405, headers: cors(env) });

    if (env.APP_KEY && request.headers.get('X-App-Key') !== env.APP_KEY) {
      return new Response(JSON.stringify({ error: 'bad app key' }), { status: 401, headers: cors(env, { 'Content-Type': 'application/json' }) });
    }

    let body;
    try { body = await request.json(); } catch (e) {
      return new Response(JSON.stringify({ error: 'bad json' }), { status: 400, headers: cors(env, { 'Content-Type': 'application/json' }) });
    }
    const prompt = String(body.prompt || '');
    if (!prompt || prompt.length > 60000) {
      return new Response(JSON.stringify({ error: 'prompt missing or too long' }), { status: 400, headers: cors(env, { 'Content-Type': 'application/json' }) });
    }

    const payload = {
      model: env.MODEL || DEFAULT_MODEL,
      max_tokens: Math.min(Number(body.max_tokens) || 8000, 16000),
      messages: [{ role: 'user', content: prompt }],
    };
    if (body.json) payload.system = 'Reply with only the JSON the user asks for. No preamble, no code fence, no commentary.';

    const up = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });

    if (!up.ok) {
      const t = await up.text();
      return new Response(JSON.stringify({ error: 'upstream', status: up.status, detail: t.slice(0, 500) }),
        { status: 502, headers: cors(env, { 'Content-Type': 'application/json' }) });
    }
    const data = await up.json();
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
    return new Response(JSON.stringify({ text, usage: data.usage || null }),
      { headers: cors(env, { 'Content-Type': 'application/json' }) });
  }
};
