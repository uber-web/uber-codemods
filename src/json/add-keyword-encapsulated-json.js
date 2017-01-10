/* eslint-disable no-console */
const process = require('process');
const jsonfile = require('jsonfile');
const globby = require('globby');
const filePath = process.argv[2];
const intersect = require('just-intersect');

const conditionalKeywords = [
  '@uber/superbase',
  '@uber/react-superbase',
  '@uber/superfine-react'];

const keywordToAdd = 'style-encapsulated';
const writeOpts = {spaces: 2};

if (typeof filePath === 'undefined') {
  console.error('missing json file(s) path');
  return;
}

const filePaths = globby.sync(filePath);

filePaths.forEach(path => {
  jsonfile.readFile(path, function readCb(err, obj) {
    if (err) {
      console.error(`error reading file "${path}": ${err}`);
    }
    const keywords = obj.keywords || [];
    // if keyword already exists, don't change anything
    if (keywords.indexOf(keywordToAdd) > -1) {
      return;
    }

    const dependencies = obj.dependencies || [];
    const devDependencies = obj.devDependencies || [];
    const allDeps = Object.keys(dependencies).concat(Object.keys(devDependencies));

    // if conditional keyword does not exist, return
    if (intersect(allDeps, conditionalKeywords).length === 0) {
      //
      return;
    }
    // else, append keyword
    keywords.push(keywordToAdd);
    obj.keywords = keywords;
    jsonfile.writeFile(path, obj, writeOpts, function writeCb(writeErr) {
      if (writeErr) {
        console.error(`error writing file "${path}": ${writeErr}`);
      }
    });
  });
});
