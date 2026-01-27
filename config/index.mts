import { Chain } from 'fs-chain';

import { amap } from './amap.mts';
import { qq } from './qq.mts';
import type { ModuleAPI } from './types.d.ts';

const { QQ, AMAP } = process.env;

// 处理数据源
const processData = async <RawData,>(
  { name, downloader, transfer }: ModuleAPI<RawData>,
  key?: string,
): Promise<void> => {
  if (!key) {
    return;
  }

  try {
    const rawData = await downloader(key);
    const processedData = transfer(rawData);

    await new Promise<void>((resolve, reject) => {
      new Chain()
        .config({ pretty: true })
        .modify(() => rawData)
        .encode()
        .output(`src/${name}.json`)
        .modify(() => processedData)
        .encode()
        .output(`dist/${name}.json`)
        .logger(name)
        .then(() => resolve())
        .catch(reject);
    });
  } catch (error) {
    console.error(`处理 ${name} 数据时出错:`, error);
    throw error;
  }
};

// 执行数据处理
const runProcess = async (): Promise<void> => {
  if (QQ) {
    await processData(qq, QQ);
  }

  if (AMAP) {
    await processData(amap, AMAP);
  }
};

runProcess();
