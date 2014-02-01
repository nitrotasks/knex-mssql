(function() {

  var Knex = require('knex');

  // Add client to Knex
  Knex.Clients.mssql = require('./mssql');

}());