#!/usr/bin/env node
const fs = require('fs');
const globby = require('globby');

const filesPath = 'packages/*/package.json';
const files = globby.sync(filesPath);

// TODO: modularize out this functionality to be more re-usable
files.forEach((filePath) => {
  const obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (obj.dependencies && 'object.omit' in obj.dependencies) {
    delete obj.dependencies['object.omit'];
    obj.dependencies['just-omit'] = '^1.0.1';
  }
  if (obj.devDependencies && 'object.omit' in obj.devDependencies) {
    delete obj.devDependencies['object.omit'];
    obj.devDependencies['just-omit'] = '^1.0.1';
  }

  fs.writeFileSync(filePath, `${JSON.stringify(obj, null, 2)}\n`);
});
