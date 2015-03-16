# hashblot

Expressive hash visualization - http://hashblot.com

## What it is

Hashblot, at its most general level, is an algorithm for visualizing hash functions, by interpreting a sequence of bytes as a series of curves.

This repository contains a JavaScript library for converting byte sequences to paths, and an HTML file that takes that output for the SHA-1 hash of a string and displays the resulting image. See the "Methods" section for the exact functionality it provides.

## Installation

For Node.js/browserify:

    npm install --save hashblot

For Bower:

    bower install hashblot

hashblot.js will assign to `exports.module` if present, and `window.hashblot` if not, allowing it to be required as a Node/browserify module or included as a `<script>` source.

## Methods

### hashblot.pd.q

Takes an array of coordinates with a length divisible by 4 and converts it to an SVG Path Description string, like so:

1. Prefix the entire string with 'M' + the last two numbers, denoting that the 'pen' should be moved to the last position in the shape before drawing the curves, so it will finish as a closed path where it started.
2. Append "Q", followed by all the passed-in coordinates separated by commas, to denote a series of absolute-positioned quadratic Bézier curves, with each even pair of numbers as the X and Y coordinates of the control point, and each odd pair of numbers as the X and Y coordinates of the end point.

This function is meant to be used with an array of bytes returned from a hash function. For scenarios where you only have a hexadecimal string, you can use `hashblot.hexBytes` to convert a hexadecimal string to an array of bytes.

### hashblot.path2d.q

Takes an array of coordinates with a length divisible by 4 and an optional object implementing the [CanvasPathMethods][] `moveTo` and `quadraticCurveTo`.

[CanvasPathMethods]: http://html5index.org/Canvas%20-%20CanvasPathMethods.html

This function applies `moveTo` and `quadraticCurveTo` operations for the given hash (as described in `hashblot.pd.q`) to the given object. If no object is given, this function will create a `new Path2D()` and return that.

### hashblot.sha1qpd, hashblot.sha1qpath2d

These are versions of `hashblot.pd.q` and `hashblot.path2d.q` (respectively) that take a string, which is then converted to its SHA-1 hash and used with the corresponding function.

When `module` is defined, this function will require and use the `crypto` module to produce the SHA-1 hash.

Otherwise, it will use whatever "sha1" function is bound (see `hashblot.sha1` below).

### hashblot.bindSha1

The SHA-1 function for `hashblot.sha1qpd` and `hashblot.sha1qpath2d` is bound to whatever value of `hashblot.sha1` is defined when one of these functions is first called.

It can be bound sooner by calling `hashblot.bindSha1`, with an optional argument containing the SHA-1 function to use.

In browser environments where there are multiple potential SHA-1 implementations available, you can use [any_sha1][] to automatically define the appropriate function to use:

```
hashblot.bindSha1(any_sha1.from(any_sha1.utf8.bytes));
```

You can also copy the appropriate function for your specific library (as this module's index.html does, for [Rusha][]).

[any_sha1]: https://github.com/stuartpb/any_sha1
[Rusha]: https://github.com/srijs/rusha

## Usage

See index.html for an example of using hashblot.js to generate an image.

For things you can use hashblot images to accomplish, see [the About page](https://github.com/stuartpb/hashblot/wiki/About).

## License

The underlying methods of hashblot are released in the public domain.

The specific code of this implementation (hashblot.js and index.html) is
released into the public domain under the terms of [the Unlicense][]:

[The Unlicense]: http://unlicense.org/

> This is free and unencumbered software released into the public domain.
>
> Anyone is free to copy, modify, publish, use, compile, sell, or
> distribute this software, either in source code form or as a compiled
> binary, for any purpose, commercial or non-commercial, and by any
> means.
>
> In jurisdictions that recognize copyright laws, the author or authors
> of this software dedicate any and all copyright interest in the
> software to the public domain. We make this dedication for the benefit
> of the public at large and to the detriment of our heirs and
> successors. We intend this dedication to be an overt act of
> relinquishment in perpetuity of all present and future rights to this
> software under copyright law.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
> IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
> OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
> ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
> OTHER DEALINGS IN THE SOFTWARE.
>
> For more information, please refer to <http://unlicense.org/>
