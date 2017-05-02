import test from 'ava';
import execa from 'execa';

import tempDirCp from 'temp-dir-cp';
import path from 'path';

const jscodeshiftExecutable = path.resolve('node_modules/.bin/jscodeshift');
const baseDir = path.join(__dirname, '..');
const fixturePath = path.join(baseDir, '__testfixtures__');

const fixtures = {
    'r-dom-to-react-create-element': {},
    'replace-require': {
      toReplace: 'object.omit',
      replaceWith: 'just-omit'
    },
    'xtend-to-spread': {}
};

test('title', async t => {
  const tempDir = tempDirCp(fixturePath);
  // const fixture = path.join(tempDir, 'r-dom-to-react-create-element');
  // console.log('tempDir: ', tempDir);
  const fixtureName = 'replace-require';
  const fixture = path.join(tempDir, fixtureName);
  const codeModPath = path.join(baseDir, fixture)
  const args = [`${fixture}.input.js`, '-t', path.join(baseDir, `${fixtureName}.js`)];
  args.push('--toReplace', toReplace);
  args.push('--replaceWith', replaceWith);

  const res = execa(jscodeshiftExecutable, args);
  // const res = execa(jscodeshiftExecutable, [`${fixture}.input.js`, '-t', path.join(baseDir, `${fixtureName}.js`)]);
  const {stdout} = await res;
  t.regex(stdout, /0 errors/);
});
