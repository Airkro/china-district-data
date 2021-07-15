import Got from 'got';
import sortBy from 'lodash/sortBy.js';

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
  return Got.get('https://restapi.amap.com/v3/config/district', {
    adcode: '100000',
    searchParams: { key, subdistrict: 3 },
  })
    .json()
    .then(({ districts, status, info }) => {
      if (status !== '1') {
        throw new Error(info);
      }
      return districts;
    });
}
