import { Picker } from "@react-native-picker/picker";
import { t } from 'i18next';
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

interface CategoryPickerProps {
  onCategorySelect: (categoryId: number) => void;
  initialCategoryId?: number;
}

const categoryData = [
  // { id: "2", name: "电子产品" },
  // { id: "3", name: "生鲜" },
  // { id: "4", name: "普通货物" },
  // { id: "5", name: "易碎品" },
  // { id: "6", name: "贵重物品" },
  // { id: "7", name: "大件物品" },
  // { id: "8", name: "文件资料" },
  { id: 2, name: t('publish.typeList.2') },
  { id: 3, name: t('publish.typeList.3') },
  { id: 4, name: t('publish.typeList.4') },
  { id: 5, name: t('publish.typeList.5') },
  { id: 6, name: t('publish.typeList.6')},
  { id: 7, name: t('publish.typeList.7') },
  { id: 8, name: t('publish.typeList.8') },
];

const CategoryPicker: React.FC<CategoryPickerProps> = ({
  onCategorySelect,
  initialCategoryId = 2, // 可设置默认分类ID
}) => {
  const { t } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);

  const handleCategoryChange = (itemValue: number) => {
    setSelectedCategoryId(itemValue);
    onCategorySelect(itemValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("publish.categoryLabel")}</Text>
      <Picker
        selectedValue={selectedCategoryId}
        onValueChange={handleCategoryChange}
        style={styles.picker}
      >
        {categoryData.map((category) => (
          <Picker.Item
            label={category.name}
            value={category.id}
            key={category.id}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
  },
});

export default CategoryPicker;