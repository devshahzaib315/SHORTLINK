const { redis } = require("./_store");
const crypto = require("crypto");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const raw = req.body && req.body.url;
    if (typeof raw !== "string" || raw.length > 4096) throw new Error("Invalid URL");
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("Unsupported protocol");
    const code = crypto.randomBytes(4).toString("hex");
    await redis.set("link:" + code, url.toString());
    const host = (req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
    const protocol = (req.headers["x-forwarded-proto"] || "https").split(",")[0].trim();
    const base = (process.env.BASE_URL || `${protocol}://${host}`).replace(/\/$/, "");
    if (!host && !process.env.BASE_URL) throw new Error("Unable to determine site URL");
    return res.status(200).json({ code, shortUrl: `${base}/s/${code}` });
  } catch (error) {
    const message = error.message === "Unable to determine site URL" ? error.message : "Enter a valid http or https URL.";
    return res.status(400).json({ error: message });
  }
};
