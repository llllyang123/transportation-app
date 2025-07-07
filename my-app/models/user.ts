export interface User {
  id: number
  username: string
  // phone?: string
  email?: string
  token?: string
  avatar?: string
  // createdAt: Date
}

export interface LoginParams {
  username: string // 可以是用户名、手机号或邮箱
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

// 注册表单数据类型
export interface RegistrationData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// 登录表单数据类型
export interface LoginData {
  email: string
  password: string
}
