import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { register } = useAuth(); // 假设AuthContext提供了register方法
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [ isLoading, setIsLoading ] = useState( false );
  const navigation = useNavigation()

  // 表单验证
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // 验证用户名
    if (!formData.username.trim()) {
      newErrors.username = t('validation.required');
      isValid = false;
    }

    // 验证邮箱
    if (!formData.email.trim()) {
      newErrors.email = t('validation.required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
      isValid = false;
    }

    // 验证密码
    if (!formData.password) {
      newErrors.password = t('validation.required');
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = t('validation.passwordLength');
      isValid = false;
    }

    // 验证确认密码
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('validation.passwordMismatch');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 处理注册
  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // 调用AuthContext中的注册方法
      await register(formData.username, formData.email, formData.password);
      
      // 注册成功后导航到登录页或主页
      Alert.alert(t('register.success'), t('register.successMessage'), [
        {
          text: 'OK',
          // onPress: () => {router.replace('/(tabs)/explore')}
          onPress: ()=>{router.replace('/auth/LoginScreen')}
        },
      ]);
    } catch (error) {
      // 处理注册失败
      console.error('Registration error:', error);
      Alert.alert(t('register.error'), error.message || t('register.errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  // 计算密码强度
  const getPasswordStrength = () => {
    if (formData.password.length < 6) return 'weak';
    if (/[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password) && /[^A-Za-z0-9]/.test(formData.password)) {
      return 'strong';
    }
    return 'medium';
  };

  // 渲染密码强度指示器
  const renderPasswordStrength = () => {
    const strength = getPasswordStrength();
    let color, label;

    switch (strength) {
      case 'weak':
        color = '#FF3B30';
        label = t('passwordStrength.weak');
        break;
      case 'medium':
        color = '#FF9500';
        label = t('passwordStrength.medium');
        break;
      case 'strong':
        color = '#4CD964';
        label = t('passwordStrength.strong');
        break;
    }

    return (
      <View style={styles.strengthContainer}>
        <View style={[styles.strengthBar, { backgroundColor: color, width: `${strength === 'weak' ? 33 : strength === 'medium' ? 66 : 100}%` }]} />
        <Text style={[styles.strengthText, { color }]}>{label}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{t('register.title')}</Text>
          <Text style={styles.subheaderText}>{t('register.subtitle')}</Text>
        </View>

        <View style={styles.formContainer}>
          {/* 用户名输入 */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={24} color="#999" style={styles.inputIcon} />
            <TextInput
              placeholder={t('register.username')}
              placeholderTextColor="#999"
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
              style={styles.input}
              autoCapitalize="none"
            />
          </View>
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

          {/* 邮箱输入 */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={24} color="#999" style={styles.inputIcon} />
            <TextInput
              placeholder={t('register.email')}
              placeholderTextColor="#999"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* 密码输入 */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#999" style={styles.inputIcon} />
            <TextInput
              placeholder={t('register.password')}
              placeholderTextColor="#999"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              style={styles.input}
              secureTextEntry
            />
          </View>
          {formData.password && renderPasswordStrength()}
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* 确认密码输入 */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#999" style={styles.inputIcon} />
            <TextInput
              placeholder={t('register.confirmPassword')}
              placeholderTextColor="#999"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              style={styles.input}
              secureTextEntry
            />
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          {/* 注册按钮 */}
          <Button
            title={t('register.button')}
            onPress={handleRegister}
            color="#2196F3"
            disabled={isLoading}
          />

          {/* 已有账号？登录 */}
          <TouchableOpacity onPress={() => router.replace('/auth/LoginScreen')} style={styles.loginLinkContainer}>
            <Text style={styles.loginLinkText}>
              {t('register.alreadyHaveAccount')} <Text style={styles.loginLinkHighlight}>{t('register.login')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  headerContainer: {
    marginBottom: 32,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subheaderText: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginBottom: 8,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  strengthText: {
    fontSize: 12,
  },
  loginLinkContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: '#666',
  },
  loginLinkHighlight: {
    color: '#2196F3',
    fontWeight: '500',
  },
});