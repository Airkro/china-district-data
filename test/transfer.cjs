'use strict';

const test = require('ava');

function findText(object, pattern) {
  return JSON.stringify(object).matchAll(pattern).length;
}

test('qq', (t) => {
  t.is(
    findText(require('../src/qq.json'), /"id:"/g),
    findText(require('../dist/qq.json'), /"code:"/g),
  );
});

test('amap', (t) => {
  t.is(
    findText(require('../src/amap.json'), /"adcode:"/g),
    findText(require('../dist/amap.json'), /"code:"/g),
  );
});

test('npm', (t) => {
  t.is(
    findText(require('../src/npm.json'), /"code:"/g),
    findText(require('../dist/npm.json'), /"code:"/g),
  );
});
