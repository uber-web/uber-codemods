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

function isChildren(x) {
  if (typeof x === 'undefined') {
    return false;
  }
  return x.type === 'Literal' || x.type === 'ArrayExpression';
}

function removeImport(source, j) {
  let rDomIdentifier;
  return {
    source: j(source)
      .find(j.ImportDeclaration)
      .filter(importDeclaration => {
        return importDeclaration.value.source.rawValue === 'r-dom';
      })
      .filter(importDeclaration => {
        rDomIdentifier = importDeclaration.value.specifiers[0].local.name;
        return true;
      })
      .remove()
    .toSource({quote: 'single'}),
    rDomIdentifier
  };
}

function isRDom(callExpression, rDomIdentifier) {
  if (rDomIdentifier && callExpression.value.callee.name === rDomIdentifier) {
    return 1;
  }
  if (rDomIdentifier &&
      callExpression.value.callee.object &&
      callExpression.value.callee.object.name === rDomIdentifier) {
    return 2;
  }
  return false;
}

function validateElement(element) {
  const elements = [
    'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo',
    'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col',
    'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt',
    'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3',
    'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input',
    'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu',
    'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option',
    'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's',
    'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub',
    'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time',
    'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', 'circle', 'clipPath', 'defs',
    'ellipse', 'g', 'image', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon',
    'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'
  ];

  if (typeof element === 'string' && !elements.includes(element)) {
    /* eslint-disable no-console, no-undef */
    console.error('Unknown Element:', element);
    /* eslint-enable no-undef, no-console */
  }
}

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const {source, rDomIdentifier} = removeImport(file.source, j);

  return j(source)
      .find(j.CallExpression)
      .filter(callExpression => {
        return isRDom(callExpression, rDomIdentifier);
      })
      .map(callExpression => {
        let elementIdentifier;
        let args = [];
        if (isRDom(callExpression, rDomIdentifier) === 1) {
          elementIdentifier = callExpression.value.arguments[0];
          args = callExpression.value.arguments;
        } else if (isRDom(callExpression, rDomIdentifier) === 2) {
          elementIdentifier = callExpression.value.callee.property.name;
          args = callExpression.value.arguments;
          args.unshift(j.literal(elementIdentifier));
        }
        if (!elementIdentifier) {
          return callExpression;
        }
        if (!args[2] && isChildren(args[1])) {
          args[2] = args[1];
          args[1] = j.objectExpression([]);
        }
        validateElement(args[0].value);
        return callExpression.replace(
          j.callExpression(
            j.memberExpression(
              j.identifier('React'), j.identifier('createElement')
            ), args)
          );
      })
    .toSource({quote: 'single'});
}

// Array includes polyfill for node 4
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
/* eslint-disable */
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);
      var len = o.length >>> 0;

      if (len === 0) {
        return false;
      }

      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      while (k < len) {
        if (o[k] === searchElement) {
          return true;
        }
        k++;
      }

      return false;
    }
  });
}
/* eslint-enable */
