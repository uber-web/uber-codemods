import test from 'ava';
import {execSync} from 'child_process';
import globby from 'globby';
import path from 'path';
// import tempWrite from 'temp-write';
import tempfile from 'tempfile';
import fs from 'fs-extra';

const fixturesPath = path.join(__dirname, 'fixtures');

const codemods = {
  'r-dom-to-create-element': {},
  'replace-require': {
    toReplace: 'object.omit',
    replaceWith: 'just-omit'
  },
  'xtend-to-spread': {}
};

// convert flag object to linux-friendly flags
const flagify = (flags) => {
  return Object.keys(flags).reduce((acc, key) => {
    return `${acc}--${key}="${flags[key]}" `;
  }, '');
};
test('flagify helper function', t => {
  t.regex(flagify({a: 'b'}), /--a="b"/);
  t.regex(flagify({a: 'b', c: 'd'}), /--a="b" --c="d"/);
});

const srcPath = path.join(__dirname, '..', 'src');

// copy
const writeTemp = (modName) => {
  const tempFileName = tempfile('.js');
  fs.copySync(path.join(fixturesPath, 'inputs', modName), tempFileName);
  return tempFileName;
};

test.only(t => {
  t.plan(1);
  const modName = 'replace-require';
  const flags = codemods[modName];

  const jscodeshiftPath = path.join(__dirname, '..', 'node_modules', '.bin', 'jscodeshift');
  const modPath = path.join(srcPath, `${modName}.js`);
  const inputPath = writeTemp(`${modName}.js`);
  const expectedOutputPath = path.join(fixturesPath, 'outputs', `${modName}.js`);

  const commands = [jscodeshiftPath, '-t', modPath, inputPath, flagify(flags)];
  execSync(commands.join(' '));
  t.is(fs.readFileSync(inputPath, 'utf8'), fs.readFileSync(expectedOutputPath, 'utf8'));
});
