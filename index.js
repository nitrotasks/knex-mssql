(function() {

  try {
    var Knex = require('knex');
    global.req = require;
  } catch (_) {
    global.req = require('parent-require');
    var Knex = req('knex');
  }

  // Add client to Knex
  Knex.Clients.mssql = '../knex-mssql/mssql';

}());