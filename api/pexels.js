export default async function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
  const query=String(req.query?.q||'').trim();
  const orientation=String(req.query?.orientation||'landscape');
  const type=String(req.query?.type||'photo');
  if(!query)return res.status(400).json({error:'Missing query'});
  const key=process.env.PEXELS_API_KEY;
  if(!key)return res.status(503).json({error:'PEXELS_API_KEY is not configured'});
  try{
    const endpoint=type==='video'?'https://api.pexels.com/videos/search':'https://api.pexels.com/v1/search';
    const url=new URL(endpoint);
    url.searchParams.set('query',query);
    url.searchParams.set('orientation',orientation);
    url.searchParams.set('per_page','8');
    const r=await fetch(url,{headers:{Authorization:key}});
    if(!r.ok)return res.status(r.status).json({error:'Pexels request failed'});
    const data=await r.json();
    if(type==='video'){
      const videos=(data.videos||[]).map(v=>{
        const files=(v.video_files||[]).filter(f=>f.file_type==='video/mp4'&&f.link);
        const sorted=files.sort((a,b)=>(b.width||0)-(a.width||0));
        const preferred=sorted.find(f=>(f.width||0)>=1080)||sorted[0];
        return {id:v.id,url:preferred?.link||'',width:preferred?.width||0,height:preferred?.height||0,duration:v.duration||0,image:v.image||'',user:v.user?.name||'Pexels',userUrl:v.user?.url||v.url||'https://www.pexels.com/'};
      }).filter(v=>v.url);
      return res.status(200).json({query,type,videos});
    }
    const photos=(data.photos||[]).map(p=>({id:p.id,src:p.src,alt:p.alt||query,photographer:p.photographer,photographerUrl:p.photographer_url,pexelsUrl:p.url}));
    return res.status(200).json({query,type,photos});
  }catch(e){return res.status(500).json({error:'Media service unavailable'});}
}