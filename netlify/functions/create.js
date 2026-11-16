const crypto = require("crypto");
const { redis, json, readBody } = require("./_common");
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  try {
    const raw = readBody(event).url;
    if (typeof raw !== "string" || raw.length > 4096) throw new Error();
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    const code = crypto.randomBytes(4).toString("hex");
    await redis.set("link:" + code, url.toString());
    const host = event.headers["x-forwarded-host"] || event.headers.host;
    const base = (process.env.BASE_URL || `https://${host}`).replace(/\/$/, "");
    return json(200, { code, shortUrl: `${base}/s/${code}` });
  } catch { return json(400, { error: "Enter a valid http or https URL." }); }
};
