// Microsoft SQL Server
// -------

// Other dependencies, including the `mssql` library,
// which needs to be added as a dependency to the project
// using this database.
var _     = require('lodash');
var mssql = require('mssql');

// All other local project modules needed in this scope.
var ServerBase        = require('./base').ServerBase;
var Helpers           = require('../../lib/helpers').Helpers;
var Promise           = require('../../lib/promise').Promise;

var grammar           = require('./mssql/grammar').grammar;
var schemaGrammar     = require('./mssql/schemagrammar').schemaGrammar;
var SqlString         = require('./mssql/SqlString');

// Constructor for the MSSSQLClient.
exports.Client = ServerBase.extend({

  dialect: 'mssql',

  // Attach the appropriate grammar definitions onto the current client.
  attachGrammars: function() {
    this.grammar = grammar;
    this.schemaGrammar = schemaGrammar;
  },

  // Runs the query on the specified connection, providing the bindings
  // and any other necessary prep work.
  runQuery: function(connection, sql, bindings, builder) {
    var request, i, len;

    if (! connection) {
      throw new Error('No database connection exists for the query');
    }

    // Create a new request
    request = connection.request()

    // Add bindings as inputs to the request
    for (i = 0, len = bindings.length; i < len; i++) {
      request.input(i, bindings[i]);
    }

    // Replace question marks with '@<id>'
    i = 0;
    sql = sql.replace(/\?/g, function() { return '@' + i++; })

    console.log('\nNew Request')
    console.log('SQL:', sql)
    console.log('Input:', bindings)

    return Promise.promisify(request.query, request)(sql).then(

      // Response handler
      function (response) {
        console.log('Response:', response);
        return response;
      },

      // Error handler
      function (err) {
        console.log('Error:', err);
        throw err;
      }

    );
  },

  // Get a raw connection, called by the `pool` whenever a new
  // connection needs to be added to the pool.
  getRawConnection: function() {
    var connection = new mssql.Connection(this.connectionSettings);
    return Promise.promisify(connection.connect, connection)().yield(connection);
    // connect = Promise.promisify(mssql.connect, mssql)
    // return connect(this.connectionSettings).yield(connect);
  },

  // Used to explicitly close a connection, called internally by the pool
  // when a connection times out or the pool is shutdown.
  destroyRawConnection: function(connection) {
    connection.close();
  }

});
