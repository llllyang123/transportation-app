import { saveLanguage, SupportedLanguages } from "@/i18n"; // 假设 i18n 配置里有这个方法
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import
  {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";

const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [selectedLang, setSelectedLang] = useState<SupportedLanguages>(
    i18n.language as SupportedLanguages
  );

  // 切换语言逻辑
  const handleLanguageChange = async (lang: SupportedLanguages) => {
    setSelectedLang(lang);
    await saveLanguage(lang); // 保存语言到 AsyncStorage
    await i18n.changeLanguage(lang); // 切换当前语言
  };

  // 返回“我的页面”逻辑
  const handleSaveAndBack = () => {
    navigation.goBack(); // 回到上一级（我的页面）
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t("settingTitle")}</Text>

      {/* 语言切换部分 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("language")}</Text>
        <TouchableOpacity
          style={[
            styles.langButton,
            selectedLang === "zh" && styles.langButtonActive,
          ]}
          onPress={() => handleLanguageChange("zh")}
        >
          <Text>{t("chinese")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.langButton,
            selectedLang === "en" && styles.langButtonActive,
          ]}
          onPress={() => handleLanguageChange("en")}
        >
          <Text>{t("english")}</Text>
        </TouchableOpacity>
      </View>

      {/* 保存并返回按钮 */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAndBack}>
        <Text style={styles.saveButtonText}>{t("saveAndBack")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  langButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 8,
  },
  langButtonActive: {
    borderColor: "#2196F3",
    backgroundColor: "#e3f2fd",
  },
  saveButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SettingsScreen;