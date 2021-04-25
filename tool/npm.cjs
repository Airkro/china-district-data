// eslint-disable-next-line import/no-extraneous-dependencies
const sortBy = require('lodash/sortBy');
// eslint-disable-next-line import/no-extraneous-dependencies
const raw = require('province-city-china/dist/level.json');

function sort(data) {
  return sortBy(data, ({ code, name }) => code + name);
}

function transfer(data) {
  return sort(
    data.map(({ code, name, children = [] }) => ({
      code: Number.parseInt(code, 10),
      name,
      child: children.length > 0 ? transfer(children) : undefined,
    })),
  );
}

module.exports = {
  name: 'npm',
  downloader() {
    return Promise.resolve(raw);
  },
  transfer,
};
