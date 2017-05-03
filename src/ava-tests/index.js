import test from 'ava';
import execa from 'execa';

import tempDirCp from 'temp-dir-cp';
import path from 'path';

const jscodeshiftExecutable = path.resolve('node_modules/.bin/jscodeshift');
const baseDir = path.join(__dirname, '..');
const fixturePath = path.join(baseDir, '__testfixtures__');
const tempDir = tempDirCp(fixturePath);

const fixtures = {
  'r-dom-to-react-create-element': {},
  'replace-require': {
    toReplace: 'object.omit',
    replaceWith: 'just-omit'
  },
  'xtend-to-spread': {}
};

// convert flag object to linux-friendly flags
const flagify = (flags) => {
  return Object.keys(flags).reduce((acc, key) => {
    acc.push(`--${key}="${flags[key]}"`);
    return acc;
  }, []);
};

test('flagify helper function', t => {
  t.deepEqual(flagify({a: 'b'}), ['--a="b"']);
  t.deepEqual(flagify({a: 'b', c: 'd'}), ['--a="b"', '--c="d"']);
});

const verifyCodemod = (t, modName) => {
  const fixture = path.join(tempDir, modName);
  const args = ['-t', path.join(baseDir, `${modName}.js`),
    `${fixture}.input.js`, ...flagify(fixtures[modName])];
  const res = execa.sync(jscodeshiftExecutable, args);
  t.regex(res.stdout, /0 errors/, `Expected no errors for "${modName}" codemod`);
};

test('test each', t => {
  const keys = Object.keys(fixtures);
  t.plan(keys.length);
  keys.forEach(modName => {
    verifyCodemod(t, modName);
  });
});
