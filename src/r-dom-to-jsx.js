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

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const { source, rDomIdentifier } = removeImport(file.source, j);

  const collection = j(source).find(j.CallExpression);

  // This is a hack to do depth-first traversal:
  // Jscodemod collections are built from a pre-order traversal.
  // We want to traverse the collection depth-first. Reversing a
  // pre-oder traversal yields a depth-first traversal.
  collection.__paths.reverse();

  return collection.map(replaceRdomCalls).toSource({ quote: "single" });

  function replaceRdomCalls(callExpression) {
    if (callExpression.node.type !== "CallExpression") {
      console.log(callExpression, callExpression.node.type);
      return callExpression;
    }
    const [componentName, ...args] = callExpressionToRdomCall(callExpression, rDomIdentifier);
    if (!componentName) {
      return callExpression;
    }
    const { attrs, childElements } = rdomCallArgumentsToAttrsAndChildElements(args);
    return callExpression.replace(jsxElement(componentName.name, attrs, childElements));
  }

  // There are two ways to call r-dom:
  // - r.div() // for built-in elements
  // - r(MyComponent) // for Components
  function callExpressionToRdomCall(callExpression, rDomIdentifier) {
    return isRdomCallComponent(callExpression, rDomIdentifier)
      ? callExpression.value.arguments
      : isRdomDotElement(callExpression, rDomIdentifier) ? [callExpression.value.callee.property, ...callExpression.value.arguments] : [];
  }

  function objectPropertyToJsxAttribute(prop) {
    return j.jsxAttribute(j.jsxIdentifier(prop.key.name), j.jsxExpressionContainer(prop.value));
  }

  function rdomCallArgumentsToAttrsAndChildElements(args) {
    const [props, children] = args.length === 1 && isChildren(args[0]) ? [null, args[0]] : args;

    const attrs = props ? props.properties.map(objectPropertyToJsxAttribute) : [];
    const childElements = children && children.elements.length > 0 ? children.elements : null;
    return { attrs, childElements };
  }

  // Handles both self-closing and with children
  function jsxElement(componentName, props = [], children = null) {
    return !children
      ? j.jsxElement(j.jsxOpeningElement(j.jsxIdentifier(componentName), props, true))
      : j.jsxElement(j.jsxOpeningElement(j.jsxIdentifier(componentName), props), j.jsxClosingElement(j.jsxIdentifier(componentName)), children);
  }
};

function isChildren(x) {
  if (typeof x === "undefined") {
    return false;
  }
  return x.type === "Literal" || x.type === "ArrayExpression";
}

function removeImport(source, j) {
  let rDomIdentifier;
  const root = j(source);
  const getFirstNode = () => root.find(j.Program).get("body", 0).node;

  // Save the comments attached to the first node
  // https://github.com/facebook/jscodeshift/blob/master/recipes/retain-first-comment.md
  const firstNode = getFirstNode();
  const { comments } = firstNode;

  root
    .find(j.ImportDeclaration)
    .filter(importDeclaration => {
      return importDeclaration.value.source.rawValue === "@uber/r-domx";
    })
    .filter(importDeclaration => {
      rDomIdentifier = importDeclaration.value.specifiers[0].local.name;
      return true;
    })
    .remove();

  // If the first node has been modified or deleted, reattach the comments
  const firstNode2 = getFirstNode();
  if (firstNode2 !== firstNode) {
    firstNode2.comments = comments;
  }

  return {
    source: root.toSource({ quote: "single" }),
    rDomIdentifier
  };
}

function isRDom(callExpression, rDomIdentifier) {
  if (rDomIdentifier && callExpression.value.callee.name === rDomIdentifier) {
    return 1;
  }
  if (
    rDomIdentifier &&
    callExpression.value.callee.object &&
    callExpression.value.callee.object.name === rDomIdentifier &&
    callExpression.value.callee.property &&
    isValidElement(callExpression.value.callee.property.name)
  ) {
    return 2;
  }
  return false;
}

// Returns whether the call expression is something like r.div()
function isRdomDotElement(callExpression, rDomIdentifier) {
  return (
    rDomIdentifier &&
    callExpression.value.callee.object &&
    callExpression.value.callee.object.name === rDomIdentifier &&
    callExpression.value.callee.property &&
    isValidElement(callExpression.value.callee.property.name)
  );
}

// Returns whether the call expression is something like r(MyComponent)
function isRdomCallComponent(callExpression, rDomIdentifier) {
  return rDomIdentifier && callExpression.value.callee.name === rDomIdentifier;
}

const RDOM_ELEMENTS = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "big",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  "circle",
  "clipPath",
  "defs",
  "ellipse",
  "g",
  "image",
  "line",
  "linearGradient",
  "mask",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "stop",
  "svg",
  "text",
  "tspan"
];
function isValidElement(element) {
  return typeof element === "string" && RDOM_ELEMENTS.includes(element);
}
