# codemods

A collection of code-changing scripts for JavaScript. Most of them should be used with [JSCodeshift](https://github.com/facebook/jscodeshift).

## Usage

```
<clone this repo>
npm install -g jscodeshift
jscodeshift -t <path-to-codemod-script> <file-or-path-to-transform>
```

Use the -d option for a dry-run and use -p to print the output for comparison.

## Included mods

### JavaScript Codemods

####  object-omit-to-just-omit

Replaces all uses of [object.omit](https://github.com/jonschlinkert/object.omit) with [just-omit](https://github.com/angus-c/just/tree/master/packages/object-omit)

```
# convert js
jscodeshift -t codemods/src/object-omit-to-just-omit.js packages/*/src

# convert package.json
node codemods/object-omit-to-just-omit-json/cli.js
```

####  dot-import-to-dot-dot-import

Replaces all hardcoded file path imports with the file path one directory higher

```
jscodeshift -t codemods/src/dot-import-to-dot-dot-import.js packages/*/src/scratchpad/index.js
```

### JSON Codemods

#### add-keywords-package-json

Adds keywords to package.json files. Creates keyword field if none exists * Don't forget quotes around a filepath which contains a wildcard *

```
node src/add-keywords-package-json.js "packages/*/package.json"
```

#### add-keyword-conditional-package-json

Adds keywords to package.json files. If conditional dependency (or devDependency exists). Creates keyword field if none exists * Don't forget quotes around a filepath which contains a wildcard *

```
node src/add-keywords-package-json.js "packages/*/package.json"
```
