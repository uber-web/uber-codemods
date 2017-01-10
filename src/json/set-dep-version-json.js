/* eslint-disable no-console */
const process = require('process');
const jsonfile = require('jsonfile');
const globby = require('globby');
const filePath = process.argv[2];
const writeOptions = require('./write-options.json');
const packageName = '@uber/react-inline-icons';

const filePaths = globby.sync(filePath);

filePaths.forEach(path => {
  jsonfile.readFile(path, function readCb(err, obj) {
    if (err) {
      console.error(`error reading file "${path}": ${err}`);
    }
    const _keywords = obj.keywords || [];
    // if keyword already exists, don't change anything
    if (_keywords.indexOf(packageName) > -1) {
      return;
    }
    _keywords.push(packageName);
    obj.keywords = _keywords;
    jsonfile.writeFile(path, obj, writeOptions, function writeCb(writeErr) {
      if (writeErr) {
        console.error(`error writing file "${path}": ${writeErr}`);
      }
    });
  });
});
