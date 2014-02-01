Knex = require('knex');
require('./index');

var knex = Knex.initialize({
  client: 'mssql',
  connection: require('./keychain')
});

var table = 'user';

var createTable = function () {
  return knex.schema.createTable(table, function (table) {
    table.increments('id')
    table.string('name', 100)
    table.string('email', 100).unique().index()
    table.string('password', 60)
    table.integer('pro')
    table.dateTime('created_at').defaultTo(knex.raw('getdate()'))
  });
};

createOtherTable = function () {
  return knex.schema.createTable('list', function (table) {
    table.increments('id')
    table.integer('userId')
      .references('id').inTable('user')
      .onDelete('cascade')
      .onUpdate('cascade')
  });
};

var hasTable = function () {
  return knex.schema.hasTable(table)
};

var dropTable = function () {
  return knex.schema.dropTable('my_awesome_table')
};

var selectAll = function (id) {
  return knex(table).select(id);
};

var selectRow = function (id) {
  return knex(table).select().where({
    id: id
  });
};

var insert = function () {
  return knex(table).returning('id').insert({
    name: 'Willy Wonka',
    email: 'willy@thechocolatefactory.com',
    password: 'supercalifragilisticexpialidocious',
    pro: 1
  });
};

var update = function () {
  return knex(table).update({
    name: 'Cheese Cake'
  }).where({
    name: 'Cheese Pie'
  })
};

var delEmail = function (email) {
  return knex(table).del().where({
    email: email
  })
};

// select().then(function (data) {
//   console.log(data);
//   return insert();
// }).then(function (response) {
//   console.log(response);
//   return insert();
// }).then(function (response) {
//   console.log(response)
//   return select();
// }).then(function (response) {
//   console.log(response)
//   return update();
// }).then(function (response) {
//   console.log(response)
//   return del();
// }).then(function (response) {
//   console.log(response)
//   return select();
// }).then(function (response) {
//   console.log(response);
// });

hasTable().then(function (exists) {
  if (! exists) { return createTable(); }
}).then(function () {
  return selectAll();
}).then(function (rows) {
  console.log('all rows', rows);
  return insert();
}).then(function (id) {
  console.log('id', id)
  return selectRow(id);
}).then(function (rows) {
  console.log('single row', rows);
  return delEmail('willy@thechocolatefactory.com');
}).then(function (affected) {
  console.log('deleted', affected)
})


// createOtherTable().then(function (results) {
//   console.log(results);
// });