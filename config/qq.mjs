import Got from 'got';
import sortBy from 'lodash/sortBy.js';

function sort(data) {
  return sortBy(data, ({ code, name }) => code + name);
}

export function downloader(key) {
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
}

export function transfer([province, city, region], withLabel = true) {
  const root = sort(
    province.map(({ id, name: label, fullname: name, cidx }) => ({
      code: Number.parseInt(id, 10),
      label: withLabel ? label : undefined,
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
            label: withLabel ? label : undefined,
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
                label: withLabel ? label : undefined,
                name,
              })),
          );
        }
      });

      root[index].child = temp;
    }
  });

  return root;
}

export const name = 'qq';
