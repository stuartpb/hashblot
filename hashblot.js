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

var hashblot = {pd:{}, path2d:{}};
var sha1;

function hexBytes(s) {
  var l = s.length / 2;
  var a = new Array(l);
  for (var i = 0; i < l; ++i) {
    a[i] = parseInt(s.slice(i*2, (i*2)+2), 16);
  }
  return a;
}

function bindSha1(f) {
  return sha1 = f || hashblot.sha1 || window.sha1;
}

if(typeof module != "undefined") {
  module.exports = hashblot;
  var crypto = require('crypto');
  sha1 = function sha1Node(content) {
    return Array.apply([],
      crypto.createHash('sha1').update(content, 'utf8').digest());
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
  return 'M' + hash[hash.length-2] + ',' + hash[hash.length-1] +
    'Q'+ hash.join();
}

function qpath2d (hash, ctx) {
  if(typeof hash == "string" || hash.length === undefined)
    throw new Error("input must be an array of values");
  if(hash.length % 4 != 0)
    throw new Error("length of input must be divisible by 4");
  ctx = ctx || new Path2D();
  ctx.moveTo(hash[hash.length-2], hash[hash.length-1]);
  for(var i=0; i < hash.length; i+=4) {
    ctx.quadraticCurveTo(hash[i], hash[i+1], hash[i+2], hash[i+3]);
  }
  return ctx;
}

hashblot.qpd = qpd;
hashblot.pd.q = qpd;
hashblot.sha1qpd = function(content) {return qpd(sha1(content))};
hashblot.qpath2d = qpath2d;
hashblot.path2d.q = qpath2d;
hashblot.sha1qpath2d = function(content, ctx) {
  return qpath2d(sha1(content), ctx)};
hashblot.hexBytes = hexBytes;
hashblot.bindSha1 = bindSha1;
})();
