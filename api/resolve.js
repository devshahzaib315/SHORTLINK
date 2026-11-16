const { redis } = require("./_store");
module.exports = async (req, res) => {
  const code = String(req.query.code || "");
  if (!/^[a-f0-9]{8}$/i.test(code)) return res.status(400).json({ error: "Invalid short code" });
  try {
    const url = await redis.get("link:" + code);
    if (!url) return res.status(404).json({ error: "Short link not found" });
    return res.status(200).json({ url });
  } catch {
    return res.status(500).json({ error: "Storage is not configured or is unavailable." });
  }
};
