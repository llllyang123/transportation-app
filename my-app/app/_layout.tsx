import React from 'react';

// import { HapticTab } from '@/components/HapticTab';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';
export default function TabLayout ()
{
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerBackTitleVisible: false,
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
        options={{ headerTitle: '我的' }} 
      />
      {/* 个人信息页 */}
      <Stack.Screen 
        name="profile/info" 
        options={{ headerTitle: '个人信息' }} 
      />
      {/* 订单列表页 */}
      <Stack.Screen 
        name="profile/orders/list" 
        options={{ headerTitle: '我的订单' }} 
      />
      {/* 订单详情页 */}
      <Stack.Screen 
        name="profile/orders/detail/[orderId]" 
        options={({ route }) => ({ 
          headerTitle: `订单${route.params.orderId}详情` 
        })} 
      />

      <Stack.Screen 
        name="publish/index" 
        options={{ headerTitle: 'publish' }} 
      />

      {/* 「大厅」主页面 */}
      <Stack.Screen 
        name="hall/index" 
        options={{ headerTitle: '大厅' }} 
      />
      {/* 「大厅」infopage */}
      <Stack.Screen 
        name="hall/detail/[itemId]" 
        options={{ headerTitle: '详情' }} 
      />

      
    </Stack>
    
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
