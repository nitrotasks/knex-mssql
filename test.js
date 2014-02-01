Knex = require('knex');
require('./index');

var knex = Knex.initialize({
  client: 'mssql',
  connection: require('./keychain')
});

var createTable = function () {
  return knex.schema.createTable('my_awesome_table', function (table) {
    table.increments('id').unsigned()
    table.string('name', 100)
    table.string('email', 100).index()
    table.string('password', 60)
    table.integer('pro').unsigned()
    table.timestamps()
  });
};

var hasTable = function () {
  return knex.schema.hasTable('my_awesome_table')
};

var dropTable = function () {
  return knex.schema.dropTable('my_awesome_table')
};

var select = function () {
  return knex('Test').select();
};

var insert = function () {
  return knex('Test').returning('id').insert({
    name: 'Cheese Pie'
  });
};

var update = function () {
  return knex('Test').update({
    name: 'Cheese Cake'
  }).where({
    name: 'Cheese Pie'
  })
};

var del = function () {
  return knex('Test').del().where({
    name: 'Cheese Cake'
  });
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


createTable().then(function () {
  console.log(arguments);
});

