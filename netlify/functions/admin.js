const { redis, json } = require("./_common");
exports.handler = async (event) => {
  const token = (event.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!process.env.ADMIN_PASSWORD || token !== process.env.ADMIN_PASSWORD) return json(401, { error: "Unauthorized" });
  try { const keys = await redis.keys("consent:*"); const records = []; for (const key of keys.slice(-100)) { const value = await redis.get(key); if (value) records.push(value); } return json(200, { records }); }
  catch { return json(500, { error: "Could not load records" }); }
};
