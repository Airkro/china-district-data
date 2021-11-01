import { createRequire } from 'module';

import sortBy from 'lodash/sortBy.js';

function sort(data) {
  return sortBy(data, ({ code, name }) => code + name);
}

export function transfer(data) {
  return sort(
    data.map(({ code, name, children = [] }) => ({
      code: Number.parseInt(code, 10),
      name,
      child: children.length > 0 ? transfer(children) : undefined,
    })),
  );
}

export const name = 'npm';

export async function downloader() {
  return createRequire(import.meta.url)('province-city-china/dist/level.json');
}
