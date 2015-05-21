var frisby = require('frisby');

var URL = 'http://localhost:3000/';

frisby.globalSetup({
  request: {
    headers: { 'X-Auth-Token': 'fa8426a0-8eaf-4d22-8e13-7c1b16a9370c' }
  }
});

frisby.create('Get home')
  .get(URL)
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes({
    o: Object,
    m: String,
    s: Number
  })
  .expectJSON({'o':{},'m':'We are hiring!!!','s':0})
  .toss();