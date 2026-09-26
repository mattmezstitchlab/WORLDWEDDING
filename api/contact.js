export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  try{
    const {couple,email,date,destination,guests,project,message}=req.body||{};
    if(!couple||!email)return res.status(400).json({error:'Couple and email are required'});
    const key=process.env.RESEND_API_KEY;
    if(!key)return res.status(503).json({error:'RESEND_API_KEY is not configured'});
    const payload={
      from:process.env.WORLD_WEDDING_FROM||'WORLD WEDDING <onboarding@resend.dev>',
      to:['matthieu.lecointre@gmail.com'],
      reply_to:email,
      subject:'WORLD WEDDING — nouvelle demande de '+couple,
      text:['Couple : '+couple,'Email : '+email,'Date : '+(date||''),'Destination : '+(destination||''),'Invités : '+(guests||''),'Projet : '+(project||''),'','Message : '+(message||'')].join('\n')
    };
    const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(payload)});
    if(!r.ok){const t=await r.text();return res.status(r.status).json({error:'Email provider failed',detail:t.slice(0,300)});}
    return res.status(200).json({ok:true});
  }catch(e){return res.status(500).json({error:'Contact service unavailable'});}
}