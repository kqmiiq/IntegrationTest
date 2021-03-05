/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var http = require('k6/http');
var metrics = require('k6/metrics');
var k6 = require('k6');

module.exports.options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 10 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    'failed requests': ['rate<0.1'],
  },
};

var myFailRate = new metrics.Rate('failed requests');

module.exports.default = function () {
  var res = http.get('https://ertisdaryn.kz');
  var checkRes = k6.check(res, {
    'status was 200': function (r) {
      return r.status == 200;
    },
  });
  if (!checkRes) {
    myFailRate.add(1);
  }
  k6.sleep(1);
};

