const importer = require('./lib/importer');
const database = require('./lib/database');

database.init()
  .then(() => {
    return importer.import(process.argv[2]);
  })
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  })
