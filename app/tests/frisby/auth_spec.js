var frisby = require('frisby');

var URL = 'http://localhost:3000/';

frisby.create('Ensure we can create user')
  .post(URL + 'auth/signup', {
      firstName: 'Henri',
      lastName: 'Cavalcante',
      username: 'henricavalcante',
      password: 'q1w2e3r4t5y6u7i8o9',
      email: 'henri@maisquestoes.com.br'
    })
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes({
    o: Object,
    m: String,
    s: Number
  })
  .afterJSON(function(json) {
    console.log(json);
    expect(json.s == 1);
  })
  .toss();
