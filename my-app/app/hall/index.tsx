import { getFreightOrders } from '@/api/freight';
import { Cargo, HallScreen, MarginCargo } from '@/components/FindList'; // 导入封装好的组件
import { onOrderRefresh } from '@/utils/eventBus';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

// 模拟数据
const mockCargos: Cargo[] = [
  {
    id: 1,
    origin_location: 'Shanghai',
    origin_code:'CHN',
    destination_location: 'Beijing',
    destination_code: 'CHN',
    type: 'Electronic products',
    typeid: 2,
    remark: '3C products, fragile, please handle with care',
    order_date: '2023-05-15',
    price: '$500',
    status: 1,
    isUrgent: true,
    hasInsurance: true,
    },
    {
    id: 2,
    origin_location: 'Guangzhou',
    origin_code:'CHN',
    destination_location: 'Shenzhen',
    destination_code: 'CHN',
    type: 'Fresh',
    typeid: 3,
    remark: 'Cold chain transportation, refrigeration equipment is required',
    order_date: '2023-05-16',
    price: '$300',
    status: 1,
    isUrgent: false,
    hasInsurance: false,
    },
    {
    id: 3,
    origin_location: 'Chengdu',
    origin_code:'CHN',
    destination_location: 'Chongqing',
    destination_code: 'CHN',
    type: 'General goods',
    typeid: 4,
    remark: 'Daily necessities, no special requirements',
    order_date: '2023-05-14',
    price: '$200',
    status: 2,
    isUrgent: false,
    hasInsurance: true,
    },
    {
    id: 4,
    origin_location: 'Hangzhou',
    origin_code:'CHN',
    destination_location: 'Nanjing',
    destination_code: 'CHN',
    type: 'Fragile goods',
    typeid: 5,
    remark: 'Glass products, please handle with care',
    order_date: '2023-05-13',
    price: '$800',
    status: 3,
    isUrgent: true,
    hasInsurance: true,
    },
    {
    id: 5,
    origin_location: 'Wuhan',
    origin_code:'CHN',
    destination_location: 'Changsha',
    destination_code: 'CHN',
    type: 'Valuables',
    typeid: 6,
    remark: 'High value items require special escort',
    order_date: '2023-05-12',
    price: '$1200',
    status: 1,
    isUrgent: true,
    hasInsurance: true,
    },
];

// 自定义分类
const customCategories = [
  // { id: '2', name: '电子产品' },
  // { id: '3', name: '生鲜' },
  // { id: '4', name: '普通货物' },
  // { id: '5', name: '易碎品' },
  // { id: '6', name: '贵重物品' },
  // { id: '7', name: '大件物品' },
  // { id: '8', name: '文件资料' },
    { id: 2, name: t('publish.typeList.2') },
    { id: 3, name: t('publish.typeList.3') },
    { id: 4, name: t('publish.typeList.4') },
    { id: 5, name: t('publish.typeList.5') },
    { id: 6, name: t('publish.typeList.6') },
    { id: 7, name: t('publish.typeList.7') },
    { id: 8, name: t('publish.typeList.8') },
];

// 自定义列表项内容
const customRenderItemContent = (cargo: MarginCargo) => (
  <>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>{cargo.type}</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1677ff' }}>${cargo.price}</Text>
    </View>
    
    <View style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>{cargo.origin_location}</Text>
        <View style={{ marginHorizontal: 8 }}>
          <MaterialIcons name="arrow-right-alt" size={20} color="#999" />
        </View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>{cargo.destination_location}</Text>
      </View>
      
      <Text style={{ fontSize: 14, color: '#666' }}>{cargo.order_date}</Text>
    </View>
    
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ flex: 1, marginRight: 8, color: '#666' }} numberOfLines={1}>
        {cargo.remark}
      </Text>
      
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {cargo.isUrgent && (
          <View style={{ backgroundColor: '#ff4d4f', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 4 }}>
            <Text style={{ fontSize: 12, color: '#fff' }}>{t('hallInfo.emergency')}</Text>
          </View>
        )}
        {cargo.hasInsurance && (
          <View style={{ backgroundColor: '#722ed1', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 4 }}>
            <Text style={{ fontSize: 12, color: '#fff' }}>{t('hallInfo.Insurance')}</Text>
          </View>
        )}
        <View 
          style={{ 
            paddingHorizontal: 6, 
            paddingVertical: 2, 
            borderRadius: 4,
            backgroundColor: cargo.status === 1 ? '#1677ff' : 
                             cargo.status === 2 ? '#faad14' : '#52c41a'
          }}
        >
          <Text style={{ fontSize: 12, color: '#fff' }}>{cargo.status === 1 ? t('hallInfo.waitingForPickup') : cargo.status === 2 ? t('hallInfo.inTransit') : cargo.status === 3 ? t('hallInfo.completed') : '' }</Text>
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
    fetchCargos()
  };

  // 处理加载更多
  const handleLoadMore = () => {
    console.log('加载更多数据...');
    // 这里可以添加加载更多数据的逻辑
    
  };

  const [loading, setLoading] = useState(false);
  const [cargoList, setCargoList] = useState<Cargo[]>([]);

 // 加载货物列表
 const fetchCargos = async () => {
  setLoading(true);
  try {
    // 模拟API请求
    // const response = await fetch('https://api.example.com/cargos');
    // const data = await response.json();
    // setCargoList( data );
    const data = await getFreightOrders()
    console.log("原始数据结构:", data); // 关键调试点
      
      // 检查数据是否有效
      if (!Array.isArray(data)) {
        throw new Error('返回数据不是数组类型');
      }
    // setCargoList( mockCargos );
    setCargoList( data );
    // 调试：验证数据是否符合预期
    if (data.length > 0) {
      console.log("第一个货物:", data[0]);
    } else {
      console.log("返回数据为空数组");
    }
  } catch (error) {
    console.error('Failed to fetch cargos:', error);
  } finally {
    setLoading(false);
  }
};

// 组件挂载时加载数据
useEffect(() => {
  fetchCargos();

  // 监听订单刷新事件
  const unsubscribe = onOrderRefresh(() => {
    fetchCargos();
  });

  return unsubscribe; // 组件卸载时取消订阅
}, []);

  return (
    <HallScreen
      cargos={cargoList}
      onItemPress={handleItemPress}
      onRefresh={handleRefresh}
      onLoadMore={handleLoadMore}
      renderItemContent={customRenderItemContent}
      categories={customCategories}
      emptyStateMessage={t("hallInfo.noDataTips")}
      emptyStateIcon={customEmptyStateIcon}
    />
  );
};

export default MyHallScreen;