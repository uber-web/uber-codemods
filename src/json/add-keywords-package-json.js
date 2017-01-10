/* eslint-disable no-console */
const process = require('process');
const jsonfile = require('jsonfile');
const globby = require('globby');
const filePath = process.argv[2];

const keywordToAdd = 'superfine-react-component';
const writeOptions = require('./write-options.json');

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
    const _keywords = obj.keywords || [];
    // if keyword already exists, don't change anything
    if (_keywords.indexOf(keywordToAdd) > -1) {
      return;
    }
    _keywords.push(keywordToAdd);
    obj.keywords = _keywords;
    jsonfile.writeFile(path, obj, writeOptions, function writeCb(writeErr) {
      if (writeErr) {
        console.error(`error writing file "${path}": ${writeErr}`);
      }
    });
  });
});
