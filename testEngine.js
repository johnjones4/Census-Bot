const botEngine = require('./lib/botEngine');
const database = require('./lib/database');

database.init()
  .then(() => {
    return botEngine.processStatement(process.argv[2]);
  })
  .then((response) => {
    console.log(response);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  })
