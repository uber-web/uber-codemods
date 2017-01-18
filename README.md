# uber-codemods [![Build Status](https://travis-ci.com/uber-web/uber-codemods.svg?token=S4oyfBY3YoEdLmckujJx&branch=master)](https://travis-ci.com/uber-web/uber-codemods)

A collection of code-changing [JSCodeshift](https://github.com/facebook/jscodeshift) scripts for JavaScript.

## Install

```
npm install -g jscodeshift
npm install uber-codemods
jscodeshift -t node_modules/uber-codemods/<codemod-name> <transform-path>
```

Use the -d option for a dry-run and use -p to print the output for comparison.

## Included mods

### `r-dom-to-react-create-element`

Replaces all uses of [r-dom](https://github.com/uber/r-dom) with React's `createElement()`. After this conversion, you can optionally use the [create-element-to-jsx codemod](https://github.com/reactjs/react-codemod#create-element-to-jsx) to generate jsx.

##### Usage

```sh
jscodeshift -t node_modules/uber-codemods/src/r-dom-to-react-create-element.js <transform-path>
```

### `replace-require`

Replaces all requires **and** imports of `toReplace` with `replaceWith`. Takes two options via the cli.

##### Usage

```sh
jscodeshift -t node_modules/uber-codemods/src/replace-require.js <transform-path> --toReplace="object.omit" --replaceWith="just-omit"
```

### `xtend-to-spread`

Replaces all uses of [`xtend`](https://github.com/Raynos/xtend) with the es6 spread operator.

##### Usage

```sh
jscodeshift -t node_modules/uber-codemods/src/xtend-to-spread.js <transform-path>
```
