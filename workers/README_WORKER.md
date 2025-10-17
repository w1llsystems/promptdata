Cloudflare Worker proxy for Gemini (safe secret storage)
=====================================================

Purpose
-------
This Worker proxies requests from the static GH-Pages site to the Gemini Generative Language API, adding the `X-goog-api-key` header from a secret stored in the Worker environment. The repository must NOT contain the API key — set it as a secret in Cloudflare.

How it works
------------
- The GH-Pages site (docs/) sends a POST to the Worker URL with the request body expected by Gemini (the `contents` array).
- The Worker adds the `X-goog-api-key` header using the secret and forwards the request to Gemini.
- The Worker returns Gemini's response to the client.

Deploy with Wrangler (recommended)
----------------------------------
1. Install wrangler: https://developers.cloudflare.com/workers/cli-wrangler/install

```bash
npm install -g wrangler
```

2. Authenticate wrangler with your Cloudflare account:

```bash
wrangler login
```

3. Create a `wrangler.toml` in this `workers/` folder (example below). Replace `your-account-id` and choose a name.

Example `wrangler.toml`:

```toml
name = "promptdata-gemini-proxy"
main = "./worker.js"
compatibility_date = "2025-10-17"
account_id = "your-account-id"
```

4. Publish the worker (first, set the secret):

```bash
cd workers
wrangler secret put GEMINI_API_KEY
# you will be prompted to paste your API key; it will be stored securely in Cloudflare
wrangler publish
```

5. After publish, note the Worker route or URL. Configure your GH-Pages site to POST to that URL.

Security notes
--------------
- Do NOT store the API key in the repo or in client-side code.
- Consider adding additional checks in the Worker: a short-lived token mechanism, request origin validation, rate limiting, and logging (but avoid logging secrets).
- Cloudflare Worker secrets are managed via Wrangler and the Cloudflare dashboard and are safe for this usage.

CORS and GitHub Pages
---------------------
If your GH-Pages site is hosted at `https://w1llsystems.github.io/promptdata/`, set that origin as allowed in your worker logic. The included `worker.js` echoes the `Origin` header back in `Access-Control-Allow-Origin` for convenience. For stricter security, replace the echo logic with an explicit allowlist check like:

```js
const ALLOWED = ['https://w1llsystems.github.io']
const origin = req.headers.get('Origin')
if(!ALLOWED.includes(origin)) return new Response(null,{status:403})
```

This prevents other sites from using your Worker even if they learn its URL.

Alternatives
------------
- Use Vercel Serverless Functions and set the env var in the Vercel project settings.
- Use a small server (Heroku, AWS Lambda) but ensure env secrets are used and repo does not contain keys.
