/* eslint-disable import/no-extraneous-dependencies */
const { Json } = require('fs-chain');

const { AMAP, QQ } = require('@ladjs/env')();

const qq = require('./qq.cjs');
const amap = require('./amap.cjs');
const npm = require('./npm.cjs');

function action({ name, downloader, transfer }, key) {
  if (key !== undefined) {
    new Json()
      .config({ pretty: true })
      .handle(() => downloader(key))
      .output(`~src/${name}.json`)
      .handle(transfer)
      .output(`~dist/${name}.json`)
      .logger(name);
  }
}

action(npm, false);
action(qq, QQ);
action(amap, AMAP);
