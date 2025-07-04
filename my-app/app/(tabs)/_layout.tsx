import { Ionicons } from '@expo/vector-icons';
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
        tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#eee' },
          tabBarLabelStyle: { fontSize: 12, marginTop: 2 },
          headerBackTitleVisible: false,
          headerTintColor: '#000',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleAlign: 'center',
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

      {/* 我的页面 */}
      <Tabs.Screen 
        name="explore" 
        options={{ 
          tabBarLabel: 'MY', 
          tabBarIcon: ({ color, size }) => <ExploreIcon color={color} size={size} />, 
          headerTitle: t( 'profile' ),
        }} 
      />
      
    </Tabs>
  );
}

// 全局样式（可选）
const globalStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});