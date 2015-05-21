var lodashim = require("../lodashim.js"),
  sinon = require("sinon");

exports["lodashim"] = {

  uid: function(test) {
    test.expect(2);

    var unique = 0;
    var uids = [];
    var uid;

    for (var i = 0; i < 1000; i++) {
      uid = lodashim.uid();

      if (uids.indexOf(uid) === -1) {
        unique++;
      }

      uids.push(uid);
    }

    test.equal(unique, 1000);
    test.equal(uids[0].length, 36);
    test.done();
  },

  apikey: function(test) {
    test.expect(2);

    var unique = 0;
    var apikeys = [];
    var apikey;

    for (var i = 0; i < 1000; i++) {
      apikey = lodashim.apikey();

      if (apikeys.indexOf(apikey) === -1) {
        unique++;
      }

      apikeys.push(apikey);
    }

    test.equal(unique, 1000);
    test.equal(apikeys[0].length, 22);
    test.done();
  },

  sum: function(test) {
    test.expect(4);

    var a = 0,
      b = 1,
      c = [],
      d = [0,1];

    test.equal(lodashim.sum(a), 0);
    test.equal(lodashim.sum(b), 1);
    test.equal(lodashim.sum(c), 0);
    test.equal(lodashim.sum(d), 1);

    test.done();
  },

  randomize: function(test) {
    test.expect(1);

    var a = [1,2,3,4,5,6,7,8,9,0],
      b = lodashim.clone(a);
    test.notEqual(lodashim.randomize(a), b);
    test.done();
  },

  extend: function(test) {
    test.expect(1);

    var a = {},
      b = {};

    a.fn1 = function () {
      return 1;
    };

    b.fn2 = function () {
      return 2;
    };

    lodashim.extend(a,b);
    test.equal(a.fn2(), 2);

    test.done();
  }
};
