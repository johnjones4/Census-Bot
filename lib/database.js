const config = require('../config');
const knex = exports.knex = require('knex')({
  'client': 'mysql',
  'connection': config.database
});

exports.init = () => {
  return knex.schema.hasTable('cps').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('cps', function(table) {
        table.increments('id').primary().notNullable();
        table.string('HRHHID',15).notNullable();
        table.integer('HETENURE').index();
        table.integer('HEHOUSUT').index();
        table.integer('HETELHHD').index();
        table.integer('HETELAVL').index();
        table.integer('HEFAMINC').index();
        table.integer('PRTAGE_MIN');
        table.integer('PRTAGE_MAX');
        table.integer('PEMARITL').index();
        table.integer('PESEX').index();
        table.integer('PEAFEVER').index();
        table.integer('PEEDUCA').index();
        table.integer('PTDTRACE').index();
        table.double('PWSSWGT');
      });
    }
  });
}

exports.insert = (record) => {
  return knex('cps').insert(record);
}
