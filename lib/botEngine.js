const {Wit, log} = require('node-wit');
const config = require('../config');

const client = new Wit({
  'accessToken': config.witToken
});

exports.processStatement = (statement) => {
  return client.message(statement, {})
    .then((data) => {
      return JSON.stringify(data);
    })
}
