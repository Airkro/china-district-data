import { fetcher } from './lib.mts';
import type { DistrictItem, AMap, ModuleAPI } from './types.d.ts';

type District = AMap.District;
type AmapResponse = AMap.Response;
type AmapRawData = AMap.RawData;

// 转换单个区域数据
const transformDistrict = (
  { adcode, name, districts = [] }: District,
  transferFn: (data: District[]) => DistrictItem[],
): DistrictItem => ({
  code: Number.parseInt(adcode, 10),
  name,
  label: name,
  child: districts.length > 0 ? transferFn(districts) : undefined,
});

// 递归转换区域数据
const transferData = (data: District[]): DistrictItem[] => {
  const transform = (item: District) => transformDistrict(item, transferData);

  return data
    .map((item) => transform(item))
    .toSorted((a, b) => (a.code + a.name).localeCompare(b.code + b.name));
};

// 高德地图模块，符合 ModuleAPI 接口
export const amap: ModuleAPI<AmapRawData> = {
  name: 'amap',
  downloader: async (key?: string | boolean): Promise<AmapRawData> => {
    if (!key || typeof key === 'boolean') {
      throw new Error('高德地图需要有效的API key');
    }

    const response = await fetcher<AmapResponse>(
      'https://restapi.amap.com/v3/config/district',
      {
        searchParams: { key, subdistrict: 3 },
      },
    );

    const { districts, status, info } = response;

    if (status !== '1') {
      throw new Error(info);
    }

    return districts[0]?.districts || districts;
  },
  transfer: (data: AmapRawData): DistrictItem[] => {
    return transferData(data);
  },
};
