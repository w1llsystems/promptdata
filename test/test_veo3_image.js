const { generateCompliantPrompt } = require('../lib/mock');

function assert(cond, msg) { if (!cond) throw new Error(msg || 'Afirmação falhou'); }

function run() {
  console.log('Testando imageReference em VEO-3...');
  const idea = 'Unboxing de produto para anúncio';
  const img = 'image://assets/box_front.jpg';
  const out = generateCompliantPrompt(idea, { steps: 2, imageRef: img, tags: ['unboxing','produto'] });
  const veo = out.structured.platformHints['veo-3'];
  console.log(veo.prompt);
  assert(veo.prompt.includes('IMAGE='), 'Header deve incluir IMAGE= quando imageReference for fornecida');
  assert(veo.prompt.includes('box_front.jpg') || veo.prompt.includes('assets/box_front.jpg'), 'Prompt deve conter referência à imagem');
  console.log('imageReference -> OK');
}

try { run(); } catch (e) { console.error('Falha:', e.message); process.exit(1); }
