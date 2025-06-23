import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

// 订单详情类型（可扩展更详细字段）
type OrderDetail = {
  id: string;
  status: string;
  shop: string;
  total: string;
  products: { name: string; price: string; quantity: number }[];
};

// 模拟订单详情数据
const mockOrderDetail: OrderDetail = {
  id: '1',
  status: '待付款',
  shop: '示例店铺1',
  total: '99.00',
  products: [
    { name: '商品A', price: '99.00', quantity: 1 },
  ],
};

export default function OrderDetailScreen() {
  const { orderId } = useLocalSearchParams(); 
  // 实际项目可通过 orderId 请求接口获取数据，这里先用 mock 演示
  const order = mockOrderDetail;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>订单详情</Text>
      <Text>订单 ID：{order.id}</Text>
      <Text>状态：{order.status}</Text>
      <Text>店铺：{order.shop}</Text>
      <Text>商品总价：¥{order.total}</Text>
      <Text>商品列表：</Text>
      {order.products.map((product, index) => (
        <Text key={index}>
          {product.name} × {product.quantity} （¥{product.price}）
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
});