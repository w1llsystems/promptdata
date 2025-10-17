const templates = {
  unboxing: {
    id: 'unboxing',
    title: 'Unboxing / Review',
    description: 'Template para abertura, demonstração de produto e CTA',
    defaults: { steps: 3 }
  },
  tutorial: {
    id: 'tutorial',
    title: 'Tutorial / How-to',
    description: 'Passo-a-passo explicando uso do produto',
    defaults: { steps: 5 }
  },
  emotional: {
    id: 'emotional',
    title: 'Cena emocional / narrativa curta',
    description: 'Foco em storytelling e construção de personagem',
    defaults: { steps: 4 }
  }
};

function listTemplates() { return Object.values(templates); }

function getTemplate(id) { return templates[id] || null; }

module.exports = { listTemplates, getTemplate };
