/*hashblot.js Copyright (c) 2013 Stuart P. Bentley

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