const { generateCompliantPrompt } = require('../lib/mock');

function assert(cond, msg) { if (!cond) throw new Error(msg || 'Afirmação falhou'); }

function run() {
  console.log('Testando adapters e generateCompliantPrompt...');
  const idea = 'Homem em pé na beira do lago solta um pum';
  const out = generateCompliantPrompt(idea, { steps: 3, tags: ['natureza'] });
  console.log(JSON.stringify(out, null, 2));
  assert(out.revised && out.structured, 'Saída deve conter revised e structured');
  assert(out.structured.platformHints && out.structured.platformHints.sora2, 'Deve ter hints para sora2');
  assert(out.structured.platformHints['veo-3'], 'Deve ter hints para veo-3');
  console.log('Adapters -> OK');
}

try { run(); } catch (e) { console.error('Falha:', e.message); process.exit(1); }
