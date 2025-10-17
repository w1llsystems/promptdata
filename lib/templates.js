// Gerador de prompt detalhado: cenas, câmera, iluminação, ambiente, personagens
function generateDetailed(idea, opts = {}) {
  const steps = opts.steps || 5;
  const title = opts.title || `Projeto: ${idea.split(' ').slice(0,6).join(' ')}`;
  const language = opts.language || 'pt-BR';
  const approx_total_duration_s = opts.approx_total_duration_s || steps * 8;

  // Exemplo de personagem reutilizável
  const characters = (opts.characters && opts.characters.length) ? opts.characters : [
    {
      id: 'char-1',
      name: 'Protagonista',
      age: 'adulto',
      description: 'Aparência neutra, roupa casual, expressivo',
      role: 'apresentador / demonstrador',
      reuseTags: ['lead','presenter']
    }
  ];

  const scenes = Array.from({ length: steps }).map((_, i) => {
    const idx = i + 1;
    return {
      step: idx,
      title: `Cena ${idx}`,
      summary: `Resumo da cena ${idx} para ${idea}`,
      visual_description: `Composição da cena ${idx}: plano, elementos, cor, props` ,
      main_action: `Ação principal do personagem (ex: abrir a caixa, mostrar produto)` ,
      dialogue_suggestion: `Texto sugerido para narração ou falas (curto)` ,
      audio_cue: `Ambiente sonoro e efeitos (ex: som de desembrulhar)` ,
      duration_s: Math.round(approx_total_duration_s / steps),
      camera: {
        angle: idx === 1 ? 'plano médio' : 'close-up',
        movement: idx === 1 ? 'pan suave' : 'sem movimento',
        lens: idx === steps ? '50mm' : '35mm',
        settings: { iso: 200, aperture: 'f/2.8', shutter: '1/50' }
      },
      lighting: {
        type: idx === 1 ? 'luz natural suave' : 'key light suave + fill',
        color_temp_k: 5600
      },
      environment: {
        location: opts.location || 'estúdio / cenário controlado',
        background: 'limpo, neutro',
        props: ['caixa', 'produto', 'mesa compacta']
      },
      shot_instructions: `Instruções adicionais: manter continuidade, foco nos detalhes do produto` ,
      characters: [characters[0].id]
    };
  });

  const structured = {
    title,
    idea,
    language,
    approx_total_duration_s,
    characters,
    scenes,
    tags: opts.tags || [],
    safetyNotes: 'Evitar conteúdo sensível; manter conformidade com políticas da plataforma.'
  };

  return {
    revised: `Prompt revisado (detalhado) para: ${title}`,
    structured
  };
}

module.exports = { generateDetailed };
