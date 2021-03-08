/* eslint-disable import/no-extraneous-dependencies */

const Got = require('got');
const sortBy = require('lodash/sortBy');

function sort(data) {
  return sortBy(data, ({ code }) => code);
}

module.exports = {
  name: 'qq',
  downloader(key) {
    return Got.get('https://apis.map.qq.com/ws/district/v1/list', {
      searchParams: { key },
    })
      .json()
      .then(({ result, status, message }) => {
        if (status !== 0) {
          throw new Error(message);
        }
        return result;
      });
  },
  transfer([province, city, region]) {
    const root = sort(
      province.map(({ id, name: label, fullname: name, cidx }) => ({
        code: Number.parseInt(id, 10),
        label,
        name,
        cidx,
      })),
    );

    root.forEach(({ cidx }, index) => {
      if (cidx) {
        delete root[index].cidx;
        const [start, end] = cidx;

        const temp = sort(
          city
            .slice(start, end + 1)
            .map(({ id, name: label, fullname: name, cidx: subCidx }) => ({
              code: Number.parseInt(id, 10),
              label,
              name,
              subCidx,
            })),
        );

        temp.forEach(({ subCidx }, subIndex) => {
          if (subCidx) {
            delete temp[subIndex].subCidx;
            const [start2, end2] = subCidx;

            temp[subIndex].child = sort(
              region
                .slice(start2, end2 + 1)
                .map(({ id, name: label, fullname: name }) => ({
                  code: Number.parseInt(id, 10),
                  label,
                  name,
                })),
            );
          }
        });

        root[index].child = temp;
      }
    });

    return root;
  },
};
