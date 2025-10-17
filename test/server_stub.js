// Extracted helpers from server.js for testing

function mockGenerate(idea, target = 'sora2', variants = 2) {
  const base = `Revised prompt for ${target}: Make the output concise and structured. Idea: ${idea}`;
  const outputs = {
    revised: base,
    structured: {
      sora2: {
        prompt: base + ' [SORA2 FORMAT]',
        fields: { tone: 'professional', length: 'short' }
      },
      veo3: {
        prompt: base + ' [VEO-3 FORMAT]',
        fields: { tone: 'casual', length: 'medium' }
      }
    },
    variants: Array.from({ length: variants }).map((_, i) => ({
      name: `variant-${i + 1}`,
      prompt: base + ` variant ${i + 1}`
    }))
  };
  return outputs;
}

function mockSequential(idea, steps, style) {
  const sequence = [];
  for (let i = 1; i <= steps; i++) {
    sequence.push({
      step: i,
      title: `Part ${i}: ${idea.split(' ').slice(0,3).join(' ')}...`,
      prompt: `Create scene ${i} of ${steps} for idea: ${idea}. Style: ${style}. Be concise and include a visual description, main action, and an audio cue.`
    });
  }
  return sequence;
}

module.exports = { mockGenerate, mockSequential };
