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

function charCodes(s) {
  var l = s.length;
  var a = new Array(l);
  for (var i = 0; i < l; ++i) {
    a[i] = s.charCodeAt(i);
  }
  return a;
}

function hexBytes(s) {
  var l = s.length / 2;
  var a = new Array(l);
  for (var i = 0; i < l; ++i) {
    a[i] = parseInt(s.slice(i*2, 2), 16);
  }
  return a;
}

function bindSha1(f) {
  /*global Rusha hex_sha1 jsSHA sjcl forge CryptoJS*/
  if (f) {
    sha1 = f;
  } else if (typeof(Rusha) != "undefined") {
    var rusha = new Rusha();
    sha1 = function sha1Rusha(content) {
      return Array.apply([], new Uint8Array(
        rusha.rawDigest(unescape(encodeURIComponent(content))).buffer));
    };
  } else if (typeof(forge) != "undefined") {
    sha1 = function sha1Forge(content) {
      return charCodes(forge.md.sha1.create()
        .update(unescape(encodeURIComponent(content))).digest().bytes());
    };
  } else if (typeof(sjcl) != "undefined" && sjcl.hash.sha1) {
    sha1 = function sha1Sjcl(content) {
      var result = sjcl.hash.sha1.hash(unescape(encodeURIComponent(content)));
      var a = new Array(20);
      for (var i = 0; i < 5; ++i) {
        a[i*4] = result[i] & 0xFF;
        a[i*4+1] = result[i] >> 8 & 0xFF;
        a[i*4+2] = result[i] >> 16 & 0xFF;
        a[i*4+3] = result[i] >> 24;
      }
      return a;
    };
  } else if (typeof(jsSHA) != "undefined") {
    sha1 = function sha1JsSHA(content) {
      return hexBytes(new jsSHA(unescape(encodeURIComponent(content)),'TEXT')
        .getHash('SHA-1','HEX'));
    };
  } else if (typeof(hex_sha1) != "undefined") {
    sha1 = function sha1Paj(content) {
      return hexBytes(hex_sha1(content));
    };
  } else if (typeof(CryptoJS) != "undefined") {
    sha1 = function sha1CryptoJS(content) {
      return hexBytes(CryptoJS.SHA1(unescape(encodeURIComponent(content))));
    };
  } else if (window.polycrypt) {
    sha1 = function sha1Polycrypt(content) {
      return hexBytes(window.polycrypt.digest('SHA-1',
        unescape(encodeURIComponent(content))));
    };
  } else {
    sha1 = window.sha1;
  }
}

if(typeof module != "undefined") {
  module.exports = hashblot;
  var crypto = require('crypto');
  sha1 = function sha1Node(content) {
    return crypto.createHash('sha1').update(content,'utf8').digest('hex');
  };
} else {
  window.hashblot = hashblot;
  sha1 = function sha1LateBinding(content) {
    bindSha1();
    return sha1(content);
  };
}

function pH(s){return parseInt(s,16)}

function qpd (hash) {
  if(typeof hash.join != "function" || hash.length === undefined)
    throw new Error("input must be an array of values");
  if(hash.length % 4 != 0)
    throw new Error("length of input must be divisible by 4");
  return 'M' + hash[hash.length-1] + ',' + hash[hash.length] +
    'Q'+ hash.join();
}

function qpath2d (hash, ctx) {
  if(typeof hash == "string" || hash.length === undefined)
    throw new Error("input must be an array of values");
  if(hash.length % 4 != 0)
    throw new Error("length of input must be divisible by 4");
  ctx = ctx || new Path2D();
  ctx.moveTo(hash[hash.length-1], hash[hash.length]);
  for(var i=0; i < hash.length; i+=4) {
    ctx.quadraticCurveTo(hash[i], hash[i+1], hash[i+2], hash[i+3]);
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
