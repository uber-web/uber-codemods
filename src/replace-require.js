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

const escapeStringRegexp = require('escape-string-regexp');

function replaceImport(source, j, opts) {
  return j(source)
    .find(j.ImportDeclaration)
    .find(j.Literal)
    .filter(function filterValidRequires(literal) {
      const rawValue = literal.value.rawValue;
      return typeof rawValue === 'string' && opts.toReplace.test(rawValue);
    })
    .replaceWith(function replaceValidRequires(literal) {
      const rawValue = literal.value.rawValue;
      const toRet = (rawValue).replace(opts.toReplace, opts.replaceWith);
      return j.literal(toRet);
    })
    .toSource({quote: 'single'});
}

function replaceRequire(source, j, opts) {
  return j(source)
    .find(j.VariableDeclaration)
    .find(j.CallExpression)
    .filter(function filterNonRequires(callExpression) {
      return callExpression.value.callee.name === 'require';
    })
    .replaceWith(literal => {
      const rawValue = literal.value.arguments[0].rawValue;
      if (typeof rawValue === 'string') {
        const newRawValue = (rawValue).replace(opts.toReplace, opts.replaceWith);
        return j.callExpression(
          j.identifier('require'),
          [j.literal(newRawValue)]
        );
      }
      // fall-through if rawValue is not a string
      return literal;
    })
    .toSource({quote: 'single'});
}

module.exports = function replace(file, api, opts) {
  const j = api.jscodeshift;
  const source = file.source;

  opts.toReplace = new RegExp(`^${escapeStringRegexp(opts.toReplace)}`);
  const newSource = replaceImport(source, j, opts);
  return replaceRequire(newSource, j, opts);
};
