window.PromptDataBrowser = (function(){
  // Simple enhancer: adds camera, lighting and basic beats
  function enhanceIdea(idea,steps){
    const base = idea.trim()
    const breeds = ['Golden Retriever','Labrador Retriever','Border Collie','Beagle']
    const dog = breeds[Math.floor(Math.random()*breeds.length)]
    const env = {location:'Praia deserta com areia clara e mar calmo',time_of_day:'Pôr do sol'}
    const camera = {type:'Câmera de cinema digital',movements:'Movimentos suaves, steadicam'}
    const lighting = {style:'Luz natural dourada do pôr do sol, refletores suaves se necessário'}

    // generate N beats
    const beats = []
    for(let i=0;i<steps;i++){
      const id = i+1
      const description = i===0 ? `Abertura: ${base}, visão ampla mostrando o espaço.` : (i===steps-1 ? `Fechamento: ${base}, silhueta contra o sol.` : `Meio: ${base}, detalhe emocional.`)
      const shot = i===0 ? 'Plano aberto, wide shot' : (i===steps-1 ? 'Plano geral ou silhueta' : 'Close-up e plano médio alternando')
      beats.push({id,description,shot_instructions:shot})
    }

    return {
      title: base.split('.')[0] || base,
      beats,
      camera,
      lighting,
      environment: env,
      emotional_tone: 'Alegria, liberdade, conexão com a natureza',
      final_prompt: `${base}. Luz quente do pôr do sol, câmera ${camera.type}. Atmosfera inspiradora.`
    }
  }

  function toVeo3(structured){
    // Simple formatter: include final_prompt and beats; VEO-3 likes a header IMAGE if present — omitted here
    const lines = []
    lines.push(structured.final_prompt)
    lines.push('\n-- Beats --')
    structured.beats.forEach(b=>{
      lines.push(`${b.id}. ${b.description} — ${b.shot_instructions}`)
    })
    lines.push('\nCamera: '+structured.camera.type)
    lines.push('Lighting: '+structured.lighting.style)
    return lines.join('\n')
  }

  function toSora2(structured){
    // Simpler textual prompt for sora2
    return `${structured.final_prompt}\nBeats:\n${structured.beats.map(b=>`- ${b.description} (${b.shot_instructions})`).join('\n')}`
  }

  return {
    generateStructured: (idea,opts={steps:3,target:'veo-3'})=>{
      const steps = opts.steps||3
      return enhanceIdea(idea,steps)
    },
    toPlatform: (structured,target)=>{
      return target==='veo-3' ? toVeo3(structured) : toSora2(structured)
    },
    // helper to call a proxy worker that forwards to Gemini; returns Gemini JSON
    callWorker: async (workerUrl, body)=>{
      const resp = await fetch(workerUrl,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(body)
      })
      return resp.json()
    }
  }
})()
