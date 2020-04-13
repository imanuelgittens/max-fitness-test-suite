const { MongoClient } = require('mongodb');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/maxfitness';
const clientCache = {};

async function createClient(url, options) {
  const cacheKey = url;

  // old url parser is deprecated
  // unifiedTopology now required by MongoDB driver
  const connectionOpts = {
    ...options,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (clientCache[cacheKey]) {
    return clientCache[cacheKey];
  }
  const client = await MongoClient.connect(url, connectionOpts);
  const db = client.db();
  clientCache[cacheKey] = { client, db };
  return { client, db };
}

module.exports = { dbUrl, createClient };
