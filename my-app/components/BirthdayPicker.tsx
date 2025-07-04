import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, StyleSheet, View } from 'react-native';

interface BirthdayPickerProps {
  initialDate?: Date; // 初始日期
  onDateChange?: (date: Date) => void; // 日期变化回调
  showConfirmButton?: boolean; // 是否显示确认按钮
}

const BirthdayPicker = ({
  initialDate = new Date(),
  onDateChange,
  showConfirmButton = true,
}: BirthdayPickerProps) => {
  const { t } = useTranslation();
  const [year, setYear] = useState(initialDate.getFullYear());
  const [month, setMonth] = useState(initialDate.getMonth() + 1);
  const [day, setDay] = useState(initialDate.getDate());
  
  // 生成年份数组（1900年到当前年份）
  const years = Array.from(
    { length: new Date().getFullYear() - 1900 + 1 },
    (_, i) => 1900 + i
  );
  
  // 生成月份数组
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // 根据年月计算当月天数
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };
  
  // 当月天数数组
  const days = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, i) => i + 1
  );
  
  // 处理日期变化
  const handleDateChange = () => {
    const selectedDate = new Date(year, month - 1, day);
    onDateChange?.(selectedDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        {/* 年份选择器 */}
        <Picker
          selectedValue={year}
          onValueChange={(itemValue) => setYear(itemValue)}
          style={styles.picker}
        >
          {years.map((y) => (
            <Picker.Item label={y.toString()} value={y} key={y} />
          ))}
        </Picker>
        
        {/* 月份选择器 */}
        <Picker
          selectedValue={month}
          onValueChange={(itemValue) => setMonth(itemValue)}
          style={styles.picker}
        >
          {months.map((m) => (
            <Picker.Item 
              label={t(`months.${m - 1}`)} // 从 i18n 获取月份名称
              value={m} 
              key={m} 
            />
          ))}
        </Picker>
        
        {/* 日期选择器 */}
        <Picker
          selectedValue={day}
          onValueChange={(itemValue) => setDay(itemValue)}
          style={styles.picker}
        >
          {days.map((d) => (
            <Picker.Item label={d.toString()} value={d} key={d} />
          ))}
        </Picker>
      </View>
      
      {showConfirmButton && (
        <Button 
          title={t('common.confirm')} 
          onPress={handleDateChange} 
          style={styles.confirmButton} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    flex: 1,
    height: 50,
  },
  confirmButton: {
    marginTop: 16,
  },
});

export default BirthdayPicker;