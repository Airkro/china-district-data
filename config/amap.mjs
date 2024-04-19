import sortBy from 'lodash/sortBy.js';

import { fetcher } from './lib.mjs';

function transferData(data) {
  return sortBy(
    data.map(({ adcode, name, districts = [] }) => ({
      code: Number.parseInt(adcode, 10),
      name,
      child: districts.length > 0 ? transferData(districts) : undefined,
    })),
    ({ code, name }) => code + name,
  );
}

export function transfer([{ districts }]) {
  return transferData(districts);
}

export const name = 'amap';

export function downloader(key) {
  return fetcher('https://restapi.amap.com/v3/config/district', {
    searchParams: { key, subdistrict: 3 },
  }).then(({ districts, status, info }) => {
    if (status !== '1') {
      throw new Error(info);
    }

    return districts;
  });
}
