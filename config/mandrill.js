var mandrill = require('mandrill-api/mandrill');
var apikey = process.env.MANDRILL_APIKEY || '2s_8GMMMlHPY3rfdl3LzCQ';
module.exports = new mandrill.Mandrill(apikey);
