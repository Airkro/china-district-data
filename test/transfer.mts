import test from 'ava';
import qqData from '../src/qq.json' with { type: 'json' };
import qqDist from '../dist/qq.json' with { type: 'json' };
import amapData from '../src/amap.json' with { type: 'json' };
import amapDist from '../dist/amap.json' with { type: 'json' };

function findText(object: unknown, pattern: RegExp): number {
  return [...JSON.stringify(object).matchAll(pattern)]?.length || 0;
}

test('qq', (t) => {
  t.is(findText(qqData, /"id:"/g), findText(qqDist, /"code:"/g));
});

test('amap', (t) => {
  t.is(findText(amapData, /"adcode:"/g), findText(amapDist, /"code:"/g));
});
