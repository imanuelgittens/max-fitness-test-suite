const { createClient, dbUrl } = require('./db');

let client;

before(async () => {
  ({ client } = await createClient(dbUrl));
});

after(() => {
  client.close();
});
