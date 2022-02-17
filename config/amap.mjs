import sortBy from 'lodash/sortBy.js';

import { fetch } from './lib.mjs';

const directly = ['110000', '120000', '310000', '500000'];

function filter(data = []) {
  return data.map(({ adcode, districts, name }) => ({
    adcode,
    districts: directly.includes(adcode) ? districts[0].districts : districts,
    name,
  }));
}

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
  return transferData(filter(districts));
}

export const name = 'amap';

export function downloader(key) {
  return fetch({
    hostname: 'restapi.amap.com',
    pathname: 'v3/config/district',
    searchParams: { key, subdistrict: 3 },
  }).then(({ districts, status, info }) => {
    if (status !== '1') {
      throw new Error(info);
    }

    return districts;
  });
}
