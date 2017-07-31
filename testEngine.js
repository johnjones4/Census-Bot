const botEngine = require('./lib/botEngine');
const database = require('./lib/database');
const readline = require('readline');

const exitStrings = [
  'q',
  'quit',
  'exit',
  'end',
  'cancel'
];

database.init()
  .then(() => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const askQuestion = () => {
      rl.question('> ',(answer) => {
        rl.pause();
        if (exitStrings.indexOf(answer.toLowerCase()) >= 0) {
          rl.close();
          process.exit(0);
        } else {
          botEngine.processStatement(answer)
            .then((response) => {
              console.log(response);
              askQuestion();
            })
            .catch((err) => {
              console.error(err);
              askQuestion();
            });
        }
      });
    }
    askQuestion();
  })
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  })
