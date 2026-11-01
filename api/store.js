const { MongoClient } = require("mongodb");

const STORE_ID = "main";
const MAX_STORE_BYTES = 4 * 1024 * 1024;
const globalForMongo = globalThis;

function getMongoClient() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }
  if (!globalForMongo.minniMartMongoClientPromise) {
    // Keep the low-traffic serverless pool small and release idle connections.
    const client = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 30_000
    });
    globalForMongo.minniMartMongoClientPromise = client.connect().catch((error) => {
      delete globalForMongo.minniMartMongoClientPromise;
      throw error;
    });
  }
  return globalForMongo.minniMartMongoClientPromise;
}

function isValidStore(store) {
  return store
    && typeof store === "object"
    && Array.isArray(store.products)
    && Array.isArray(store.orders)
    && Array.isArray(store.debts)
    && Array.isArray(store.units)
    && store.admin
    && typeof store.admin === "object";
}

function safeErrorDetails(error) {
  const name = error instanceof Error ? error.name : "UnknownError";
  const code = error?.codeName || error?.code || null;
  const rawMessage = error instanceof Error ? error.message : String(error);
  const message = rawMessage
    .replace(/mongodb(?:\+srv)?:\/\/[^@\s]+@/gi, "mongodb+srv://[REDACTED]@")
    .replace(process.env.MONGODB_URI || "\u0000", "[REDACTED_MONGODB_URI]")
    .slice(0, 400);
  return { name, code, message };
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET" && req.method !== "PUT") {
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Method not allowed." });
  }
  if (req.method === "PUT" && req.headers.origin) {
    try {
      if (new URL(req.headers.origin).host !== req.headers.host) {
        return res.status(403).json({ error: "Cross-origin writes are not allowed." });
      }
    } catch {
      return res.status(403).json({ error: "Invalid request origin." });
    }
  }

  try {
    const client = await getMongoClient();
    const database = client.db(process.env.MONGODB_DB_NAME || "minni_mart");
    const collection = database.collection("app_state");

    if (req.method === "GET") {
      const document = await collection.findOne({ _id: STORE_ID });
      return res.status(200).json({ store: document?.store ?? null });
    }

    const store = req.body?.store;
    if (!isValidStore(store)) {
      return res.status(400).json({ error: "Invalid store data." });
    }
    if (Buffer.byteLength(JSON.stringify(store), "utf8") > MAX_STORE_BYTES) {
      return res.status(413).json({ error: "Store data is too large." });
    }

    await collection.replaceOne(
      { _id: STORE_ID },
      { _id: STORE_ID, store, updatedAt: new Date() },
      { upsert: true }
    );
    return res.status(200).json({ saved: true });
  } catch (error) {
    const details = safeErrorDetails(error);
    console.error("MongoDB store API error:", JSON.stringify(details));
    if (details.message.includes("Missing MONGODB_URI")) {
      return res.status(503).json({
        error: "Server is missing MONGODB_URI. Configure it in Vercel Project Settings > Environment Variables, then redeploy."
      });
    }
    return res.status(500).json({
      error: "MongoDB request failed. Check the sanitized function log for the connection reason."
    });
  }
};
