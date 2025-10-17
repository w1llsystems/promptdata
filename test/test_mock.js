const { mockGenerate, mockSequential } = require('../lib/mock');

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Afirmação falhou');
}

async function run() {
  console.log('Executando testes de mock...');

  const idea = 'Um vídeo curto sobre plantio urbano';
  const gen = mockGenerate(idea, 'sora2', 3);
  assert(gen.revised && gen.structured, 'mockGenerate deve retornar "revised" e "structured"');
  assert(gen.variants && gen.variants.length === 3, 'Devem existir 3 variantes');
  console.log('mockGenerate -> OK');

  const seq = mockSequential(idea, 4, 'veo-3');
  assert(Array.isArray(seq) && seq.length === 4, 'mockSequential deve retornar 4 passos');
  assert(seq[0].prompt && seq[0].title, 'Cada passo deve conter "prompt" e "title"');
  console.log('mockSequential -> OK');

  console.log('Todos os testes passaram.');
}

run().catch(e => {
  console.error('Teste falhou:', e.message);
  process.exit(1);
});
