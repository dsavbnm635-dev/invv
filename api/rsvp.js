const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
module.exports=async(req,res)=>{
  if(req.method!=="POST")return res.status(405).json({error:"method"});
  const b=req.body||{};
  const name=String(b.name||"").trim().slice(0,60);
  const count=parseInt(b.count,10);
  if(!name||!(count>=1&&count<=3)||!UUID.test(String(b.id||"")))return res.status(400).json({error:"invalid"});
  const row={id:b.id,name,count,lang:b.lang==="en"?"en":"fa"};
  const r=await fetch(process.env.SUPABASE_URL+"/rest/v1/rsvps?on_conflict=id",{
    method:"POST",
    headers:{apikey:process.env.SUPABASE_SERVICE_KEY,Authorization:"Bearer "+process.env.SUPABASE_SERVICE_KEY,"Content-Type":"application/json",Prefer:"resolution=merge-duplicates,return=minimal"},
    body:JSON.stringify(row)});
  if(!r.ok)return res.status(500).json({error:"db"});
  res.status(200).json({ok:true});
};
