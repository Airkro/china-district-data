/* eslint-disable import/no-extraneous-dependencies */

const Got = require('got');
const sortBy = require('lodash/sortBy');

function test(data) {
  return sortBy(
    data.map(({ adcode, name, districts = [] }) => ({
      code: Number.parseInt(adcode, 10),
      name,
      child: districts.length > 0 ? test(districts) : undefined,
    })),
    ({ code }) => code,
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
    return test(districts);
  },
};