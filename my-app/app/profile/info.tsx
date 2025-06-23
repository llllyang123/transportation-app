import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// 个人信息类型
type UserInfo = {
  username: string;
  phone: string;
  email: string;
  gender: '男' | '女';
  birthday: string;
};

const initialUserInfo: UserInfo = {
  username: '用户名',
  phone: '13800138000',
  email: 'example@example.com',
  gender: '男',
  birthday: '1990-01-01',
};

export default function ProfileInfo() {
  const router = useRouter();
  const [userInfo, setUserInfo] = React.useState(initialUserInfo);

  const handleSave = () => {
    // 这里可添加保存逻辑（如调用接口）
    router.goBack(); // 保存后返回上一页
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        <Text style={styles.label}>头像</Text>
        <Image
          source={{ uri: 'https://picsum.photos/100/100' }}
          style={styles.avatar}
          resizeMode="cover"
          alt="用户头像"
        />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.formItem}>
          <Text style={styles.label}>用户名</Text>
          <TextInput
            style={styles.input}
            value={userInfo.username}
            onChangeText={(text) => 
              setUserInfo({ ...userInfo, username: text })
            }
          />
        </View>

        <View style={styles.formItem}>
          <Text style={styles.label}>手机号</Text>
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
          <Text style={styles.label}>邮箱</Text>
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
          <Text style={styles.label}>性别</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderOption, userInfo.gender === '男' && styles.genderOptionSelected]}
              onPress={() => 
                setUserInfo({ ...userInfo, gender: '男' })
              }
            >
              <Text style={[styles.genderText, userInfo.gender === '男' && styles.genderTextSelected]}>男</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderOption, userInfo.gender === '女' && styles.genderOptionSelected]}
              onPress={() => 
                setUserInfo({ ...userInfo, gender: '女' })
              }
            >
              <Text style={[styles.genderText, userInfo.gender === '女' && styles.genderTextSelected]}>女</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formItem}>
          <Text style={styles.label}>生日</Text>
          <TextInput
            style={styles.input}
            value={userInfo.birthday}
            onChangeText={(text) => 
              setUserInfo({ ...userInfo, birthday: text })
            }
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>保存</Text>
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
});