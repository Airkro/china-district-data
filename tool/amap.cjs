/* eslint-disable import/no-extraneous-dependencies */

const Got = require('got');
const sortBy = require('lodash/sortBy');

const directly = ['110000', '120000', '310000', '500000'];

function filter(data = []) {
  return data.map(({ adcode, districts, name }) => ({
    adcode,
    districts: directly.includes(adcode) ? districts[0].districts : districts,
    name,
  }));
}

function transfer(data) {
  return sortBy(
    data.map(({ adcode, name, districts = [] }) => ({
      code: Number.parseInt(adcode, 10),
      name,
      child: districts.length > 0 ? transfer(districts) : undefined,
    })),
    ({ code, name }) => code + name,
  );
}

module.exports = {
  name: 'amap',
  downloader(key) {
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
  },
  transfer([{ districts }]) {
    return transfer(filter(districts));
  },
};
