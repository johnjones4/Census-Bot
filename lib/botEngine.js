const {Wit, log} = require('node-wit');
const config = require('../config');
const database = require('./database');
const consts = require('./consts');

const client = new Wit({
  'accessToken': config.witToken
});

exports.processStatement = (statement) => {
  return client.message(statement, {})
    .then((response) => {
      if (response.entities) {
        return buildResponseFromWitResponse(response.entities);
      } else {
        throw new Error('Bad response from Wit.AI.');
      }
    });
}

buildResponseFromWitResponse = (entities) => {
  // console.log(JSON.stringify(entities,null,'  '));
  const responseSummary = [];
  const query = database.knex('cps');
  let nextColumn = null;
  let nextQueryType = 'and';
  let inverse = false;
  const nextQuery = (unvalue,textValue) => {
    if (inverse) {
      responseSummary.push('do not ' + textValue);
      switch (nextQueryType) {
        case 'or':
          if (typeof unvalue === 'object') {
            query.orWhereNot(function() {
              unvalue.forEach((unvalueItem) => this.orWhere(nextColumn,consts.inverseValues[nextColumn][unvalueItem]));
            });
          } else {
            query.orWhereNot(nextColumn,consts.inverseValues[nextColumn][unvalue]);
          }
          break;
        default:
          if (typeof unvalue === 'object') {
            query.whereNot(function() {
              unvalue.forEach((unvalueItem) => this.orWhere(nextColumn,consts.inverseValues[nextColumn][unvalueItem]));
            });
          } else {
            query.whereNot(nextColumn,consts.inverseValues[nextColumn][unvalue]);
          }
          break;
      }
    } else {
      responseSummary.push(textValue);
      switch (nextQueryType) {
        case 'or':
          if (typeof unvalue === 'object') {
            query.orWhere(function() {
              unvalue.forEach((unvalueItem) => this.orWhere(nextColumn,consts.inverseValues[nextColumn][unvalueItem]));
            });
          } else {
            query.orWhere(nextColumn,consts.inverseValues[nextColumn][unvalue]);
          }
          break;
        default:
          if (typeof unvalue === 'object') {
            query.where(function() {
              unvalue.forEach((unvalueItem) => this.orWhere(nextColumn,consts.inverseValues[nextColumn][unvalueItem]));
            });
          } else {
            // console.log('here',nextColumn,consts.inverseValues[nextColumn][unvalue])
            query.where(nextColumn,consts.inverseValues[nextColumn][unvalue]);
          }
          break;
      }
    }
  }
  for(var token in entities) {
    // console.log(token)
    switch(token) {
      case 'total_query':
        query.sum('PWSSWGT as total');
        break;
      case 'HETENURE':
      case 'HEHOUSUT':
        nextColumn = token;
        break;
      case 'HETELHHD':
        nextColumn = token;
        nextQuery('YES','have a phone');
        break;
      case 'and':
      case 'or':
        inverse = false;
        nextQueryType = token;
        responseSummary.push(token);
        break;
      case 'inverse':
        inverse = true;
      case 'own':
        nextQuery('OWNED OR BEING BOUGHT BY A HH MEMBER','own a home');
        break;
      case 'rent':
        nextQuery('RENTED FOR CASH','rent a home');
        break;
      case 'free':
        nextQuery('','do not pay for housing');
        break;
      case 'apartment_or_house':
        nextQuery('HOUSE, APARTMENT, FLAT','live in a house or apartment');
        break;
      case 'hotel':
        nextQuery('HU IN NONTRANSIENT HOTEL, MOTEL, ETC.','live in a hotel');
        break;
      case 'rooming_house':
        nextQuery('HU IN ROOMING HOUSE','live in a rooming house');
        break;
      case 'trailer':
        nextQuery('MOBILE HOME OR TRAILER W/NO PERM. ROOM ADDED','live in a trailer or mobile home');
        break;
      case 'tent':
        nextQuery('UNOCCUPIED TENT SITE OR TRLR SITE','live in a tent site');
        break;
      case 'dorm':
        nextQuery('STUDENT QUARTERS IN COLLEGE DORM','live in a dorm or other college housing');
        break;
      case 'PEMARITL_married':
        nextColumn = 'PEMARITL';
        nextQuery(['MARRIED - SPOUSE PRESENT','MARRIED - SPOUSE ABSENT'],'are married');
        break;
      case 'PEMARITL_widowed':
        nextColumn = 'PEMARITL';
        nextQuery('WIDOWED','are widowed');
        break;
      case 'PEMARITL_divorced':
        nextColumn = 'PEMARITL';
        nextQuery('DIVORCED','are divorced');
        break;
      case 'PEMARITL_separated':
        nextColumn = 'PEMARITL';
        nextQuery('SEPARATED','are separated');
        break;
    }
  }
  // console.log(query.toString());
  if (responseSummary.length > 0) {
    return query.then((queryResponse) => {
      return 'Approximately ' + Math.round(queryResponse[0].total).toLocaleString() + ' people ' + responseSummary.join(' ') + '.';
    });
  } else {
    return consts.responses.default;
  }
}
