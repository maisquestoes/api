var mandrill = require('../../config/mandrill');
var config = require('../../config/config');

module.exports = {
  send: function(subject, body, to) {
    //TODO - Implements template here
    var message = body;
    mandrill.messages.send({
      'message': {
        'html': message,
        'to': [{
          'email': to,
          'name': 'teste',
          'type': 'to'
        }],
        'subject': subject,
        'from_email': 'naoresponda@maisquestoes.com.br',
        'from_name': 'MaisQuestões'
      }
    });
  },
  sendConfirmation: function(token, to) {
    var subject = 'Mais Questões - Confirmação de Cadastro';
    var port = '';
    if (config.port) {
      port = ':' + config.port;
    }
    var body = 'Falta pouco para concluir seu cadastro, basta acessar o <a href=' + config.url + port + '/auth/verification/?verificationToken=' + token + '">link</a>';
    this.send(subject,body,to);
  }
};
