require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const { mockGenerate, mockSequential, generateCompliantPrompt, generateDetailedPrompt } = require('./lib/mock');
const { callGemini } = require('./lib/gemini');

const app = express();
const PORT = process.env.PORT || 3000;
const MOCK = process.env.MOCK ? process.env.MOCK === 'true' : true; // default to true for easy testing

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para gerar prompts estruturados
app.post('/api/generate', async (req, res) => {
  const { idea, target, variants } = req.body;
  if (!idea) return res.status(400).json({ error: 'ideia é obrigatória' });

  try {
    const result = MOCK ? mockGenerate(idea, target, variants) : await aiGenerate(idea, target, variants);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'falha na geração' });
  }
});

// Endpoint para gerar prompts sequenciais (por exemplo para vídeos contínuos)
app.post('/api/sequential', async (req, res) => {
  const { idea, steps = 5, target } = req.body;
  if (!idea) return res.status(400).json({ error: 'ideia é obrigatória' });

  try {
    const seq = MOCK ? mockSequential(idea, steps, target) : { error: 'AI sequential generation not implemented' };
    res.json({ idea, steps, sequence: seq });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'falha na geração sequencial' });
  }
});

// Endpoint para melhorar/estruturar prompt (sem gerar mídia)
app.post('/api/improve', async (req, res) => {
  const { idea, target = 'veo-3', imageRef, steps = 3, variants = 1 } = req.body;
  if (!idea) return res.status(400).json({ error: 'ideia é obrigatória' });

  try {
    const out = (req.body.detailed && generateDetailedPrompt) ? generateDetailedPrompt(idea, { steps, imageRef }) : generateCompliantPrompt(idea, { steps, imageRef, tags: [] });
    // If useAI flag is set and GEMINI_API_KEY is present, call Gemini for refinement
    if (req.body.useAI) {
      const key = req.body.geminiKey || process.env.GEMINI_API_KEY;
      if (key) {
        const promptForAI = out.revised + '\n\nConverta para JSON estruturado com campos: title, scenes, camera, lighting, dialogue_suggestion, safetyNotes.';
        try {
          const gresp = await callGemini(promptForAI, key, process.env.GEMINI_API_URL);
          out.ai = gresp;
        } catch (e) {
          console.error('Gemini call failed', e.message);
          out.aiError = e.message;
        }
      } else {
        out.aiError = 'Gemini key not provided';
      }
    }
    // adapte para a plataforma solicitada
    const platformPrompt = out.structured.platformHints[target] || out.structured.platformHints['veo-3'];
    res.json({ revised: out.revised, structured: out.structured, platformPrompt, ai: out.ai || null, aiError: out.aiError || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'falha ao melhorar prompt' });
  }
});
// Usamos mocks do módulo `lib/mock.js` (importado no topo)

async function aiGenerate(idea, target = 'sora2', variants = 2) {
  // placeholder for real AI integration (OpenAI, Anthropic, etc.)
  // This example uses OpenAI but leaves implementation minimal for user API key handling
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const system = `Você é um engenheiro de prompts. Receba uma ideia curta e produza:\n1) Um prompt revisado (clareza e instruções).\n2) Objetos de prompt estruturados para sora2 e veo-3 com mapeamento de campos.\n3) Um conjunto de ${variants} variantes de prompt.\nResponda apenas em JSON.`;

  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: `Idea: ${idea}\nTarget: ${target}\nVariants: ${variants}` }
    ],
    max_tokens: 800
  };

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  const data = await r.json();
  // try to parse JSON from assistant
  const text = data?.choices?.[0]?.message?.content || '';
  try {
    return JSON.parse(text);
  } catch (e) {
    return { raw: text };
  }
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
