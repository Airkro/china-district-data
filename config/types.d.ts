// 基础区域数据项接口
interface BaseDistrictItem {
  code: number
  name: string
  label?: string
}

// 区域数据项接口（可能包含子区域）
interface DistrictItem extends BaseDistrictItem {
  child?: DistrictItem[]
}

// 省份接口 - 复用 DistrictItem，但添加更具体的类型说明
interface ProvinceItem extends DistrictItem {
  child?: CityItem[]
}

// 城市接口 - 复用 DistrictItem，但添加更具体的类型说明
interface CityItem extends DistrictItem {
  child?: RegionItem[]
}

// 区域接口 - 直接使用 DistrictItem
type RegionItem = DistrictItem

// 模块 API 接口
interface ModuleAPI<RawData> {
  name: string
  downloader: (key?: string) => Promise<RawData>
  transfer: (data: RawData) => DistrictItem[]
}

// QQ 地图命名空间
namespace QQMap {
  export interface Province {
    id: string
    name: string
    fullname: string
    cidx?: [number, number]
  }

  export interface City {
    id: string
    name: string
    fullname: string
    cidx?: [number, number]
  }

  export interface Region {
    id: string
    name: string
    fullname: string
  }

  export interface Response {
    result: [Province[], City[], Region[]]
    status: number
    message: string
  }

  export type RawData = [Province[], City[], Region[]]
}

// 高德地图命名空间
namespace AMap {
  export interface District {
    adcode: string
    name: string
    districts?: District[]
  }

  export interface Response {
    districts: District[]
    status: string
    info: string
  }

  export type RawData = District[]
}

// 导出所有接口和命名空间
export type {
  AMap,
  BaseDistrictItem,
  CityItem,
  DistrictItem,
  ModuleAPI,
  ProvinceItem,
  QQMap,
  RegionItem,
}
