/*hashblot.js Copyright (c) 2014 Stuart P. Bentley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function(){

"use strict";

var hashblot = {};
var sha1;

function bindSha1(f) {
  /*global Rusha hex_sha1 jsSHA sjcl forge CryptoJS*/
  if (f) {
    sha1 = f;
  } else if (typeof(Rusha) != "undefined") {
    var rusha = new Rusha();
    sha1 = function sha1Rusha(content) {
      return rusha.digest(unescape(encodeURIComponent(content)));
    };
  } else if (typeof(forge) != "undefined") {
    sha1 = function sha1Forge(content) {
      return forge.md.sha1.create()
        .update(unescape(encodeURIComponent(content))).digest().toHex();
    };
  } else if (typeof(sjcl) != "undefined" && sjcl.hash.sha1) {
    sha1 = function sha1Sjcl(content) {
      return sjcl.hash.sha1(unescape(encodeURIComponent(content)));
    };
  } else if (typeof(jsSHA) != "undefined") {
    sha1 = function sha1JsSHA(content) {
      return new jsSHA(unescape(encodeURIComponent(content)),'TEXT')
        .getHash('SHA-1','HEX');
    };
  } else if (typeof(hex_sha1) != "undefined") {
    sha1 = function sha1Paj(content) {
      return hex_sha1(unescape(encodeURIComponent(content)));
    };
  } else if (typeof(CryptoJS) != "undefined") {
    sha1 = function sha1CryptoJS(content) {
      return CryptoJS.SHA1(unescape(encodeURIComponent(content)));
    };
  } else if (window.polycrypt) {
    sha1 = function sha1Polycrypt(content) {
      return window.polycrypt.digest('SHA-1',
        unescape(encodeURIComponent(content)));
    };
  } else {
    sha1 = window.sha1;
  }
}

if(typeof module != "undefined") {
  module.exports = hashblot;
  var crypto = require('crypto');
  sha1 = function sha1Node(content) {
    var hash = crypto.createHash('sha1');
    hash.update(content,'utf8');
    return hash.digest('hex');
  };
} else {
  window.hashblot = hashblot;
  sha1 = function sha1LateBinding(content) {
    bindSha1();
    return sha1(content);
  };
}

function pH(s){return parseInt(s,16)}

var qwords = new RegExp(new Array(5).join("([0-9a-fA-F][0-9a-fA-F])"),'g');

function qpd (hash) {
  if(typeof hash != "string" || !hash.match(/^[0-9a-fA-F]*$/))
    throw new Error("input must be a string of hexadecimal characters");
  if(hash.length / 8 % 1 != 0)
    throw new Error("length of input must be divisible by 8");
  return hash.replace(qwords, function(m,xc,yc,x2,y2) {
      return 'Q' + pH(xc) + ',' + pH(yc) + ' ' + pH(x2) + ',' + pH(y2)})
    .replace(/^.*?(\d*,\d*)$/,"M$1$&");
}

function qpath2d (hash, ctx) {
  if(typeof hash != "string" || !hash.match(/^[0-9a-fA-F]*$/))
    throw new Error("input must be a string of hexadecimal characters");
  if(hash.length / 8 % 1 != 0)
    throw new Error("length of input must be divisible by 8");
  ctx = ctx || new Path2D();
  ctx.moveTo(pH(hash.substr(-4,2)),pH(hash.substr(-2,2)));
  for(var i=0; i < hash.length; i+=8) {
    ctx.quadraticCurveTo(pH(hash.substr(i,2)),pH(hash.substr(i+2,2)),
      pH(hash.substr(i+4,2)),pH(hash.substr(i+6,2)));
  }
  return ctx;
}

hashblot.qpd = qpd;
hashblot.sha1qpd = function(content) {return qpd(sha1(content))};
hashblot.qpath2d = qpath2d;
hashblot.sha1qpath2d = function(content,ctx) {
  return qpath2d(sha1(content),ctx)};
hashblot.bindSha1 = bindSha1;
})();
