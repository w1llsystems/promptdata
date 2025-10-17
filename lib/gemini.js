const fetch = require('node-fetch');

/**
 * Faz chamada ao endpoint Gemini (Generative Language API).
 * Usa X-goog-api-key header por padrão (Google Generative Language API).
 * @param {string} prompt Texto a ser enviado
 * @param {string} apiKey Chave X-goog-api-key ou similar
 * @param {string} url Endpoint (opcional)
 */
async function callGemini(prompt, apiKey, url) {
  if (!apiKey) throw new Error('Gemini API key missing');
  const endpoint = url || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  const payload = { contents: [{ parts: [{ text: prompt }] }] };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': apiKey
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gemini error ${res.status}: ${t}`);
  }

  const data = await res.json();
  return data;
}

module.exports = { callGemini };
