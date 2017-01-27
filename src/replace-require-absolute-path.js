// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// untested since this relies on local filepaths
// jest does not apply predictable paths to tests

const replaceRequire = require('./replace-require');
const path = require('path');
const process = require('process');

// prepend "./" if path is not led by "../"
const prependDotSlash = (p) => (/^\.\.\//.test(p) ? p : `./${p}`);

module.exports = function transform(file, api, opts) {
  const currentFilePath = path.join(process.cwd(), file.path);
  opts.replaceWith = prependDotSlash(path.relative(
    path.dirname(currentFilePath), opts.replaceWith));
  return replaceRequire(file, api, opts);
};
