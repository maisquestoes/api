var lodash = require("lodash");

// uid()
//
// Returns a reasonably unique id string
//
lodash.uid = function() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(chr) {
    var rnd = Math.random() * 16 | 0;
    return (chr === "x" ? rnd : (rnd & 0x3 | 0x8)).toString(16);
  }).toUpperCase();
};

// apikey()
//
// Returns a reasonably apikey string
//
lodash.apikey = function() {
  return "xxxxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function(chr) {
    var rnd = Math.random() * 16 | 0;
    return (chr === "x" ? rnd : (rnd & 0x3 | 0x8)).toString(16);
  }).toUpperCase();
};

// sum( values )
//
// Returns the sum of all values from array
//
lodash.sum = function sum(values) {
  var vals;
  if (Array.isArray(values)) {
    vals = values;
  } else {
    vals = [].slice.call(arguments);
  }
  return vals.reduce(function(accum, value) {
    return accum + value;
  }, 0);
};

// randomize()
// 
// Returns the randomized array
//
lodash.randomize = function randomize(array) {
  array.sort(function() {
    return 0.5 - Math.random();
  });
  return array;
};

module.exports = lodash;