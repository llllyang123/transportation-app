// utils/authStorage.ts
import { User } from '@/models/user'
import AsyncStorage from '@react-native-async-storage/async-storage'

const USER_KEY = 'auth_user'

// 保存用户信息到存储
export const saveAuth = async (user: User) => {
  try {
    const userJson = JSON.stringify(user)
    await AsyncStorage.setItem(USER_KEY, userJson)
  } catch (error) {
    console.error('保存用户信息失败:', error)
    throw error
  }
}

// 从存储获取用户信息
export const getAuth = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY)
    if (!userJson) return null

    // 解析 JSON 并确保返回正确的 User 类型
    const user = JSON.parse(userJson) as User
    return user
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

// 清除用户信息
export const clearAuth = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY)
  } catch (error) {
    console.error('清除用户信息失败:', error)
    throw error
  }
}
