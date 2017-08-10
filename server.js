const restify = require('restify');
const builder = require('botbuilder');
const botEngine = require('./lib/botEngine');
const database = require('./lib/database');

// Create bot and add dialogs
const connector = new builder.ChatConnector({
    // appId: "YourAppId",
    // appPassword: "YourAppSecret"
});

const bot = new builder.UniversalBot(connector);
bot.dialog('/',(session) => {
  botEngine.processStatement(session.message.text)
    .then((response) => {
      session.send(response);
    })
    .catch((err) => {
      console.error(err);
      session.send('Sorry, I had trouble understanding you there. Please try again.');
    });
});

// Setup Restify Server
const server = restify.createServer();

database.init()
  .then(() => {
    server.post('/api/messages', connector.listen());
    return server.listen(process.env.port || 3978);
  })
  .then(() => {
    console.log('%s listening to %s', server.name, server.url);
  })
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  })
