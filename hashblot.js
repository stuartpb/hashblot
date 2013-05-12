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

function qp (hash) {
  var qwords = hash.length / 8;
  var pathNodes = [];
  pathNodes[0] =
    'M' + parseInt(hash.slice(-4, -2), 16) +
    ',' + parseInt(hash.slice(-2    ), 16);
  for(var i = 1; i < qwords; i++) {
    var base = (i-1) * 8;
    pathNodes[i] =
      'Q' + parseInt(hash.slice(base  ,base+2), 16) +
      ',' + parseInt(hash.slice(base+2,base+4), 16) +
      ' ' + parseInt(hash.slice(base+4,base+6), 16) +
      ',' + parseInt(hash.slice(base+6,base+8), 16) ;
  }
  return pathNodes.join(' ');
}

hashblot.qp = qp;
hashblot.sha1qp = function(content) {return qp(sha1(content))};

})();