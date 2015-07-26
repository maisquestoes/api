var mandrill = require('mandrill-api/mandrill');
module.exports = new mandrill.Mandrill(process.env.MANDRILL_APIKEY);
