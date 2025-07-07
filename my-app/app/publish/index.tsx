import { createFreightOrder } from "@/api/freight";
import CategoryPicker from "@/components/CategoryPicker";
import CountryPicker from "@/components/CountryPicker";
import PriceInput from "@/components/PriceInput";
import { useAuth } from "@/context/AuthContext";
import { CategoryData } from "@/mocks/orders";
import { useNavigation, useRouter } from 'expo-router';
import { Formik } from 'formik';
import { t } from "i18next";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

type PublishForm = {
  origin_location: string;
  origin_code: string;
  destination_location: string;
  destination_code: string;
  // location: string;
  type: string;
  typeid: number,
  remark: string;
  contact: string;
  email: string;
  price: string,
};

const initialValues: PublishForm = {
  origin_location: '',
  origin_code: '',
  destination_location: '',
  destination_code: '',
  // location: '',
  type: `${t('publish.typeList.4')}`,
  typeid: 4,
  remark: '',
  contact: '',
  email: '',
  price: ''
};


export default function Publish() {
  
  const router = useRouter();
  const [ price, setPrice ] = useState<number>( 0 );
  const { user } = useAuth();
  console.log( "user", user )
  const handleSubmit = async ( values: PublishForm ) =>
  {
    const nameKey = CategoryData.find( ( item ) => item.id == values.typeid )?.nameKey
    const typeName = t(nameKey)
    const data = { ...values, ...{
      // origin_location: selectedCountry,
      origin_code: selectedCountry?.iso_code,
      // destination_location: selectedCountryEnd,
      destination_code: selectedCountryEnd?.iso_code,
      price: price,
      type: typeName,
      order_date: "2023-05-15",
      user_id: user.id
    }
    }
    await createFreightOrder(data)
    alert(t('publishedSuccessfully'));
    router.push('/'); // 返回首页
  };
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [ selectedCategoryId, setSelectedCategoryId ] = React.useState( 2 );
  
const [ selectedCountry, setSelectedCountry ] = useState({"capital": "", "continent": "", "country_name": "", "country_short_name": "", "iso_code": ""});
const [selectedCountryEnd, setSelectedCountryEnd] = useState({"capital": "", "continent": "", "country_name": "", "country_short_name": "", "iso_code": ""});

  const handleCountrySelect = (country:any) => {
    console.log("Selected country:", country);
    // setSelectedCountry(country.iso_code);
    setSelectedCountry(country);
  };

  const handleCountrySelectEnd = (country: any) => {
    console.log("Selected country end:", country);
    // setSelectedCountryEnd(country.iso_code);
    setSelectedCountryEnd(country);
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
            
            <TextInput
              style={styles.input}
              placeholder={t('specificLocation')}
              onChangeText={handleChange('origin_location')}
              value={values.origin_location}
            />

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
              onChangeText={handleChange('destination_location')}
              value={values.destination_location}
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