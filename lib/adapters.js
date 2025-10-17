// Adaptadores que formatam prompts de forma compatível para Sora2 e VEO-3
function toSora2(structured) {
  // Gera um bloco de texto instruindo o modelo Sora2 com campos claros
  const meta = `Title: ${structured.title}\nLanguage: ${structured.language}\nDuration: ${structured.approx_total_duration_s}s\nTags: ${structured.tags.join(', ')}${structured.imageReference ? `\nImageReference: ${structured.imageReference}` : ''}`;
  const scenes = structured.scenes.map(s => {
    return `SCENE ${s.step}: ${s.title}\nVISUAL: ${s.visual_description}\nACTION: ${s.main_action}\nAUDIO: ${s.audio_cue}\nDURATION_S: ${s.duration_s}\nSHOT: ${s.shot_instructions}`;
  }).join('\n\n');

  const prompt = `[SORA2]\n${meta}\n\n${scenes}\n\nSafety: ${structured.safetyNotes}`;
  return { prompt, fields: { platform: 'sora2', language: structured.language } };
}

function toVeo3(structured) {
  // Formato mais orientado a marcações de cena e tempos
  const header = `TITLE=${structured.title};LANG=${structured.language};DURATION=${structured.approx_total_duration_s}${structured.imageReference ? `;IMAGE=${structured.imageReference}` : ''}`;
  const scenes = structured.scenes.map(s => (`[SCENE|${s.step}|${s.duration_s}s] ${s.title} :: ${s.visual_description} :: ${s.main_action} :: ${s.audio_cue}`)).join('\n');
  const prompt = `[VEO-3]\n${header}\n${scenes}\n#SAFETY: ${structured.safetyNotes}`;
  return { prompt, fields: { platform: 'veo-3', fps: 30 } };
}

module.exports = { toSora2, toVeo3 };
