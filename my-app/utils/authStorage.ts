import { User } from '@/models/user'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AUTH_STORAGE_KEY = 'auth_user'

// 保存用户信息到缓存
export const saveAuth = async (user: User) => {
  try {
    const userJson = JSON.stringify(user)
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, userJson)
  } catch (error) {
    console.error('Failed to save auth:', error)
    throw error
  }
}

// 从缓存获取用户信息
export const getAuth = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(AUTH_STORAGE_KEY)
    if (!userJson) return null

    const user: User = JSON.parse(userJson)
    return user
  } catch (error) {
    console.error('Failed to get auth:', error)
    return null
  }
}

// 清除用户信息
export const clearAuth = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear auth:', error)
    throw error
  }
}
