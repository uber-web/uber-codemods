# uber-codemods
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

A collection of code-changing [JSCodeshift's](https://github.com/facebook/jscodeshift) for JavaScript.

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

### `replace-require-absolute-path`

Replaces all requires **and** imports of `toReplace` with the relative path to `replaceWith`. Takes two options via the cli. The reason this is needed as a separate mod from `replace-require` is because the relative path to `replaceWith` changes relative to the current file being evaluated by jscodeshift.

##### Usage

```sh
jscodeshift -t node_modules/uber-codemods/src/replace-require-absolute-path.js <transform-path> --toReplace="object.omit" --replaceWith=$(pwd)/just-omit
```

### `xtend-to-spread`

Replaces all uses of [`xtend`](https://github.com/Raynos/xtend) with the es6 spread operator.

##### Usage

```sh
jscodeshift -t node_modules/uber-codemods/src/xtend-to-spread.js <transform-path>
```

## License

MIT © [Uber](https://uber.com)

[npm-image]: https://badge.fury.io/js/uber-codemods.svg
[npm-url]: https://npmjs.org/package/uber-codemods
[travis-image]: https://travis-ci.org/uber-web/uber-codemods.svg?branch=master
[travis-url]: https://travis-ci.org/uber-web/uber-codemods
