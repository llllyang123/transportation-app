import { LoginParams, RegistrationData, User } from '@/models/user'
import client from './client'

// 模拟API延迟
const API_DELAY = 800

// 模拟登录API
export const loginApi = async (params: LoginParams) => {
  // 简单验证（实际应用中应调用后端API）
  if (!params.username || !params.password) {
    throw new Error('用户名和密码不能为空')
  }
  const response = await client.post<{
    message: string
    user: User
    token: string
  }>('/api/users/login', {
    login_id: params.username,
    password: params.password
  })
  // const data = response.data
  const user = response.user
  const token = response.token
  // await new Promise(resolve => setTimeout(resolve, API_DELAY))
  // 模拟登录成功
  // const user: User = {
  //   // id: 'USER-' + Date.now(),
  //   id: Math.round(10),
  //   username: params.username,
  //   // phone: params.username.startsWith('1') ? params.username : undefined,
  //   email: params.username.includes('@') ? params.username : undefined,
  //   // token: 'MOCK_TOKEN_' + Math.random().toString(36).substr(2),
  //   token:
  //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTE5OTYxMjgsInVzZXJfaWQiOjcsInVzZXJuYW1lIjoidGVzdF91c2VyMTIzIn0.mZJnj4h3yju2QVw9fr1Iyn8sVOH2YMEIaaiULptcwKU',
  //   avatar: 'https://picsum.photos/seed/' + params.username + '/100/100'
  //   // createdAt: new Date()
  // }

  return { user, token }
}

export const registerApi = async (params: RegistrationData) => {
  const response = await client.post<User>('/api/users/register', params)
  if (typeof response == 'string') {
    return response
  }
  return response.data
}

export const updateInfoApi = async (params: {
  user_id: number
  gender: string
}) => {
  const response = await client.patch<{
    message: string
    user: User
  }>('/api/users/gender', params)
  return response
}
