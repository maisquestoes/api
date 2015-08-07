'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users.server.controller');
  var subjects = require('../../app/controllers/subjects.server.controller');

  // Subjects Routes
  app.route('/subjects')
    .get(users.requiresApikey, subjects.listAll)
    .post(users.requiresApikey, subjects.create);

  app.route('/subjects/:subjectId')
    .get(users.requiresApikey, subjects.read)
    .put(users.requiresApikey, subjects.hasAuthorization, subjects.update)
    .delete(users.requiresApikey, subjects.hasAuthorization, subjects.delete);

  // Finish by binding the Subject middleware
  app.param('subjectId', subjects.subjectByID);
};
