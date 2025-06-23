import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

type PublishForm = {
  origin: string;
  destination: string;
  location: string;
  type: string;
  remark: string;
  contact: string;
  email: string;
};

const initialValues: PublishForm = {
  origin: '',
  destination: '',
  location: '',
  type: '普通货物',
  remark: '',
  contact: '',
  email: '',
};

export default function Publish() {
  const router = useRouter();

  const handleSubmit = (values: PublishForm) => {
    alert('发布成功！');
    router.push('/'); // 返回首页
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>发布货物信息</Text>

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleSubmit, values }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="始发地"
              onChangeText={handleChange('origin')}
              value={values.origin}
            />

            <TextInput
              style={styles.input}
              placeholder="目的地"
              onChangeText={handleChange('destination')}
              value={values.destination}
            />

            <TextInput
              style={styles.input}
              placeholder="具体位置"
              onChangeText={handleChange('location')}
              value={values.location}
            />

            <TextInput
              style={styles.input}
              placeholder="货物类型"
              onChangeText={handleChange('type')}
              value={values.type}
            />

            <TextInput
              style={[styles.input, styles.multiline]}
              placeholder="备注"
              multiline
              numberOfLines={3}
              onChangeText={handleChange('remark')}
              value={values.remark}
            />

            <TextInput
              style={styles.input}
              placeholder="联系方式"
              onChangeText={handleChange('contact')}
              value={values.contact}
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="邮箱"
              onChangeText={handleChange('email')}
              value={values.email}
              keyboardType="email-address"
            />

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>发布</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  multiline: { height: 100 },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontSize: 16 },
});