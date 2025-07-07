import { LoginParams, LoginResponse, User } from '@/models/user'

// 模拟API延迟
const API_DELAY = 800

// 模拟登录API
export const loginApi = async (params: LoginParams): Promise<LoginResponse> => {
  await new Promise(resolve => setTimeout(resolve, API_DELAY))

  // 简单验证（实际应用中应调用后端API）
  if (!params.username || !params.password) {
    throw new Error('用户名和密码不能为空')
  }

  // 模拟登录成功
  const user: User = {
    // id: 'USER-' + Date.now(),
    id: Math.round(10),
    username: params.username,
    // phone: params.username.startsWith('1') ? params.username : undefined,
    email: params.username.includes('@') ? params.username : undefined,
    // token: 'MOCK_TOKEN_' + Math.random().toString(36).substr(2),
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTE5ODY4ODgsInVzZXJfaWQiOjcsInVzZXJuYW1lIjoidGVzdF91c2VyMTIzIn0.5uxTavk6i8H36JjFWb1dmUOkqVnD8Kp6qN2ggMWdvDk',
    avatar: 'https://picsum.photos/seed/' + params.username + '/100/100'
    // createdAt: new Date()
  }

  return { user, token: user.token }
}
