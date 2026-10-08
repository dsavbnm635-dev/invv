const crypto=require("crypto");
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function ok(a,b){const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&crypto.timingSafeEqual(x,y)}
module.exports=async(req,res)=>{
  const pw=process.env.ADMIN_PASSWORD;
  if(!pw||!ok(req.headers["x-admin-password"]||"",pw))return res.status(401).json({error:"unauthorized"});
  const H={apikey:process.env.SUPABASE_SERVICE_KEY,Authorization:"Bearer "+process.env.SUPABASE_SERVICE_KEY};
  const base=process.env.SUPABASE_URL+"/rest/v1/rsvps";
  if(req.method==="GET"){
    const r=await fetch(base+"?select=*&order=created_at.desc",{headers:H});
    return res.status(r.ok?200:500).json(r.ok?await r.json():{error:"db"});
  }
  if(req.method==="DELETE"){
    const id=String(req.query.id||"");
    if(!UUID.test(id))return res.status(400).json({error:"invalid"});
    const r=await fetch(base+"?id=eq."+id,{method:"DELETE",headers:H});
    return res.status(r.ok?200:500).json({ok:r.ok});
  }
  res.status(405).json({error:"method"});
};
