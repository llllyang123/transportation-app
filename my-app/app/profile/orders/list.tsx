import OrderItem from '@/components/OrderItem';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

// 订单类型（与 ProfileHome 中一致）
type Order = { id: string; status: string; shop: string; total: string; products: number };
const mockOrders: Order[] = [
  { id: '1', status: '待付款', shop: '示例店铺1', total: '99.00', products: 1 },
  { id: '2', status: '待发货', shop: '示例店铺2', total: '199.00', products: 2 },
  { id: '3', status: '已完成', shop: '示例店铺3', total: '299.00', products: 1 },
];

export default function OrderList() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>我的订单</Text>
      <View style={styles.ordersContainer}>
        {mockOrders.map((order) => (
          <OrderItem 
            key={order.id} 
            order={order} 
            onPress={() => router.push(`/profile/orders/detail/${order.id}`)} 
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  ordersContainer: { backgroundColor: 'white' },
});