'use strict';

/**
 * Module dependencies.
 */
require('../../server');
require('should');
var email = require('../../app/models/email.server.model.js');
var sendTo = 'hnri_mxel@hotmail.com';
/**
 * Unit tests
 */
describe('Email Model Unit Tests:', function() {

  describe('Method send', function() {
    it('should be able to send email', function(done) {
      email.send('Testing send message', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet ut leo vitae commodo. Etiam et nibh porttitor, sollicitudin leo vel, tempor ligula. Praesent eleifend condimentum enim, ut porttitor tellus. Maecenas ac molestie massa. Mauris posuere rhoncus vulputate. Curabitur eleifend, nisi sit amet maximus posuere, sem nisi porta arcu, in ultricies lectus nunc ut risus. Proin mattis metus felis, non volutpat augue pretium a. Ut interdum egestas condimentum. Sed lorem felis, rhoncus ac mollis vel, dictum at mauris. Aliquam lacinia volutpat metus, id pellentesque dolor interdum sed. Vivamus elementum tristique purus ac euismod. Nullam nibh dolor, tempus rutrum elit vel, tincidunt consectetur diam. Nam cursus erat lectus, id vulputate eros viverra nec. Fusce aliquet sem vitae ante iaculis malesuada. Maecenas ullamcorper nunc sed sem blandit mollis.', sendTo);
      done();
    });
    it('should be able to send confirmation email', function() {
      email.sendConfirmation('invalidToken', sendTo);
    });
  });

});
