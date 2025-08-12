// env.ts
type Env = {
  API_URL: string
}

// 手动定义环境变量
const env: Env = {
  API_URL: 'http://192.168.31.62:8080' // 默认值
  // API_URL: 'http://172.16.0.119:8080' // 演示ip
}

// 根据环境覆盖默认值
if (process.env.NODE_ENV === 'development') {
  env.API_URL = 'http://192.168.31.62:8080'
  // env.API_URL = 'http://172.16.0.119:8080'
} else if (process.env.NODE_ENV === 'production') {
  env.API_URL = 'http://192.168.31.62:8080'
  // env.API_URL = 'http://172.16.0.119:8080'
}

export default env
