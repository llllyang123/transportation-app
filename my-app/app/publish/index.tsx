import CategoryPicker from "@/components/CategoryPicker";
import CountryPicker from "@/components/CountryPicker";
import PriceInput from "@/components/PriceInput";
import { useNavigation, useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

type PublishForm = {
  origin: string;
  destination: string;
  location: string;
  type: string;
  typeid: number,
  remark: string;
  contact: string;
  email: string;
  price: string,
};

const initialValues: PublishForm = {
  origin: '',
  destination: '',
  location: '',
  type: '普通货物',
  typeid: 2,
  remark: '',
  contact: '',
  email: '',
  price: ''
};


export default function Publish() {
  
  const router = useRouter();
  const [price, setPrice] = useState<number | null>(null);

  const handleSubmit = ( values: PublishForm ) =>
  {
    console.log( values )
    const data = { ...values, ...{
      origin: selectedCountry,
      destination: selectedCountryEnd,
      price: price
    }
    }
    console.log( data )
    alert(t('publishedSuccessfully'));
    router.push('/'); // 返回首页
  };
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [ selectedCategoryId, setSelectedCategoryId ] = React.useState( 2 );
  
const [ selectedCountry, setSelectedCountry ] = useState( '' );
const [selectedCountryEnd, setSelectedCountryEnd] = useState('');

  const handleCountrySelect = (country:any) => {
    console.log("Selected country:", country);
    setSelectedCountry(country.iso_code);
  };

  const handleCountrySelectEnd = (country: any) => {
    console.log("Selected country end:", country);
    setSelectedCountryEnd(country.iso_code);
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    // 可在此处结合其他表单数据，调用接口进行发布等操作
  };

  const handlePublish = () => {
    // 这里编写发布逻辑，比如整合表单数据（含分类ID）调用接口
    console.log("发布分类ID：", selectedCategoryId);
    navigation.goBack(); // 发布后返回上一页示例
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('publishOrderInfo')}</Text>

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleSubmit, values }) => (
          <>
            
            <CountryPicker 
              lab='origin'
              onCountrySelect={handleCountrySelect}
              placeholder={t("common.selectCountry")}
              showSearch={true}
            />
            
            {/* <TextInput
              style={styles.input}
              placeholder={t('origin')}
              onChangeText={handleChange('origin')}
              value={values.origin}
            /> */}

            <CountryPicker 
              lab='destination'
              onCountrySelect={handleCountrySelectEnd}
              placeholder={t("common.selectCountry")}
              showSearch={true}
            />

            {/* <TextInput
              style={styles.input}
              placeholder={t('destination')}
              onChangeText={handleChange('destination')}
              value={values.destination}
            /> */}

            <TextInput
              style={styles.input}
              placeholder={t('specificLocation')}
              onChangeText={handleChange('location')}
              value={values.location}
            />

            {/* <TextInput
              style={styles.input}
              placeholder={t('typeOfCargo')}
              onChangeText={handleChange('type')}
              value={values.type}
            /> */}
            <CategoryPicker
                onCategorySelect={handleCategorySelect}
                initialCategoryId={selectedCategoryId}
            />

            <TextInput
              style={[styles.input, styles.multiline]}
              placeholder={t('remark')}
              multiline
              numberOfLines={3}
              onChangeText={handleChange('remark')}
              value={values.remark}
            />

            {/* <TextInput
              style={styles.input}
              placeholder={t('contactDetails')}
              onChangeText={handleChange('contact')}
              value={values.contact}
              keyboardType="phone-pad"
            /> */}

            <PriceInput 
                onPriceChange={setPrice}
                placeholder={t('publish.pricePlaceholder')}
            />
              

            <TextInput
              style={styles.input}
              placeholder={t('email')}
              onChangeText={handleChange('email')}
              value={values.email}
              keyboardType="email-address"
            />

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>{t('publish.publishButton')}</Text>
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