const {redis}=require("./_store");
module.exports=async(req,res)=>{
 const token=(req.headers.authorization||"").replace(/^Bearer\s+/i,"");
 if(!process.env.ADMIN_PASSWORD||token!==process.env.ADMIN_PASSWORD)return res.status(401).json({error:"Unauthorized"});
 try{
  const keys=await redis.keys("consent:*");
  const records=[];
  for(const k of keys.slice(-100)){const v=await redis.get(k);if(v)records.push(v);}
  return res.status(200).json({records});
 }catch(e){return res.status(500).json({error:"Could not load records"});}
};