import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface PriceInputProps {
  onPriceChange: (price: number) => void;
  initialPrice?: number;
  placeholder?: string;
}

const PriceInput: React.FC<PriceInputProps> = ({
  onPriceChange,
  initialPrice = 0,
  placeholder = "Enter price",
}) => {
  const { t } = useTranslation();
  const [priceText, setPriceText] = useState(initialPrice ? initialPrice.toString() : '');
  const [error, setError] = useState<string | null>(null);

  // 处理价格输入变化
  const handlePriceChange = (text: string) => {
    // 移除非数字和非小数点字符
    const cleanedText = text.replace(/[^0-9.]/g, '');
    
    // 验证最多一个小数点
    const parts = cleanedText.split('.');
    let formattedText = cleanedText;
    
    if (parts.length > 2) {
      formattedText = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // 限制小数点后最多两位
    if (parts.length === 2 && parts[1].length > 2) {
      formattedText = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    setPriceText(formattedText);
    
    // 转换为数字并传递给父组件
    if (formattedText === '') {
      onPriceChange(0);
      setError(null);
    } else {
      const price = parseFloat(formattedText);
      if (isNaN(price)) {
        setError(t('validation.invalidPrice'));
        onPriceChange(0);
      } else {
        setError(null);
        onPriceChange(price);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          style={styles.input}
          value={priceText}
          onChangeText={handlePriceChange}
          placeholder={placeholder}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  currencySymbol: {
    fontSize: 16,
    marginRight: 8,
    color: '#333',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default PriceInput;