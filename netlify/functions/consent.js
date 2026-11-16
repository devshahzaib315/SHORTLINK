const { redis, json, readBody } = require("./_common");
const { put } = require("@vercel/blob");
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  try {
    const { code, location, photo } = readBody(event);
    if (typeof code !== "string" || !/^[a-f0-9]{8}$/i.test(code) || !await redis.get("link:" + code)) return json(404, { error: "Invalid link" });
    const key = `consent:${code}:${Date.now()}:${Math.random().toString(16).slice(2)}`;
    const record = { code, submittedAt: new Date().toISOString() };
    if (location && typeof location.latitude === "number" && typeof location.longitude === "number") record.location = location;
    if (typeof photo === "string" && photo.length < 7_000_000) {
      const match = photo.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
      if (match) { const blob = await put("visitor-media/" + key.replaceAll(":", "-") + "." + (match[1].split("/")[1] === "jpeg" ? "jpg" : match[1].split("/")[1]), Buffer.from(match[2], "base64"), { access: "public", addRandomSuffix: false }); record.photoUrl = blob.url; }
    }
    await redis.set(key, record);
    return json(200, { ok: true });
  } catch { return json(500, { error: "Could not save consent record. Check storage configuration." }); }
};
