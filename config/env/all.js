'use strict';

module.exports = {
  app: {
    title: 'maisquestoes',
    description: '+Questões API',
    keywords: 'MongoDB, Express, Node.js'
  },
  port: process.env.PORT || 3000,
  url: process.env.MQ_URL || 'http://localhost'
};
