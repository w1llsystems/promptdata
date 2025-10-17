# Prompt Structurer

Small Node + Express app to help craft and structure prompts for sora2 and veo-3.

Setup

1. Copy .env.example to .env and edit if needed.
2. npm install
3. npm start

The app runs on http://localhost:3000

Notes

- The server defaults to MOCK mode for easy testing. Set MOCK=false and provide `OPENAI_API_KEY` to use real OpenAI API.
- The AI integration is minimal; you can adapt the `aiGenerate` function in `server.js` to your preferred model and provider.
Gemini integration

- You can optionally configure Gemini by setting `GEMINI_API_KEY` and `GEMINI_API_URL` in your `.env` file.
- In the UI check "Usar Gemini (se configurado)" to enable a refinement step that will call your Gemini endpoint with the improved prompt. The server will attach the raw AI response under `ai` in the JSON result.

Notes: The project includes a small Gemini helper at `lib/gemini.js` which expects a standard POST JSON interface. Update `GEMINI_API_URL` to point to your provider endpoint.

Publishing client-only version on GitHub Pages
-------------------------------------------------
If you want a zero-backend version that runs entirely in the browser (no API keys required) you can publish the `docs/` folder to GitHub Pages. I prepared a lightweight client-side generator inside `docs/` which uses a mock generator and adapters.

Suggested flow to publish to the repo `https://github.com/w1llsystems/promptdata`:

1. Fork or push this project into `w1llsystems/promptdata` (or create a new branch). Ensure the `docs/` folder is present in the repo (it is included here).
2. In the repository settings on GitHub, go to Pages and set the source to `Deploy from a branch` -> `main` (or your branch) and folder `docs/`.
3. After a few minutes your site will be available at `https://w1llsystems.github.io/promptdata/` (or the configured page URL).

Notes and caveats
- The `docs/` version is client-side only and does not call Gemini or any external AI service. Use the server version if you need Gemini integration or private API keys.
- Do not expose real API keys in a client-side site.

