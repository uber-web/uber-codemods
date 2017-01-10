import omit from 'just-omit';
const otherOmit = require('just-omit');

const props = omit(
  {
    a: 1,
    b: 2,
    c: 3
  },
  ['a', 'c']
);
