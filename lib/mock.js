// Módulo de mocks para geração de prompts
function mockGenerate(idea, target = 'sora2', variants = 2) {
  const enhanced = enhanceIdea(idea);
  const base = enhanced;
  // run validations
  const validation = Object.assign({}, checkSensitive(idea), checkAmbiguity(idea));

  const outputs = {
    revised: base,
    structured: {
      sora2: {
        prompt: base + ' [FORMATO SORA2]\nA saída deve ser JSON estruturado com campos: title, instructions, language.',
        fields: { language: 'pt', style: 'direto', max_tokens: 256 }
      },
      'veo-3': {
        prompt: base + ' [FORMATO VEO-3]\nUse marcações de cena e duração aproximada.',
        fields: { language: 'pt', style: 'visual', target_fps: 30 }
      }
    },
    variants: Array.from({ length: variants }).map((_, i) => ({
      name: `var-${i + 1}`,
      prompt: base + ` (variante ${i + 1})`
    })),
    validation
  };
  return outputs;
}

function mockSequential(idea, steps = 5, target = 'sora2') {
  // Gera uma sequência simples: resumo do passo + prompt adaptado ao target
  return Array.from({ length: steps }).map((_, i) => {
    const idx = i + 1;
    return {
      step: idx,
      title: `Passo ${idx}: desenvolvimento de cena`,
      note: `Expanda a ideia "${idea}" no passo ${idx} com foco na ação principal.`,
      prompt: `(${target}) ${idea} - Passo ${idx}: descreva 1 cena, tempo ~${10 + idx * 5}s, foco no personagem e ação.`
    };
  });
}

const { toSora2, toVeo3 } = require('./adapters');
const { generateDetailed } = require('./templates');
const { checkSensitive, checkAmbiguity } = require('./validation');
const { getTemplate } = require('./templates_catalog');

function generateCompliantPrompt(idea, opts = {}) {
  const enhancedIdea = enhanceIdea(idea);
  const validation = { ...checkSensitive(idea), ...checkAmbiguity(idea) };
  if (opts.template) {
    const tpl = getTemplate(opts.template);
    if (tpl && tpl.defaults && tpl.defaults.steps) opts.steps = opts.steps || tpl.defaults.steps;
  }
  // opts: { title, language, approx_total_duration_s, tags, steps, target }
  const title = opts.title || `Vídeo: ${idea.split(' ').slice(0,6).join(' ')}`;
  const language = opts.language || 'pt-BR';
  const steps = opts.steps || 4;
  const approx_total_duration_s = opts.approx_total_duration_s || steps * 8;
  const tags = opts.tags || [];

  const scenes = Array.from({ length: steps }).map((_, i) => ({
    step: i + 1,
    title: `Cena ${i + 1}`,
    visual_description: `Descrição visual da cena ${i + 1} relacionada a ${enhancedIdea}`,
    main_action: `Ação principal do passo ${i + 1}`,
    audio_cue: `Som e música sugestão ${i + 1}`,
    duration_s: Math.round(approx_total_duration_s / steps),
    shot_instructions: `Instruções de tomada para cena ${i + 1}`
  }));

  const structured = {
    title,
    language,
    approx_total_duration_s,
    tags,
    scenes,
    platformHints: {},
    safetyNotes: 'Evitar conteúdo sensível; seguir políticas de conteúdo da plataforma.'
  };
  if (opts.imageRef) structured.imageReference = opts.imageRef;

  structured.platformHints.sora2 = toSora2(structured);
  structured.platformHints['veo-3'] = toVeo3(structured);

  // Retorna estruturas prontas e também o prompt base revisado (melhorado)
  return { revised: enhancedIdea, structured, validation };
}

// Função simples para enriquecer a ideia base: adiciona detalhes visuais e específicos
function enhanceIdea(idea) {
  const low = idea.toLowerCase();
  let out = idea;
  // heurísticas simples
  if (low.includes('praia') && low.includes('por do sol')) {
    out = `${idea}, ao fundo o mar calmo, céu com tons alaranjados do pôr do sol, ondas suaves, areia limpa e textura levemente úmida. O vento suave movimenta o cabelo da mulher e a pelagem do cachorro.`;
  } else if (low.includes('praia')) {
    out = `${idea}, cenário de praia com areia limpa, mar ao fundo e brisa suave.`;
  }

  // detectar cachorro e sugerir raça
  if (low.includes('cachorro') && !low.match(/golden|labrador|poodle|beagle/)) {
    out += ' O cachorro é um Golden Retriever amigável, pelagem dourada e movimenta-se com entusiasmo.';
  }

  // adicionar detalhe de câmera e tempo quando não houver
  if (!low.includes('close') && !low.includes('close-up')) {
    out += ' Filmar em vertical com cortes: plano médio para abertura, close-up para textura/movimento.';
  }

  return out;
}

function generateDetailedPrompt(idea, opts = {}) {
  const det = generateDetailed(idea, opts);
  det.structured.platformHints = {
    sora2: toSora2(det.structured),
    'veo-3': toVeo3(det.structured)
  };
  return det;
}

module.exports = { mockGenerate, mockSequential, generateCompliantPrompt, generateDetailedPrompt };
