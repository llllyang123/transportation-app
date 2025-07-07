import { createFreightOrder } from "@/api/freight";
import CategoryPicker from "@/components/CategoryPicker";
import CountryPicker from "@/components/CountryPicker";
import PriceInput from "@/components/PriceInput";
import { useAuth } from "@/context/AuthContext";
import { CategoryData } from "@/mocks/orders";
import DateTimePicker from '@react-native-community/datetimepicker'; // 引入日期选择组件
import { useNavigation, useRouter } from 'expo-router';
import { Formik } from 'formik';
import { t } from "i18next";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

// 扩展表单类型，添加订单日期字段
type PublishForm = {
  origin_location: string;
  origin_code: string;
  destination_location: string;
  destination_code: string;
  type: string;
  typeid: number;
  remark: string;
  contact: string;
  email: string;
  price: string;
  order_date: string; // 新增：订单日期（字符串格式）
};

// 初始化表单值，默认订单日期为空（将由选择器填充）
const initialValues: PublishForm = {
  origin_location: '',
  origin_code: '',
  destination_location: '',
  destination_code: '',
  type: `${t('publish.typeList.4')}`,
  typeid: 4,
  remark: '',
  contact: '',
  email: '',
  price: '',
  order_date: '', // 初始化为空
};

export default function Publish() {
  const router = useRouter();
  const [price, setPrice] = useState<number>(0);
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedCategoryId, setSelectedCategoryId] = useState(4);
  const [selectedCountry, setSelectedCountry] = useState({
    capital: "",
    continent: "",
    country_name: "",
    country_short_name: "",
    iso_code: ""
  });
  const [selectedCountryEnd, setSelectedCountryEnd] = useState({
    capital: "",
    continent: "",
    country_name: "",
    country_short_name: "",
    iso_code: ""
  });

  // 新增：日期选择器状态
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 处理日期选择变更
  const handleDateChange = (event: any, pickedDate: Date | undefined) => {
    // 关闭日期选择器（iOS需要手动关闭，Android自动关闭）
    setShowDatePicker(Platform.OS === 'ios');
    if (pickedDate) {
      setSelectedDate(pickedDate);
    }
  };

  // 显示日期选择器
  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country);
  };

  const handleCountrySelectEnd = (country: any) => {
    setSelectedCountryEnd(country);
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSubmit = async (values: PublishForm) => {
    // 验证日期是否选择
    if (!selectedDate) {
      alert(t('publish.pleaseSelectDate'));
      return;
    }

    // 验证其他必填字段
    if (!selectedCountry.iso_code || !selectedCountryEnd.iso_code || !price) {
      alert(t('publish.pleaseFillRequired'));
      return;
    }

    try {
      // 🌟 关键：精确格式化日期为 "YYYY-MM-DD" 字符串
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，补0
    const day = String(selectedDate.getDate()).padStart(2, '0'); // 日期补0
    const formattedDate = `${year}-${month}-${day}`; // 结果：2025-05-12
      // 查找分类名称
      const nameKey = CategoryData.find(item => item.id === selectedCategoryId)?.nameKey;
      const typeName = nameKey ? t(nameKey) : values.type;

      // 构建提交数据（包含order_date）
      const data = {
        ...values,
        origin_code: selectedCountry.iso_code,
        destination_code: selectedCountryEnd.iso_code,
        price: price, // 确保价格为字符串
        type: typeName,
        typeid: selectedCategoryId,
        order_date: formattedDate, // 加入格式化后的日期
        user_id: user?.id,
        isUrgent: false, // 可根据实际需求添加
        hasInsurance: false, // 可根据实际需求添加
      };

      // 调用创建订单API
      await createFreightOrder(data);
      alert(t('publishedSuccessfully'));
      router.push('/'); // 返回首页
    } catch (error) {
      console.error('发布失败:', error);
      alert(t('publish.publishFailed'));
    }
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
            {/* 出发地国家选择 */}
            <CountryPicker
              lab='origin'
              onCountrySelect={handleCountrySelect}
              placeholder={t("common.selectCountry")}
              showSearch={true}
            />

            {/* 出发地具体位置 */}
            <TextInput
              style={styles.input}
              placeholder={t('specificLocation')}
              onChangeText={handleChange('origin_location')}
              value={values.origin_location}
            />

            {/* 目的地国家选择 */}
            <CountryPicker
              lab='destination'
              onCountrySelect={handleCountrySelectEnd}
              placeholder={t("common.selectCountry")}
              showSearch={true}
            />

            {/* 目的地具体位置 */}
            <TextInput
              style={styles.input}
              placeholder={t('specificLocation')}
              onChangeText={handleChange('destination_location')}
              value={values.destination_location}
            />

            {/* 新增：订单日期选择 */}
            <TouchableOpacity
              style={[styles.input, styles.dateInput]}
              onPress={handleShowDatePicker}
            >
              <Text>
                {selectedDate 
                  ? selectedDate.toISOString().split('T')[0] 
                  : t('publish.selectOrderDate')}
              </Text>
            </TouchableOpacity>

            {/* 显示日期选择器 */}
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate || new Date()} // 默认为当前日期
                mode="date" // 仅选择日期
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()} // 可选：限制不能选择过去的日期
              />
            )}

            {/* 货物分类选择 */}
            <CategoryPicker
              onCategorySelect={handleCategorySelect}
              initialCategoryId={selectedCategoryId}
            />

            {/* 备注 */}
            <TextInput
              style={[styles.input, styles.multiline]}
              placeholder={t('remark')}
              multiline
              numberOfLines={3}
              onChangeText={handleChange('remark')}
              value={values.remark}
            />

            {/* 价格输入 */}
            <PriceInput
              onPriceChange={setPrice}
              placeholder={t('publish.pricePlaceholder')}
            />

            {/* 邮箱 */}
            <TextInput
              style={styles.input}
              placeholder={t('email')}
              onChangeText={handleChange('email')}
              value={values.email}
              keyboardType="email-address"
            />

            {/* 提交按钮 */}
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
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateInput: {
    justifyContent: 'center', // 日期文本居中
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top', // 多行文本顶部对齐
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});