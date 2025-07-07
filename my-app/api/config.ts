import env from '@/env' // 从 @env 导入环境变量

export const API_CONFIG = {
  baseUrl: env.API_URL,
  timeout: 10000
}
