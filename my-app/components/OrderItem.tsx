import { FreightFilter, getUserFreightOrders } from '@/api/freight';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/models/orders';
import { onOrderRefresh } from '@/utils/eventBus';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper'; // 复用发布大厅的卡片组件风格
import { MarginCargo } from './FindList';

type OrderItemProps = {
  order: Order;
  onPress: (order: Order) => void;
};

export default function OrderItem({ order, onPress }: OrderItemProps) {
  // 状态样式映射（与发布大厅保持一致的色彩体系）
  const getStatusStyle = () => {
    switch (order.status) {
      case 1: // 运输中
        return {
          bgColor: '#e6f7ff',
          textColor: '#1890ff',
          label: t('hallInfo.inTransit'),
          icon: 'local-shipping',
        };
      case 2: // 待运输
        return {
          bgColor: '#fffbe6',
          textColor: '#faad14',
          label: t('hallInfo.waitingForPickup'),
          icon: 'pending',
        };
      case 3: // 已完成
        return {
          bgColor: '#f6ffed',
          textColor: '#52c41a',
          label: t('hallInfo.completed'),
          icon: 'check-circle',
        };
      
      default:
        return {
          bgColor: '#f5f5f5',
          textColor: '#666',
          label: t('hallInfo.unknown'),
          icon: 'help',
        };
    }
  };

  const status = getStatusStyle();
  console.log("status", order)
  const [orders, setOrders] = useState<MarginCargo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const navigation = useNavigation(); 
  // const route = useRoute();
  const { user } = useAuth(); // 从全局状态获取当前用户
  const userId = user.id; // 优先使用路由参数，其次用当前用户ID

  // 筛选条件（可根据需求调整）
  const filter: FreightFilter = {
    pageSize: 10, // 每页10条
    // status: 1, // 可选：默认查询所有状态，可通过筛选器修改
  };

  // 加载订单数据
  const fetchOrders = async (currentPage: number) => {
    if (!userId) {
      setError(t('userOrders.noUserId'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // const data = await getUserFreightOrders(userId, { ...filter, page: currentPage });
      const data = await getUserFreightOrders( userId );
      setOrders(data);
      // if (currentPage === 1) {
      //   // 第一页直接替换数据
      //   setOrders(data);
      // } else {
      //   // 后续页追加数据
      //   setOrders(prev => [...prev, ...data]);
      // }
      
      // 判断是否还有更多数据（如果返回的数量小于pageSize，说明没有更多了）
      setHasMore(data.length >= filter.pageSize!);
      setError(null);
    } catch (err) {
      setError(t('userOrders.fetchFailed'));
      console.error('获取用户订单失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载第一页数据
  useEffect(() => {
    fetchOrders(1);
  }, [ userId ] );
  
  // 组件挂载时加载数据
  useEffect(() => {
    fetchOrders(1);
  
    // 监听订单刷新事件
    const unsubscribe = onOrderRefresh(() => {
      fetchOrders(1);
    });
  
    return unsubscribe; // 组件卸载时取消订阅
  }, []);

  // 加载更多数据
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOrders(nextPage);
    }
  };

  // 点击订单项进入详情
  const handleOrderPress = (order: MarginCargo) => {
    // 导航到订单详情页（假设路由名为'OrderDetail'）
    navigation.navigate('OrderDetail', { orderId: order.id });
    console.log('点击订单:', order.id);
  };

  // 渲染空状态
  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{error || t('userOrders.noOrders')}</Text>
      </View>
    );
  };

  // 渲染加载更多指示器
  const renderFooter = () => {
    if (!hasMore || !loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#1677ff" />
        <Text style={styles.loadingText}>{t('userOrders.loadingMore')}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={() => onPress(order)}>
      {/* 复用发布大厅的卡片样式，保持一致的圆角和阴影 */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          {/* 第一行：运输路线（始发地→目的地） */}
          <View style={styles.routeContainer}>
            {/* 始发地 */}
            <View style={styles.locationWrapper}>
              <MaterialIcons name="location-on" size={18} color="#ff4d4f" style={styles.locationIcon} />
              <Text style={styles.locationText}>{order.origin_location}</Text>
              {order.origin_code && (
                <Text style={styles.locationCode}>{order.origin_code}</Text>
              )}
            </View>

            {/* 方向箭头（与发布大厅保持一致的图标） */}
            <View style={styles.arrowWrapper}>
              <MaterialIcons name="arrow-right-alt" size={20} color="#999" />
            </View>

            {/* 目的地 */}
            <View style={styles.locationWrapper}>
              <MaterialIcons name="location-on" size={18} color="#1890ff" style={styles.locationIcon} />
              <Text style={styles.locationText}>{order.destination_location}</Text>
              {order.destination_code && (
                <Text style={styles.locationCode}>{order.destination_code}</Text>
              )}
            </View>
          </View>

          {/* 第二行：价格和状态 */}
          <View style={styles.infoRow}>
            {/* 价格信息（突出显示，与发布大厅价格样式一致） */}
            <View style={styles.priceWrapper}>
              <Text style={styles.priceLabel}>{t('publish.price')}：</Text>
              <Text style={styles.priceValue}>${order.price}</Text>
            </View>

            {/* 状态标签（带背景色，与发布大厅状态样式统一） */}
            <View style={[styles.statusWrapper, { backgroundColor: status.bgColor }]}>
              <MaterialIcons name={status.icon as keyof typeof MaterialIcons.glyphMap} size={16} color={status.textColor} />
              <Text style={[styles.statusText, { color: status.textColor }]}>
                {status.label}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // 卡片样式与发布大厅保持一致
  card: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 0, // 去掉默认边框，更接近发布大厅风格
  },
  cardContent: {
    padding: 16,
  },

  // 运输路线布局
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  locationCode: {
    fontSize: 12,
    color: '#999',
    marginLeft: 6,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  arrowWrapper: {
    paddingHorizontal: 8,
  },

  // 价格和状态行
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1677ff', // 与发布大厅价格颜色一致
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});