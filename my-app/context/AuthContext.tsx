// context/AuthContext.ts
import { loginApi } from '@/api/auth';
import { User } from '@/models/user';
import { clearAuth, getAuth, saveAuth } from '@/utils/authStorage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化时从缓存加载用户
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await getAuth();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('从存储加载用户失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 登录方法
  const login = async (username: string, password: string) => {
    try {
      // 调用登录API
      const response = await loginApi({ username, password });
      
      if (!response.user || !response.user.token) {
        throw new Error('登录失败: 未收到有效的用户信息');
      }
      
      // 保存用户信息到状态和缓存
      setUser(response.user);
      await saveAuth(response.user);
      
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  };

  // 注册方法
  const register = async (username: string, email: string, password: string) => {
    try {
      // 实际项目中应调用注册API
      console.log('注册用户:', { username, email });
      
      // 模拟注册成功并返回用户信息
      const newUser: User = {
        id: Date.now(), // 模拟用户ID
        username,
        email,
        token: "mock-token-" + Math.random().toString(36).substring(7), // 模拟token
        // 其他用户字段
      };
      
      // 保存用户信息
      setUser(newUser);
      await saveAuth(newUser);
      
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  };

  // 登出方法
  const logout = async () => {
    try {
      setUser(null);
      await clearAuth();
    } catch (error) {
      console.error('登出失败:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        isAuthenticated: !!user && !!user.token, // 确保用户和token都存在
        loading,
        login,
        register,
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};