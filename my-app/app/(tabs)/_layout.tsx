import { Ionicons } from '@expo/vector-icons'; // 需安装依赖：expo install @expo/vector-icons
import { Tabs } from 'expo-router';
import { t } from 'i18next';
import { StyleSheet } from 'react-native';

// Tab 图标类型
type TabIconProps = {
  color: string;
  size: number;
};

// 自定义 Tab 图标
function HomeIcon({ color, size }: TabIconProps) {
  return <Ionicons name="home" color={color} size={size} />;
}

function ExploreIcon({ color, size }: TabIconProps) {
  return <Ionicons name="search" color={color} size={size} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2196F3', // 激活态颜色
        tabBarInactiveTintColor: '#999',  // 未激活态颜色
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#eee',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
        },
      }}
    >
      {/* 首页 Tab */}
      <Tabs.Screen 
        name="index" 
        options={{ 
          tabBarLabel: 'Home', 
          tabBarIcon: ( { color, size } ) => <HomeIcon color={ color } size={ size } />, 
          headerTitle: t('home')
        }} 
      />

      {/* 探索 Tab（示例） */}
      <Tabs.Screen 
        name="explore" 
        options={{ 
          tabBarLabel: 'MY', 
          tabBarIcon: ({ color, size }) => <ExploreIcon color={color} size={size} 
          />, 
          headerTitle: t('profile')
        }} 
      />
    </Tabs>
  );
}

// 如果需要自定义 Tab 页面样式，可添加以下全局样式（可选）
const globalStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});