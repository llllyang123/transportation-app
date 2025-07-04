import BirthdayPicker from '@/components/BirthdayPicker';
import DateTimePickerNative from '@react-native-community/datetimepicker';
import { useNavigation, useRouter } from 'expo-router';
import { t } from 'i18next';
import React, { useState } from 'react';
import DatePickerWeb from 'react-datepicker';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// 个人信息类型
type UserInfo = {
  username: string;
  phone: string;
  email: string;
  gender: any;
  birthday: string;
};

const initialUserInfo: UserInfo = {
  username: `${t('userName')}`,
  phone: '13800138000',
  email: 'example@example.com',
  gender: `${t('male')}`,
  birthday: '1990-01-01',
};

export default function ProfileInfo() {
  const router = useRouter();
  const [userInfo, setUserInfo] = React.useState(initialUserInfo);
  const DateTimePicker = Platform.OS === 'web' ? DatePickerWeb : DateTimePickerNative;

  const handleSave = () => {
    // 这里可添加保存逻辑（如调用接口）
    router.goBack(); // 保存后返回上一页
  };
  const navigation = useNavigation();
  // 生日状态，初始可设为当前日期或从存储读取
  const [birthDate, setBirthDate] = useState(new Date()); 
  // 控制日期选择器显示隐藏
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); 

  // 显示日期选择器
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // 处理日期确认选择
  const handleConfirm = (date: Date) => {
    setDatePickerVisibility(false);
    setBirthDate(date);
    // 这里可添加逻辑，比如调用接口保存生日到服务端
    console.log("选择的生日：", date.toLocaleDateString());
  };

  // 隐藏日期选择器
  const handleCancel = () => {
    setDatePickerVisibility(false);
  };

  const [selectedValue, setSelectedValue] = useState();
  const [ showPicker, setShowPicker ] = useState( false );
  
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);

  const handleBirthdayChange = (date: Date) => {
    setBirthDate(date);
    setShowBirthdayPicker(false);
  };

  // 替代 setTimeout 手动触发
  const openPicker = () => setShowPicker(true);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        <Text style={styles.label}>{t('avatar')}</Text>
        <Image
          source={{ uri: 'https://picsum.photos/100/100' }}
          style={styles.avatar}
          contentFit="cover"
          alt="用户头像"
        />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.formItem}>
          <Text style={ styles.label }>{ t('userInfo')}</Text>
          <TextInput
            style={styles.input}
            value={userInfo.username}
            onChangeText={(text) => 
              setUserInfo({ ...userInfo, username: text })
            }
          />
        </View>

        <View style={styles.formItem}>
          <Text style={ styles.label }>{ t('phone')}</Text>
          <TextInput
            style={styles.input}
            value={userInfo.phone}
            onChangeText={(text) => 
              setUserInfo({ ...userInfo, phone: text })
            }
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formItem}>
          <Text style={ styles.label }>{ t('email')}</Text>
          <TextInput
            style={styles.input}
            value={userInfo.email}
            onChangeText={(text) => 
              setUserInfo({ ...userInfo, email: text })
            }
            keyboardType="email-address"
          />
        </View>

        <View style={styles.formItem}>
          <Text style={styles.label}>{t('six')}</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderOption, userInfo.gender === t('man') && styles.genderOptionSelected]}
              onPress={() => 
                setUserInfo({ ...userInfo, gender: t('man') })
              }
            >
              <Text style={[styles.genderText, userInfo.gender === t('man') && styles.genderTextSelected]}>{t('man')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderOption, userInfo.gender === t('women') && styles.genderOptionSelected]}
              onPress={() => 
                setUserInfo({ ...userInfo, gender: t('women') })
              }
            >
              <Text style={[styles.genderText, userInfo.gender === t('women') && styles.genderTextSelected]}>{t('women')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.formItem}>
        <Text style={styles.label}>{t("birthday")}</Text>
        <Text style={styles.value} onPress={() => setShowBirthdayPicker(true)}>
          {birthDate.toLocaleDateString()}
        </Text>
      </View>

      {/* 生日选择器（条件渲染） */}
      {showBirthdayPicker && (
        <BirthdayPicker
          initialDate={birthDate}
          onDateChange={handleBirthdayChange}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{t('saveAndBack')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  label: { width: 80, fontSize: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginLeft: 20 },
  formContainer: { backgroundColor: 'white', marginBottom: 20 },
  formItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: { flex: 1, fontSize: 16, marginLeft: 20 },
  genderContainer: { flexDirection: 'row', marginLeft: 20 },
  genderOption: {
    padding: 10,
    marginRight: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  genderOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E6F2FF',
  },
  genderTextSelected: { color: '#007AFF' },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 15,
    margin: 20,
    alignItems: 'center',
  },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  value: {
    fontSize: 16,
    color: "#666",
  },
});