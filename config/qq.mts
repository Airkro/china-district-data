import { fetcher } from './lib.mts';
import type {
  ProvinceItem,
  CityItem,
  RegionItem,
  DistrictItem,
  QQMap,
  ModuleAPI,
} from './types.d.ts';

type Province = QQMap.Province;
type City = QQMap.City;
type Region = QQMap.Region;
type QQResponse = QQMap.Response;
type QQRawData = QQMap.RawData;

// 通用排序函数
const sortItems = <T extends DistrictItem>(data: T[]): T[] =>
  data.toSorted((a, b) => (a.code + a.name).localeCompare(b.code + b.name));

// 创建基础区域项
const createBaseItem = (id: string, label: string, fullname: string) => ({
  code: Number.parseInt(id, 10),
  label,
  name: fullname,
});

// 创建区域项
const createRegion = ({ id, name: label, fullname }: Region): RegionItem =>
  createBaseItem(id, label, fullname);

// 创建城市项
const createCity = ({
  id,
  name: label,
  fullname,
  cidx: subCidx,
}: City): CityItem & { subCidx?: [number, number] } => ({
  ...createBaseItem(id, label, fullname),
  subCidx,
});

// 创建省份项
const createProvince = ({
  id,
  name: label,
  fullname,
  cidx,
}: Province): ProvinceItem & { cidx?: [number, number] } => ({
  ...createBaseItem(id, label, fullname),
  cidx,
});

// 处理子区域
const processSubRegions = (
  cityItems: (CityItem & { subCidx?: [number, number] })[],
  regions: Region[],
): CityItem[] => {
  return cityItems.map(({ subCidx, ...cityItem }) => {
    if (!subCidx) {
      return cityItem;
    }

    const [start, end] = subCidx;

    return {
      ...cityItem,
      child: sortItems(
        regions.slice(start, end + 1).map((region) => createRegion(region)),
      ),
    } as CityItem;
  });
};

// 处理省份及其下级区域
const processProvinces = (
  provinces: Province[],
  cities: City[],
  regions: Region[],
): ProvinceItem[] => {
  return sortItems(provinces.map((province) => createProvince(province))).map(
    ({ cidx, ...provinceItem }) => {
      if (!cidx) {
        return provinceItem;
      }

      const [start, end] = cidx;

      return {
        ...provinceItem,
        child: processSubRegions(
          sortItems(
            cities.slice(start, end + 1).map((city) => createCity(city)),
          ),
          regions,
        ),
      } as ProvinceItem;
    },
  );
};

// QQ 地图模块，符合 ModuleAPI 接口
export const qq: ModuleAPI<QQRawData> = {
  name: 'qq',
  downloader: async (key?: string | boolean): Promise<QQRawData> => {
    if (!key || typeof key === 'boolean') {
      throw new Error('QQ地图需要有效的API key');
    }

    const response = await fetcher<QQResponse>(
      'https://apis.map.qq.com/ws/district/v1/list',
      {
        searchParams: { key },
      },
    );

    const { result, status, message } = response;

    if (status !== 0) {
      throw new Error(message);
    }

    return result;
  },
  transfer: (data: QQRawData): DistrictItem[] => {
    const [provinces, cities, regions] = data;

    return processProvinces(provinces, cities, regions);
  },
};
