import { OrdersList } from '@/mocks/orders';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { t } from 'i18next';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 订单详情类型（可扩展更详细字段）
type OrderDetail = { id: number;origin: string, destination: string, type: string, typeid: number, status: number; remark: string, date: string,isUrgent:boolean, hasInsurance: boolean,  shop: string; price: string, total: string; products: number };

// 模拟订单详情数据
const mockOrderDetail: OrderDetail = {
  id: 1,
  origin: 'Shanghai',
  destination: 'Beijing',
  type: 'Electronic products',
  typeid: 2,
  remark: '3C products, fragile, please handle with care',
  date: '2023-05-15',
  price: '$500',
  status: 1,
  isUrgent: true,
  hasInsurance: true,
  shop: '示例店铺1',
  total: '$500',
  products: 1
};

export default function OrderDetailScreen ()
{
  const navigation = useNavigation();
  const { orderId } = useLocalSearchParams(); 
  // const { order } = useLocalSearchParams();
  // 实际项目可通过 orderId 请求接口获取数据，这里先用 mock 演示
  // const order = mockOrderDetail;
  const [ loading, setLoading ] = useState( false );
  const [isAccepted, setIsAccepted] = useState(false);

  const orderInfo = OrdersList.find( item => item.id.toString() === orderId )

  if ( !orderInfo )
  {
    return (<></>)
  }
   const handleTakeOrder = async () =>
    {
      if (loading || isAccepted) return;
      
     setLoading( true );
      try {
        // 模拟API请求
        await acceptOrderApi(orderInfo.id); // 调用实际API
        // 模拟接单API请求
        // await fetch(`https://api.example.com/cargos/${route.params.cargoId}/accept`, {
        //   method: 'POST',
        // });
  
        
        // 显示成功提示
        Alert.alert(
          `${t('success')}`,
          `${t('success')}`,
          [
            {
              text:  `${t('hallInfo.enter')}`,
              onPress: () => {
                setIsAccepted( true );
                // 触发刷新事件
                // emitOrderRefresh();
                // 返回上一页
                navigation.goBack();
              },
            },
          ],
          { cancelable: false }
        );
      } catch (error) {
        console.error(`${t('hallInfo.error')}`, error);
        Alert.alert(`${t('hallInfo.error')}`, error.message || `${t('hallDetail.tryAgain')}`);
      } finally {
        setLoading(false);
      }
      // router.push(`/profile/${itemId}`);
    };

   // 模拟接单API
   const acceptOrderApi = async (itemId: any) => {
    // 实际项目中这里应该调用后端API
    console.log(itemId)
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };
  
    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ t( 'hallDetail.cargoDetails' ) }</Text>
      <View style={styles.infoSection}>
        <Text style={styles.label}>{ t( 'hallDetail.origin' ) }</Text>
        <Text style={styles.value}>{orderInfo.origin}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>{ t( 'hallDetail.destination' ) }</Text>
        <Text style={styles.value}>{orderInfo.destination}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>{ t( 'hallDetail.cargoType' ) }</Text>
        <Text style={styles.value}>{orderInfo.type}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>{ t( 'hallDetail.remarks' ) }</Text>
        <Text style={[styles.value, styles.remark]}>
          {orderInfo.remark.length > 30 
            ? `${orderInfo.remark.slice(0, 30)}...` 
            : orderInfo.remark}
        </Text>
      </View>
      {/* <Text>商品列表：</Text>
      {order.products.map((product, index) => (
        <Text key={index}>
          {product.name} × {product.quantity} （¥{product.price}）
        </Text>
      ))} */}
      <TouchableOpacity 
        style={styles.takeOrderButton} 
        onPress={handleTakeOrder}
      >
        <Text style={styles.takeOrderText}>{ t( 'hallDetail.finish' ) }</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    width: 80,
  },
  value: {
    flex: 1,
    color: '#333',
  },
  remark: {
    flex: 1,
    color: '#666',
    fontSize: 14,
  },
  takeOrderButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  takeOrderText: {
    color: '#fff',
    fontSize: 16,
  },
});