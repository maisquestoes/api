var mandrill = require('../../config/mandrill');
var config = require('../../config/config');

module.exports = {
  send: function(subject, body, to) {
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
  sendTemplate: function(template_name, template_content, email, name) {
    mandrill.messages.sendTemplate({
      "template_name": template_name, 
      "template_content": template_content, 
      'message': {
        'to': [{
          'email': email,
          'name': name,
          'type': 'to'
        }]
      }
    }, function(result) {
          console.log(result);
    }, function(e) {
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
  },
  sendConfirmation: function(token, email, name) {
    if (config.port && config.port !== 80) {
      port = ':' + config.port;
    }
    var link = config.url + port + '/auth/verification?verificationToken=' + token;
    var template_content = [
      {
        "name": "name",
        "content": name
      },
      {
        "name": "link",
        "content": link
      }
    ];
    this.sendTemplate('cadastro', template_content, email, name);
  },
  forgotPassword: function(token, email, name) {
    if (config.port && config.port !== 80) {
      port = ':' + config.port;
    }
    var link = config.url + port + '/auth/reset/' + token;
    var template_content = [
      {
        "name": "name",
        "content": name
      },
      {
        "name": "link",
        "content": link
      }
    ];
    this.sendTemplate('recuperar-senha', template_content, email, name);
  }
};
