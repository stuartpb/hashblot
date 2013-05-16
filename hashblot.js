(function(){
  
"use strict";
  
var hashblot = {};
var sha1;

if(typeof module != "undefined") {
  module.exports = hashblot;
  var crypto = require('crypto');
  sha1 = function sha1(content) {
    var hash = crypto.createHash('sha1');
    hash.update(content,'utf8');
    return hash.digest('hex');
  };
} else {
  window.hashblot = hashblot;
  sha1 = function sha1(content) {
    /*global jsSHA*/
    return new jsSHA(content,'TEXT').getHash('SHA-1','HEX');
  };
}

function pH(s){return parseInt(s,16)}

var qwords = new RegExp(new Array(5).join("([0-9a-fA-F][0-9a-fA-F])"),'g');

function qp (hash) {
  if(typeof hash != "string" || !hash.match(/^[0-9a-fA-F]*$/))
    throw new Error("input must be a string of hexadecimal characters");
  if(hash.length / 8 % 1 != 0)
    throw new Error("length of input must be divisible by 8");
  return hash.replace(qwords, function(m,xc,yc,x2,y2) {
      return 'Q' + pH(xc) + ',' + pH(yc) + ' ' + pH(x2) + ',' + pH(y2)})
    .replace(/^.*?(\d*,\d*)$/,"M$1$&");
}

hashblot.qp = qp;
hashblot.sha1qp = function(content) {return qp(sha1(content))};

})();