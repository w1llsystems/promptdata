// Validação simples para detectar termos sensíveis e ambiguidades
const sensitiveTerms = ['porn', 'sexual', 'nude', 'sex', 'incest'];

function checkSensitive(idea) {
  const low = idea.toLowerCase();
  const found = sensitiveTerms.filter(t => low.includes(t));
  return { safe: found.length === 0, found };
}

// Heurística para detectar ambiguidade (curto e sem detalhes)
function checkAmbiguity(idea) {
  const words = idea.trim().split(/\s+/).length;
  return { ambiguous: words < 5, wordCount: words };
}

module.exports = { checkSensitive, checkAmbiguity };
