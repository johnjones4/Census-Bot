const botEngine = require('./lib/botEngine');

const entities = {"total_query":[{"confidence":0.86235384750392,"value":"Who","type":"value"}],"PEMARITL_married":[{"confidence":0.77372291061409,"value":"married","type":"value"}],"and":[{"confidence":0.82457722695521,"value":"and","type":"value"}],"HEHOUSUT":[{"confidence":0.9763861156868,"value":"live in an","type":"value"}],"apartment_or_house":[{"confidence":0.97636723370957,"value":"house","type":"value"}]};

const {
  responseSummary,
  query
} = botEngine.generateQuery(entities);
// console.log(query)
console.log(query.toString());
