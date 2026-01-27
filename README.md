# china-district-data

中华人民共和国行政区划编码数据

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]

## 数据源

- [腾讯地图开放 API](https://lbs.qq.com/service/webService/webServiceGuide/webServiceDistrict)
- [高德开放平台 API](https://lbs.amap.com/api/webservice/guide/api/district/)

## 数据集

- [腾讯地图开放 API](./dist/qq.json)
- [高德开放平台 API](./dist/amap.json)

## Installation

```sh
npm install china-district-data
```

## Usage

```mjs
import qq from 'china-district-data/dist/qq.json' with { type: 'json' };
import amap from 'china-district-data/dist/amap.json' with { type: 'json' };
```

## Generate

Run on node.js 22.16.0+

```bash
git clone https://github.com/airkro/china-district-data.git

cd china-district-data

pnpm install

echo 'QQ = 腾讯地图KEY' 'AMAP = 高德地图KEY' > .env

pnpm run generate
```

[npm-url]: https://www.npmjs.com/package/china-district-data
[npm-badge]: https://img.shields.io/npm/v/china-district-data.svg?style=flat-square&logo=npm
[github-url]: https://github.com/airkro/china-district-data
[github-badge]: https://img.shields.io/npm/l/china-district-data.svg?style=flat-square&logo=github
