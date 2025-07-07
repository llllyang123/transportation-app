// api/client.ts
import axios from 'axios'
import { clearAuth, getAuth } from '../utils/authStorage'
import { API_CONFIG } from './config'

export interface ApiError {
  status?: number
  message: string
}

const client = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
client.interceptors.request.use(
  async config => {
    try {
      const storedUser = await getAuth()
      if (storedUser && storedUser.token) {
        config.headers.Authorization = `Bearer ${storedUser.token}`
      }
      return config
    } catch (error) {
      console.error('获取 token 失败:', error)
      return config
    }
  },
  error => {
    return Promise.reject({
      message: '请求配置错误: ' + error.message
    } as ApiError)
  }
)

// 响应拦截器
client.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API请求错误:', error)

    if (error.response) {
      if (error.response.status === 401) {
        // token 可能过期，清除本地存储
        getAuth().then(user => {
          if (user) clearAuth()
        })
      }

      return Promise.reject({
        status: error.response.status,
        message: error.response.data.message || '服务器错误'
      } as ApiError)
    } else if (error.request) {
      return Promise.reject({
        message: '网络连接失败，请检查网络设置'
      } as ApiError)
    } else {
      return Promise.reject({
        message: '请求配置错误: ' + error.message
      } as ApiError)
    }
  }
)

export default client
