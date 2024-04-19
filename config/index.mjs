import { Json } from 'fs-chain';

import * as amap from './amap.mjs';
import * as npm from './npm.mjs';
import * as qq from './qq.mjs';

const { QQ, AMAP } = process.env;

function action({ name, downloader, transfer }, key) {
  if (key) {
    new Json()
      .config({ pretty: true })
      .onDone(() => downloader(key))
      .output(`src/${name}.json`)
      .onDone(transfer)
      .output(`dist/${name}.json`)
      .logger(name)
      .catch(console.error);
  }
}

action(npm, true);
action(qq, QQ);
action(amap, AMAP);
