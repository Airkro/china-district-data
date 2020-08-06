/* eslint-disable global-require */
const test = require('ava');

test('qq', (t) => {
  t.is(
    JSON.stringify(require('../src/qq.json')).matchAll(/"id:"/g).length,
    JSON.stringify(require('../dist/qq.json')).matchAll(/"code:"/g).length,
  );
});

test('amap', (t) => {
  t.is(
    JSON.stringify(require('../src/amap.json')).matchAll(/"adcode:"/g).length,
    JSON.stringify(require('../dist/amap.json')).matchAll(/"code:"/g).length,
  );
});

test('npm', (t) => {
  t.is(
    JSON.stringify(require('../src/npm.json')).matchAll(/"code:"/g).length,
    JSON.stringify(require('../dist/npm.json')).matchAll(/"code:"/g).length,
  );
});
