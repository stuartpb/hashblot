# hashblot

Expressive hash visualization - http://hashblot.com

## What it is

Hashblot, at its most general level, is an algorithm for visualizing hash functions, by interpreting a sequence of bytes as a series of curves.

This repository contains a JavaScript library for converting byte sequences to SVG path attributes, and an HTML file that takes that output for the SHA-1 hash of a string and displays the resulting image. See the "Methods" section for the exact functionality it provides.

## Installation

For Node.js/browserify:

    npm install --save hashblot

For Bower:

    bower install hashblot

hashblot.js will assign to `exports.module` if present, and `window.hashblot` if not, allowing it to be required as a Node/browserify module or included as a `<script>` source.

## Methods

### hashblot.qpd

Takes a hexadecimal string with a length divisible by 8 and converts it to an SVG Path Description string, like so:

1. Interpret every group of 8 characters as 4 bytes and convert them to four decimal numbers. (The SVG spec states they can be separated by spaces or commas: since the numbers stand for 2 coordinate pairs, this implementation uses commas inside the pairs and a space between them, eg "1,2 3,4").
2. Prefix each group of 4 characters with "Q" to denote an absolute-positioned quadratic Bézier, with the first two numbers as the X and Y coordinates of the control point, and the second two numbers as the X and Y coordinates of the end point.
3. Prefix the entire string with 'M' + the last two numbers, denoting that the 'pen' should be moved to the last position in the shape before drawing the curves, so it will finish as a closed path where it started.

### hashblot.qpath2d

Takes a hexadecimal string with a length divisible by 8 and an optional object implementing the [CanvasPathMethods][] `moveTo` and `quadraticCurveTo`.

[CanvasPathMethods]: http://html5index.org/Canvas%20-%20CanvasPathMethods.html

This function applies `moveTo` and `quadraticCurveTo` operations for the given hash (as described in `hashblot.qpd`) to the given object. If no object is given, this function will create a `new Path2D()` and return that.

### hashblot.sha1qpd, hashblot.sha1qpath2d

These are versions of `hashblot.qpd` and `hashblot.qpath2d` (respectively) that take a string, which is then converted to its SHA-1 hash and used with the corresponding function.

See `hashblot.bindSha1` for how the SHA-1 hash is determined.

### hashblot.bindSha1

The SHA-1 function for `hashblot.sha1qpd` and `hashblot.sha1qpath2d` is bound when one of these functions is first called. It can be bound sooner by calling `hashblot.bindSha1`, with an optional argument containing the SHA-1 function to use.

When `module` is defined, this function will require and use the `crypto` module to produce the SHA-1 hash.

Otherwise, it will try to use SHA-1 functions from the following projects, in order:

- [Rusha](https://github.com/srijs/rusha)
- [Forge](https://github.com/digitalbazaar/forge#sha1)
- [SJCL](https://github.com/bitwiseshiftleft/sjcl)
- [jsSHA](https://github.com/Caligatio/jsSHA)
- [Paul Johnston's hex_sha1 function](http://pajhome.org.uk/crypt/md5/)
- [CryptoJS](https://code.google.com/p/crypto-js/)
- [PolyCrypt](https://github.com/polycrypt/polycrypt)

(Pull requests to add more implementations are welcome.)

If none of these are present (and `hashblot.bindSha1` wasn't called with a function to use), it will use whatever the value of `window.sha1` is as a last resort.

For SHA-1 functions that don't handle strings with character codes outside the 0-255 range (pretty much all of them), the string will first be converted to UTF-8 via the [unescape-encodeURIComponent method][1].

[1]: http://ecmanaut.blogspot.com/2006/07/encoding-decoding-utf8-in-javascript.html

## Usage

See index.html for an example of using hashblot.js to generate an image.

For things you can use hashblot images to accomplish, see [the About page](https://github.com/stuartpb/hashblot/wiki/About).

## License

The underlying methods of hashblot are released in the public domain.

The specific code of this implementation (hashblot.js and index.html) is made available under the terms of the MIT license:

Copyright (c) 2014 Stuart P. Bentley

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
