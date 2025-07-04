import React, { useState } from 'react';

// import { HapticTab } from '@/components/HapticTab';
import LanguageSelector from '@/components/LanguageSelector';
import { AuthProvider } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import i18n from '@/i18n';
import { Stack } from 'expo-router';
import { I18nextProvider, useTranslation } from "react-i18next";
import { Modal, StyleSheet, View } from 'react-native';

export default function TabLayout ()
{
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const handleLanguagePress = () => {
    setShowLanguageModal(true);
  };

  return (
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <Stack
          screenOptions={{
              headerBackTitleVisible: false,
              headerTintColor: '#000',
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTitleAlign: 'center',
          }}
        >
        {/* 底部 Tab 分组（可选） */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* 「我的」主页面 */}
        <Stack.Screen 
          name="profile/index" 
            options={ {
              headerTitle: t( 'profile' ),
              headerLeft: () => null, // 隐藏左侧返回按钮
              headerBackVisible: false, // 禁用返回按钮
           }}
        />
        {/* 个人信息页 */}
        <Stack.Screen 
          name="profile/info" 
          options={{ headerTitle: t('profileInfo') }}
        />
        {/* 订单列表页 */}
        <Stack.Screen 
          name="profile/orders/list" 
          options={{ headerTitle: t('myOrders.title') }} 
        />
        {/* 订单详情页 */}
        <Stack.Screen 
          name="profile/orders/detail/[orderId]" 
          options={({ route }) => ({ 
            headerTitle: `${t('order')}${route.params.orderId}${t('details')}` 
          })} 
        />

        <Stack.Screen 
          name="publish/index" 
          options={{ headerTitle: t('publish.title') }} 
        />

        {/* 「大厅」主页面 */}
        <Stack.Screen 
          name="hall/index" 
          options={{ headerTitle: t('hall') }} 
        />
        {/* 「大厅」infopage */}
        <Stack.Screen 
          name="hall/detail/[itemId]" 
          options={{ headerTitle: t('details') }} 
          />
          
          <Stack.Screen name="settings/index" />
          
          {/* 认证页面 */}
          <Stack.Screen name="auth/LoginScreen"
            // component={ LoginScreen }
            options={ { headerTitle: t('login.title') } } />
        
        <Stack.Screen name="auth/RegisterScreen"
            // component={ LoginScreen }
            options={ {  headerTitle: t( 'register.title' ) } } />
          
        </Stack>
        <Modal
          visible={showLanguageModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <LanguageSelector onClose={() => setShowLanguageModal(false)} />
            </View>
          </View>
        </Modal>
      </I18nextProvider>
    </AuthProvider>
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    //     headerShown: false,
    //     // tabBarButton: HapticTab,
    //     // tabBarBackground: TabBarBackground,
    //     tabBarStyle: Platform.select({
    //       ios: {
    //         // Use a transparent background on iOS to show the blur effect
    //         position: 'absolute',
    //       },
    //       default: {},
    //     }),
    //   }}>
      /* <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      /> */
      
    // </Tabs>
  );
}
const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    marginRight: 16,
  },
  languageButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
