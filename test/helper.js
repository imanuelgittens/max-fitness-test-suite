async function insertResource(db, collectionName, resource) {
  if (Array.isArray(resource)) {
    await db.collection(collectionName).insertMany(resource);
  } else {
    await db.collection(collectionName).insertOne(resource);
  }
}

async function dropResourceCollections(db, collections) {
  for (const collection of collections) {
    await db.dropCollection(collection);
  }
}

async function aggregate(db, collectionName, pipeline) {
  return await db.collection(collectionName).aggregate(pipeline).toArray();
}

module.exports = {
  insertResource,
  dropResourceCollections,
  aggregate,
};
