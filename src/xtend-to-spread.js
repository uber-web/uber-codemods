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

function removeImport(source, j) {
  let extendIdentifier;
  const root = j(source);
  const getFirstNode = () => root.find(j.Program).get('body', 0).node;

  // Save the comments attached to the first node
  // https://github.com/facebook/jscodeshift/blob/master/recipes/retain-first-comment.md
  const firstNode = getFirstNode();
  const {comments} = firstNode;

  root
      .find(j.ImportDeclaration)
      .filter(importDeclaration => {
        return importDeclaration.value.source.rawValue === 'xtend';
      })
      .filter(importDeclaration => {
        extendIdentifier = importDeclaration.value.specifiers[0].local.name;
        return true;
      })
      .remove();

  // If the first node has been modified or deleted, reattach the comments
  const firstNode2 = getFirstNode();
  if (firstNode2 !== firstNode) {
    firstNode2.comments = comments;
  }

  return {
    source: root.toSource({quote: 'single'}),
    extendIdentifier
  };
}

function convertToSpread(callExpression, j) {
  const returnArr = [];
  callExpression.value.arguments
    .filter(argument => {
      if (argument.type === 'ObjectExpression' && argument.properties.length === 0) {
        return false;
      }
      return true;
    })
    .map(argument => {
      if (argument.type === 'ObjectExpression') {
        argument.properties.map((property, i) => {
          const returnProperty = property;
          if (i === 0 && argument.leadingComments) {
            returnProperty.comments = argument.leadingComments;
            returnProperty.leadingComments = argument.leadingComments;
          }
          returnArr.push(returnProperty);
        });
      } else {
        let leadingComments;
        if (argument.leadingComments) {
          leadingComments = argument.leadingComments;
          delete argument.leadingComments;
          delete argument.comments;
        }
        const spreadArgument = j.spreadProperty(argument);
        if (leadingComments) {
          spreadArgument.leadingComments = leadingComments;
          spreadArgument.comments = leadingComments;
        }
        returnArr.push(spreadArgument);
      }
    });
  return returnArr;
}

function transformUsage(source, extendIdentifier, j) {
  return j(source)
    .find(j.CallExpression)
    .filter(callExpression => {
      return extendIdentifier && callExpression.node.callee.name === extendIdentifier;
    })
    .map(callExpression => {
      return callExpression.replace(j.objectExpression(convertToSpread(callExpression, j)));
    }).toSource({quote: 'single'});
}

function transformer(file, api) {
  const shifted = removeImport(file.source, api.jscodeshift);
  return transformUsage(shifted.source, shifted.extendIdentifier, api.jscodeshift);
}

export default transformer;

