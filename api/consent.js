const {redis}=require("./_store");
const {put}=require("@vercel/blob");
module.exports=async(req,res)=>{
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 try{
  const {code,location,photo}=req.body||{};
  if(!await redis.get("link:"+code))return res.status(404).json({error:"Invalid link"});
  const key="consent:"+code+":"+Date.now()+":"+Math.random().toString(16).slice(2);
  const record={code,submittedAt:new Date().toISOString()};
  if(location)record.location=location;
  if(photo && typeof photo==="string" && photo.startsWith("data:image/")){
    const match=photo.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
    if(match){const blob=await put("visitor-media/"+key.replaceAll(":","-")+".jpg",Buffer.from(match[2],"base64"),{access:"public",addRandomSuffix:false});record.photoUrl=blob.url;}
  }
  await redis.set(key,record);
  return res.status(200).json({ok:true});
 }catch(e){return res.status(500).json({error:"Could not save consent record. Check storage configuration."});}
};