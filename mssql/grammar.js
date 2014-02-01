// MS SQL Grammar
// -------
var _           = require('lodash');
var Helpers     = require('../../../lib/helpers').Helpers;
var baseGrammar = require('../../base/grammar').baseGrammar;

// Extends the standard sql grammar.
exports.grammar = _.defaults({

  // The keyword identifier wrapper format.
  wrapValue: function(value) {
    return (value !== '*' ? Helpers.format('"%s"', value) : "*");
  },

  // Ensures the response is returned in the same format as other clients.
  handleResponse: function(builder, response) {
    var returning = builder.flags.returning;

    if (builder.type === 'insert' && returning) {
      response = response[0][returning];
    }

    if (builder.type === 'delete' || builder.type === 'update') {
      return response.length;
    }

    return response;
  },

  // Compiles a `delete` query.
  compileDelete: function(qb) {
    var table = this.wrapTable(qb.table);
    var where = !_.isEmpty(qb.wheres) ? this.compileWheres(qb) : '';
    return 'delete from ' + table + ' output @@ROWCOUNT ' + where;
  },

  // Compiles an `update` query.
  compileUpdate: function(qb) {
    var values = qb.values;
    var table = this.wrapTable(qb.table), columns = [];
    for (var i=0, l = values.length; i < l; i++) {
      var value = values[i];
      columns.push(this.wrap(value[0]) + ' = ' + this.parameter(value[1]));
    }
    return 'update ' + table + ' set ' + columns.join(', ') + ' output @@ROWCOUNT ' + this.compileWheres(qb);
  },

  compileInsert: function (qb) {
    var values      = qb.values;
    var table       = this.wrapTable(qb.table);
    var columns     = _.pluck(values[0], 0);
    var paramBlocks = [];

    // If there are any "where" clauses, we need to omit
    // any bindings that may have been associated with them.
    if (qb.wheres.length > 0) this.clearWhereBindings(qb);

    for (var i = 0, l = values.length; i < l; ++i) {
      paramBlocks.push("(" + this.parameterize(_.pluck(values[i], 1)) + ")");
    }

    return "insert into " + table + " (" + this.columnize(columns) + ") " + this.compileReturning(qb) + " values " + paramBlocks.join(', ');
  },

  compileReturning: function(qb) {
    var sql = '';
    if (qb.flags.returning) {
      sql = 'output inserted.' + qb.flags.returning;
    }
    return sql;
  }

}, baseGrammar);