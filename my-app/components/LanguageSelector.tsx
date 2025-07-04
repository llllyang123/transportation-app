import i18n, { SupportedLanguages, saveLanguage } from "@/i18n";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LanguageSelectorProps {
  onLanguageChange?: (lang: SupportedLanguages) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  const changeLanguage = async (lang: SupportedLanguages) => {
    await i18n.changeLanguage(lang);
    await saveLanguage(lang); // 需实现 saveLanguage（可复用 i18n.tsx 中的逻辑）
    setShowMenu(false);
    onLanguageChange?.(lang);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu} style={styles.button}>
        <Text style={styles.text}>
          {i18n.t("language")}: {i18n.language === "zh" ? "中文" : "English"}
        </Text>
      </TouchableOpacity>

      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => changeLanguage("zh")} style={styles.menuItem}>
            <Text>{i18n.t("chinese")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeLanguage("en")} style={styles.menuItem}>
            <Text>{i18n.t("english")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// 样式
const styles = StyleSheet.create({
  container: { position: "relative" },
  button: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  text: { fontSize: 16 },
  menu: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  menuItem: { padding: 10, minWidth: 120 },
});

export default LanguageSelector;