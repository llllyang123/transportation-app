import { useAuth } from '@/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import
  {
    Alert,
    Button,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
  } from 'react-native';

const LoginScreen = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [ error, setError ] = useState( '' );
  const navigation = useNavigation()

  // 验证用户名格式
  const validateUsername = (value: string) => {
    // 检查是否为手机号
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (phoneRegex.test(value)) {
      return 'phone';
    }
    
    // 检查是否为邮箱
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      return 'email';
    }
    
    // 默认为用户名
    return 'username';
  };

  // 处理登录
  const handleLogin = async () => {
    if (!username || !password) {
      setError(t('login.formIncomplete'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 调用登录方法
      await login(username, password);
      // 登录成功后返回上一页或主页
      router.replace('/(tabs)/explore')
      // if ( navigation.canGoBack() )
      // {
      //   // navigation.goBack();
      //   router.replace('/(tabs)/explore')
      //   // navigation.reset('profile/index')
      // } else {
      //   navigation.navigate('index');
      // }
    } catch (error: any) {
      setError(error.message || t('login.failed'));
      Alert.alert(t('common.error'), error.message || t('login.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <FontAwesome name="truck" size={80} color="#2196F3" />
          <Text style={styles.appName}>{t('appName')}</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>{t('login.title')}</Text>
          
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
          
          <View style={styles.inputContainer}>
            <FontAwesome 
              name={validateUsername(username) === 'phone' ? 'phone' : 
                    validateUsername(username) === 'email' ? 'envelope' : 'user'} 
              size={20} 
              color="#888" 
              style={styles.inputIcon} 
            />
            <TextInput
              style={styles.input}
              placeholder={t('login.usernamePlaceholder')}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('login.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <Button
            title={loading ? t('common.loading') : t('login.button')}
            onPress={handleLogin}
            disabled={loading}
            color="#2196F3"
          />
          
          {/* <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>{t('login.forgotPassword')}</Text>
          </TouchableOpacity> */}
          
          <View style={styles.divider}>
            <Text style={styles.dividerText}>{t('login.or')}</Text>
          </View>
          
          <TouchableOpacity style={ styles.registerButton }
          onPress={() => navigation.navigate('auth/RegisterScreen')}>
            <Text style={styles.registerButtonText}>{t('login.register')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    color: '#F44336',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
    paddingBottom: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginVertical: 15,
  },
  forgotPasswordText: {
    color: '#2196F3',
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerText: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    color: '#999',
  },
  registerButton: {
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 5,
  },
  registerButtonText: {
    color: '#2196F3',
    fontWeight: '500',
  },
});

export default LoginScreen;