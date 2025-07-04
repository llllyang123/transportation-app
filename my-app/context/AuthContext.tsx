import { loginApi } from '@/api/auth';
import { User } from '@/models/user';
import { clearAuth, getAuth, saveAuth } from '@/utils/authStorage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: ( username: string, password: string ) => Promise<void>;
  register: () => Promise<void>,
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ isAuthenticated, setIsAuthenticated ] = useState( false );
  
  // 初始化时从缓存加载用户
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await getAuth();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
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
      
      // 保存用户信息到状态和缓存
      setUser(response.user);
      await saveAuth(response.user);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    // 实际项目中应调用注册API
    try {
      // 模拟注册成功
      // 在实际应用中，这里应该发送请求到后端API
      console.log('Registering user:', { username, email });
      const id = 1;
      const token = "asdfa"
      // 注册成功后自动登录
      await saveAuth({ id,username, token });
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error(error.message || 'Registration failed');
    }
  };

  // 登出方法
  const logout = async () => {
    setUser(null);
    await clearAuth();
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        isAuthenticated: !!user,
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