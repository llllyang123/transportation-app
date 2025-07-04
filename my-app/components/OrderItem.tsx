import { Order } from '@/models/orders';
import { FontAwesome } from '@expo/vector-icons';
import { t } from 'i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// 订单类型
// type Order = { 
//   id: number; 
//   status: number; 
//   shop: string; 
//   total: string; 
//   products: number 
// };

type OrderItemProps = {
  order: Order;
  onPress: (order: Order) => void;
};

export default function OrderItem({ order, onPress }: OrderItemProps) {
  return (
    <TouchableOpacity style={styles.orderItem} onPress={()=>onPress(order)}>
      {/* 订单顶部信息（店铺、状态） */}
      <View style={styles.orderTop}>
        <Text style={styles.orderShop}>{order.shop}</Text>
        <Text style={[styles.orderStatus, getStatusColor(order.status)]}>
          {t(`orderStatus.${order.status}`)}
        </Text>
      </View>

      {/* 订单商品简要信息（模拟显示一个商品图 + 描述） */}
      <View style={styles.orderProducts}>
        {/* <Image
          source={{ uri: 'https://picsum.photos/80/80' }}
          style={styles.productImage}
          contentFit="cover"
          alt="商品示例图"
        /> */}
        <View style={styles.productInfo}>
          {/* <Text style={styles.productName}>共 {order.products} 件商品</Text> */}
          <Text style={styles.productTotal}>合计: ¥{order.total}</Text>
        </View>
      </View>

      {/* 箭头标识，提示可点击进入详情 */}
      <FontAwesome name="angle-right" size={24} color="#888" style={styles.arrow} />
    </TouchableOpacity>
  );
}

// 根据订单状态返回不同文本颜色
const getStatusColor = (status: number) => {
  switch(status) {
    case 1:
      return { color: '#FF9500' };
    case 2:
      return { color: '#FF9500' };
    case 3:
      return { color: '#4CD964' };
    default:
      return { color: '#333' };
  }
};

const styles = StyleSheet.create({
  orderItem: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
    padding: 15,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderShop: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderStatus: {
    fontSize: 14,
  },
  orderProducts: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  productTotal: {
    fontWeight: 'bold',
  },
  arrow: {
    alignSelf: 'center',
  },
});