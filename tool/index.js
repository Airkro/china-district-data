/* eslint-disable import/no-extraneous-dependencies */
const { Json } = require('fs-chain');

const qq = require('./qq');
const amap = require('./amap');
const npm = require('./npm');

async function action({ name, downloader, transfer }) {
  try {
    const raw = await downloader();
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

action(npm);
action(qq);
action(amap);
