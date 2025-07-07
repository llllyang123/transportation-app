import { CategoryData } from "@/mocks/orders";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

interface CategoryPickerProps {
  onCategorySelect: (categoryId: number) => void;
  initialCategoryId?: number;
}

const categoryData = CategoryData

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
            label={t(category.nameKey)}
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