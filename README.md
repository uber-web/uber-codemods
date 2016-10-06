# codemods [![Build Status](https://travis-ci.com/uber-web/codemods.svg?token=S4oyfBY3YoEdLmckujJx&branch=master)](https://travis-ci.com/uber-web/codemods)

A collection of code-changing scripts for JavaScript. Most of them should be used with [JSCodeshift](https://github.com/facebook/jscodeshift).

## Usage

```
<clone this repo>
npm install -g jscodeshift
jscodeshift -t <path-to-codemod-script> <file-or-path-to-transform>
```

Use the -d option for a dry-run and use -p to print the output for comparison.

## Included mods

### objectOmit-to-justOmit

Replaces all uses of [object.omit](https://github.com/jonschlinkert/object.omit) with [just-omit](https://github.com/angus-c/just/tree/master/packages/object-omit)

```
# convert js
jscodeshift -t codemods/src/objectOmit-to-justOmit.js packages/*/src

# convert package.json
node codemods/objectOmit-to-justOmit-packageJSON/cli.js
```



