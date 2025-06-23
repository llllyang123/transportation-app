import { Cargo, HallScreen } from '@/components/FindList'; // 导入封装好的组件
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
// 模拟数据
const mockCargos: Cargo[] = [
  {
    id: '1',
    origin: '上海',
    destination: '北京',
    type: '电子产品',
    remark: '3C产品，易碎，请轻拿轻放',
    date: '2023-05-15',
    price: '¥500',
    status: '待取',
    isUrgent: true,
    hasInsurance: true,
  },
  {
    id: '2',
    origin: '广州',
    destination: '深圳',
    type: '生鲜',
    remark: '冷链运输，需要冷藏设备',
    date: '2023-05-16',
    price: '¥300',
    status: '待取',
    isUrgent: false,
    hasInsurance: false,
  },
  {
    id: '3',
    origin: '成都',
    destination: '重庆',
    type: '普通货物',
    remark: '日常用品，无特殊要求',
    date: '2023-05-14',
    price: '¥200',
    status: '运输中',
    isUrgent: false,
    hasInsurance: true,
  },
  {
    id: '4',
    origin: '杭州',
    destination: '南京',
    type: '易碎品',
    remark: '玻璃制品，小心轻放',
    date: '2023-05-13',
    price: '¥800',
    status: '已完成',
    isUrgent: true,
    hasInsurance: true,
  },
  {
    id: '5',
    origin: '武汉',
    destination: '长沙',
    type: '贵重物品',
    remark: '高价值物品，需专人护送',
    date: '2023-05-12',
    price: '¥1200',
    status: '待取',
    isUrgent: true,
    hasInsurance: true,
  },
];

// 自定义分类
const customCategories = [
  { id: '2', name: '电子产品' },
  { id: '3', name: '生鲜' },
  { id: '4', name: '普通货物' },
  { id: '5', name: '易碎品' },
  { id: '6', name: '贵重物品' },
  { id: '7', name: '大件物品' },
  { id: '8', name: '文件资料' },
];

// 自定义列表项内容
const customRenderItemContent = (cargo: Cargo) => (
  <>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>{cargo.type}</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1677ff' }}>{cargo.price}</Text>
    </View>
    
    <View style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>{cargo.origin}</Text>
        <View style={{ marginHorizontal: 8 }}>
          <MaterialIcons name="arrow-right-alt" size={20} color="#999" />
        </View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>{cargo.destination}</Text>
      </View>
      
      <Text style={{ fontSize: 14, color: '#666' }}>{cargo.date}</Text>
    </View>
    
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ flex: 1, marginRight: 8, color: '#666' }} numberOfLines={1}>
        {cargo.remark}
      </Text>
      
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {cargo.isUrgent && (
          <View style={{ backgroundColor: '#ff4d4f', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 4 }}>
            <Text style={{ fontSize: 12, color: '#fff' }}>紧急</Text>
          </View>
        )}
        {cargo.hasInsurance && (
          <View style={{ backgroundColor: '#722ed1', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 4 }}>
            <Text style={{ fontSize: 12, color: '#fff' }}>保险</Text>
          </View>
        )}
        <View 
          style={{ 
            paddingHorizontal: 6, 
            paddingVertical: 2, 
            borderRadius: 4,
            backgroundColor: cargo.status === '待取' ? '#1677ff' : 
                             cargo.status === '运输中' ? '#faad14' : '#52c41a'
          }}
        >
          <Text style={{ fontSize: 12, color: '#fff' }}>{cargo.status}</Text>
        </View>
      </View>
    </View>
  </>
);

// 自定义空状态
const customEmptyStateIcon = <MaterialIcons name="inbox" size={48} color="#ccc" />;

// 使用示例
const MyHallScreen: React.FC = () =>
{
  const navigation = useNavigation(); 
  // 处理列表项点击
  const handleItemPress = (cargo: Cargo) => {
    console.log('点击了货物:', cargo);
    // 这里可以添加导航逻辑，跳转到详情页
    navigation.navigate('hall/detail/[itemId]', { itemId: cargo.id });
  };

  // 处理刷新
  const handleRefresh = () => {
    console.log('刷新数据...');
    // 这里可以添加刷新数据的逻辑
  };

  // 处理加载更多
  const handleLoadMore = () => {
    console.log('加载更多数据...');
    // 这里可以添加加载更多数据的逻辑
    
  };

  return (
    <HallScreen
      title="我的货物大厅"
      cargos={mockCargos}
      onItemPress={handleItemPress}
      onRefresh={handleRefresh}
      onLoadMore={handleLoadMore}
      renderItemContent={customRenderItemContent}
      categories={customCategories}
      emptyStateMessage="暂无符合条件的货物，请尝试调整筛选条件"
      emptyStateIcon={customEmptyStateIcon}
    />
  );
};

export default MyHallScreen;