addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

async function handle(req){
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    const headers = {
      'Access-Control-Allow-Origin': req.headers.get('Origin') || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
    return new Response(null, {status:204, headers})
  }

  if(req.method !== 'POST'){
    return new Response(JSON.stringify({error:'Use POST'}),{status:405,headers:{'Content-Type':'application/json'}})
  }

  // Basic origin detection
  const origin = req.headers.get('Origin') || req.headers.get('Referer') || ''

  try{
  const body = await req.json()
    // minimal validation
    if(!body.contents){
      return new Response(JSON.stringify({error:'Missing contents field'}),{status:400,headers:{'Content-Type':'application/json'}})
    }

    // Use Wrangler secret (GEMINI_API_KEY) stored in worker environment
    const apiKey = ENV.GEMINI_API_KEY || GLOBAL_GEMINI_API_KEY || null
    // 'ENV' is replaced by Wrangler at build time; fallback safe check
    if(!apiKey){
      return new Response(JSON.stringify({error:'Gemini API key not configured on the worker'}),{status:500,headers:{'Content-Type':'application/json'}})
    }

    // forward to Gemini endpoint
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
    const resp = await fetch(url,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'X-goog-api-key': apiKey
      },
      body: JSON.stringify(body)
    })

    const text = await resp.text()
    // echo origin for CORS
    const corsHeaders = {
      'Content-Type': resp.headers.get('Content-Type') || 'application/json',
      'Access-Control-Allow-Origin': req.headers.get('Origin') || '*',
      'Access-Control-Allow-Credentials': 'true'
    }
    return new Response(text,{status:resp.status,headers:corsHeaders})

  }catch(err){
    return new Response(JSON.stringify({error:err.message}),{status:500,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':req.headers.get('Origin')||'*'}})
  }
}
