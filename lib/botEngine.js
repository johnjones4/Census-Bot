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
  console.log(JSON.stringify(entities,null,'  '));
  const responseSummary = [];
  const query = database.knex('cps');
  let nextColumn = null;
  let nextQueryType = 'and';
  const nextQuery = (value) => {
    if (nextColumn) {
      switch (nextQueryType) {
        case 'or':
          query.orWhere(nextColumn,value);
          break;
        default:
          query.where(nextColumn,value);
          break;
      }
    }
  }
  for(var token in entities) {
    switch(token) {
      case 'total_query':
        query.sum('PWSSWGT as total');
        break;
      case 'HETENURE':
      case 'HEHOUSUT':
        nextColumn = token;
        break;
      case 'own':
        nextQuery(consts.inverseValues.HETENURE['OWNED OR BEING BOUGHT BY A HH MEMBER'],'own a home');
        break;
      case 'rent':
        nextQuery(consts.inverseValues.HETENURE['RENTED FOR CASH'],'rent a home');
        break;
      case 'rent':
        nextQuery(consts.inverseValues.HETENURE['RENTED FOR CASH']);
        break;
    }
  }
  if (entities.total_query) {

    if (entities.HEHOUSUT) {
      if (entities.apartment_or_house) {
        query.where('HEHOUSUT',consts.inverseValues.HEHOUSUT['HOUSE, APARTMENT, FLAT']);
        responseSummary.push('live in a house or apartment');
      }
      if (entities.hotel) {
        query.where(function() {
          this.where('HEHOUSUT',consts.inverseValues.HEHOUSUT['HU IN NONTRANSIENT HOTEL, MOTEL, ETC.']);
          this.orWhere('HEHOUSUT',consts.inverseValues.HEHOUSUT['HU PERMANENT IN TRANSIENT HOTEL, MOTEL']);
        });
        responseSummary.push('live in a hotel');
      }
      if (entities.rooming_house) {
        query.where('HEHOUSUT',consts.inverseValues.HEHOUSUT['HU IN ROOMING HOUSE']);
        responseSummary.push('live in a rooming house');
      }
      if (entities.trailer) {
        query.where(function() {
          this.where('HEHOUSUT',consts.inverseValues.HEHOUSUT['MOBILE HOME OR TRAILER W/NO PERM. ROOM ADDED']);
          this.orWhere('HEHOUSUT',consts.inverseValues.HEHOUSUT['MOBILE HOME OR TRAILER W/1 OR MORE PERM. ROOMS ADDED']);
        });
        responseSummary.push('live in a trailer');
      }
      if (entities.tent) {
        query.where('HEHOUSUT',consts.inverseValues.HEHOUSUT['UNOCCUPIED TENT SITE OR TRLR SITE']);
        responseSummary.push('live in a tent');
      }
      if (entities.dorm) {
        query.where('HEHOUSUT',consts.inverseValues.HEHOUSUT['STUDENT QUARTERS IN COLLEGE DORM']);
        responseSummary.push('live in a dorm or other college housing');
      }
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
