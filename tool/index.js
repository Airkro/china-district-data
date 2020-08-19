/* eslint-disable import/no-extraneous-dependencies */
const { Json } = require('fs-chain');

const { AMAP, QQ } = require('@ladjs/env')();

const qq = require('./qq');
const amap = require('./amap');
const npm = require('./npm');

async function action({ name, downloader, transfer }, key) {
  if (key !== undefined) {
    try {
      const raw = await downloader(key);
      new Json()
        .config({ pretty: true })
        .handle(() => raw)
        .output(`./src/${name}.json`)
        .handle(transfer)
        .output(`./dist/${name}.json`);
    } catch (error) {
      console.error(error);
    }
  }
}

action(npm, false);
action(qq, QQ);
action(amap, AMAP);
