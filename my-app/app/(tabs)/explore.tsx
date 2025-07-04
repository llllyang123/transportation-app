import UserPage from '@/app/profile';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

// 模拟订单数据
type Order = { id: string; status: string; shop: string; total: string; products: number };
const mockOrders: Order[] = [
  { id: '1', status: '待付款', shop: '示例店铺1', total: '99.00', products: 1 },
  { id: '2', status: '待发货', shop: '示例店铺2', total: '199.00', products: 2 },
];

export default function ProfileHome() {
  const router = useRouter();

  return (
    <UserPage></UserPage>
    // <ScrollView style={styles.container}>
    //   {/* 个人信息区域 */}
    //   <TouchableOpacity
    //     style={styles.profileContainer}
    //     onPress={() => router.push('/profile')} // 跳转个人信息页
    //   >
    //     <Image
    //       source={{ uri: 'https://picsum.photos/100/100' }}
    //       style={styles.avatar}
    //       contentFit="cover"
    //       alt="用户头像"
    //     />
    //     <View style={styles.profileInfo}>
    //       <Text style={styles.username}>用户名</Text>
    //       <Text style={styles.editProfile}>点击编辑个人信息</Text>
    //     </View>
    //     <FontAwesome name="angle-right" size={24} color="#888" />
    //   </TouchableOpacity>

    //   {/* 功能导航区域 */}
    //   <View style={styles.functionContainer}>
    //     <TouchableOpacity
    //       style={styles.functionItem}
    //       onPress={() => router.push('/profile/orders/list')} // 跳转订单列表
    //     >
    //       <FontAwesome name="list-alt" size={24} color="#333" />
    //       <Text style={styles.functionText}>我的订单</Text>
    //       <FontAwesome name="angle-right" size={24} color="#888" />
    //     </TouchableOpacity>

    //     {/* 可继续扩展其他功能（收货地址、支付设置等） */}
    //   </View>

    //   {/* 最近订单 */}
    //   <View style={styles.recentOrdersHeader}>
    //     <Text style={styles.recentOrdersTitle}>最近订单</Text>
    //     <TouchableOpacity onPress={() => router.push('/profile/orders/list')}>
    //       <Text style={styles.viewAllText}>查看全部</Text>
    //     </TouchableOpacity>
    //   </View>

    //   <View style={styles.ordersContainer}>
    //     {mockOrders.map((order) => (
    //       <OrderItem 
    //         key={order.id} 
    //         order={order} 
    //         onPress={() => router.push(`/profile/orders/detail/${order.id}`)} 
    //       />
    //     ))}
    //   </View>
    // </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  profileInfo: { marginLeft: 20, flex: 1 },
  username: { fontSize: 20, fontWeight: 'bold' },
  editProfile: { color: 'gray' },
  functionContainer: { backgroundColor: 'white', marginBottom: 10 },
  functionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  functionText: { marginLeft: 15, fontSize: 16, flex: 1 },
  recentOrdersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
  },
  recentOrdersTitle: { fontSize: 18, fontWeight: 'bold' },
  viewAllText: { color: '#007AFF' },
  ordersContainer: { backgroundColor: 'white', marginBottom: 20 },
});