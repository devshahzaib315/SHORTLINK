const { redis, json } = require("./_common");
exports.handler = async (event) => {
  const code = (event.queryStringParameters || {}).code || "";
  if (!/^[a-f0-9]{8}$/i.test(code)) return json(400, { error: "Invalid short code" });
  try { const url = await redis.get("link:" + code); return url ? json(200, { url }) : json(404, { error: "Short link not found" }); }
  catch { return json(500, { error: "Storage is not configured or is unavailable." }); }
};
