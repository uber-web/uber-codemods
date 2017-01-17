jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;
defineTest(__dirname, 'replace-require', {
  toReplace: 'object.omit',
  replaceWith: 'just-omit'
});
