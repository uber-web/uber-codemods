const testObj = {a: 2, b: 3};
const testBool = false;

const spreadTest = {
  // test basic object
  a: 1,

  b: 2,

  // test logical expression
  ...(testBool && testObj)
};
