const { Redis } = require("@upstash/redis");
const redis = Redis.fromEnv();
const json = (statusCode, body) => ({ statusCode, headers: { "content-type": "application/json", "cache-control": "no-store" }, body: JSON.stringify(body) });
const readBody = (event) => { try { return JSON.parse(event.body || "{}"); } catch { return {}; } };
module.exports = { redis, json, readBody };
