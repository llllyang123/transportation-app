import dataJson from '@/assets/data/city.json'

export interface Country {
  country_name: string
  country_short_name: string
  capital: string
  continent: string
  iso_code: string
}

// 示例数据（实际项目中可从API或本地JSON加载）
export const sampleCountries: Country[] = dataJson
