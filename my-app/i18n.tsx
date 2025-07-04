import { TranslationResource } from '@/constants/locales/types';
import zhTranslation from '@/constants/locales/zh/translation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './constants/locales/en/translation';


export type SupportedLanguages = 'en' | 'zh';

const supportedLanguagesList: { code: SupportedLanguages; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
];

export const loadLanguage = async (): Promise<SupportedLanguages | null> => {
  try {
    const savedLang = await AsyncStorage.getItem('appLanguage');
    return savedLang as SupportedLanguages | null;
  } catch (error) {
    console.error('加载语言失败:', error);
    return null;
  }
};

export const saveLanguage = async (lang: SupportedLanguages) => {
  try {
    await AsyncStorage.setItem('appLanguage', lang);
  } catch (error) {
    console.error('保存语言失败:', error);
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      zh: { translation: zhTranslation },
    },
    lng: 'zh', 
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
    initImmediate: false, 
  });

// 先判断 RNLocalize 是否存在再调用方法
// const deviceLang = RNLocalize ? RNLocalize.findBestAvailableLanguage(
//   supportedLanguagesList.map((l) => l.code)
// ) : null;

loadLanguage().then((savedLang) => {
  if (savedLang) {
    i18n.changeLanguage(savedLang);
  } else {
    // const langCode = deviceLang?.languageTag?.split('-')[0] as SupportedLanguages || 'zh';
    // i18n.changeLanguage(langCode);
  }
});

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: TranslationResource;
    };
  }
}

export default i18n;