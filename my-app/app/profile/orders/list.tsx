import OrderItem from '@/components/OrderItem';
import { OrdersList } from '@/mocks/orders';
import { Order } from '@/models/orders';
import { useNavigation, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
// 订单类型（与 ProfileHome 中一致）
// type Order = { id: number;origin: string, destination: string, type: string, typeid: number, status: number; remark: string, date: string,isUrgent:boolean, hasInsurance: boolean,  shop: string; price: string, total: string; products: number };
const mockOrders: Order[] = OrdersList;

export default function OrderList() {
  const router = useRouter();
  const navigation = useNavigation(); 
  const openDatile = (order: Order) =>
  {
    console.log(order)
    navigation.navigate('profile/orders/detail/[orderId]', {orderId: order.id})
    // router.push(`/profile/orders/detail/[orderId]`)
  }
  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.title}>我的订单</Text> */}
      <View style={styles.ordersContainer}>
        {mockOrders.map((order) => (
          <OrderItem 
            key={order.id} 
            order={order} 
            // onPress={() => router.push(`/profile/orders/detail/[orderId]`,{ orderId: order.id })} 
            onPress={()=>openDatile(order)}
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