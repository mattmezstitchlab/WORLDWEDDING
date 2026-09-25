export default async function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
  const query=String(req.query?.q||'').trim();
  const orientation=String(req.query?.orientation||'landscape');
  if(!query)return res.status(400).json({error:'Missing query'});
  const key=process.env.PEXELS_API_KEY;
  if(!key)return res.status(503).json({error:'PEXELS_API_KEY is not configured'});
  try{
    const url=new URL('https://api.pexels.com/v1/search');
    url.searchParams.set('query',query);url.searchParams.set('orientation',orientation);url.searchParams.set('per_page','8');url.searchParams.set('locale','fr-FR');
    const r=await fetch(url,{headers:{Authorization:key}});
    if(!r.ok)return res.status(r.status).json({error:'Pexels request failed'});
    const data=await r.json();
    const photos=(data.photos||[]).map(p=>({id:p.id,src:p.src,alt:p.alt||query,photographer:p.photographer,photographerUrl:p.photographer_url,pexelsUrl:p.url}));
    return res.status(200).json({query,photos});
  }catch(e){return res.status(500).json({error:'Media service unavailable'});}
}
