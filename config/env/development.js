'use strict';

module.exports = {
  db: 'mongodb://127.0.0.1/maisquestoes-dev',
  app: {
    title: 'maisquestoes - Development Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/auth/facebook/callback'
  }
};
