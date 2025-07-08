import { FreightFilter, getUserFreightOrders } from '@/api/freight';
import { MarginCargo } from '@/components/FindList';
import OrderItem from '@/components/OrderItem';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/models/orders';
import { onOrderRefresh } from '@/utils/eventBus';
import { useNavigation } from 'expo-router';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

// 类型适配：确保MarginCargo与Order兼容（如果需要）
type AdaptedOrder = Order & MarginCargo;

export default function OrderList() {
  const navigation = useNavigation();
  const { user } = useAuth(); // 从全局状态获取当前用户

  // 状态管理（列表数据、加载状态、分页）
  const [orders, setOrders] = useState<AdaptedOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // 筛选条件（分页+状态筛选）
  const filter: FreightFilter = {
    pageSize: 10, // 每页10条
    // status: 1, // 可根据需求添加状态筛选
  };

  // 从API获取订单数据
  const fetchOrders = async (currentPage: number) => {
    if (!user?.id) {
      setError(t('userOrders.noUserId'));
      setLoading(false);
      return;
    }

    try {
      setLoading(currentPage === 1); // 第一页加载时显示全屏loading

      // 调用API获取用户订单（带分页）
      const data = await getUserFreightOrders(user.id, { 
        ...filter, 
        page: currentPage 
      });
      if ( !data )
      {
        return
      }
      // 适配类型（如果MarginCargo与Order字段一致，可直接赋值）
      const adaptedData = data as AdaptedOrder[];

      // 分页逻辑：第一页替换数据，后续页追加
      if (currentPage === 1) {
        setOrders(adaptedData);
      } else {
        setOrders(prev => [...prev, ...adaptedData]);
      }

      // 判断是否还有更多数据
      setHasMore(adaptedData.length >= filter.pageSize!);
      setError(null);
    } catch (err) {
      setError(t('userOrders.fetchFailed'));
      console.error('获取订单失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载第一页数据
  useEffect(() => {
    if (user?.id) {
      fetchOrders(1);
    }
  }, [user?.id]); // 用户ID变化时重新加载

  // 监听订单刷新事件（如接单/完成订单后）
  useEffect(() => {
    const unsubscribe = onOrderRefresh(() => {
      setPage(1); // 重置到第一页
      fetchOrders(1); // 重新加载数据
    });
    return unsubscribe; // 组件卸载时取消订阅
  }, []);

  // 加载更多数据（滚动到底部触发）
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOrders(nextPage);
    }
  };

  // 打开订单详情
  const openDetail = (order: AdaptedOrder) => {
    navigation.navigate('profile/orders/detail/[orderId]', { 
      orderId: order.id
    });
  };

  // 渲染单个订单
  const renderOrderItem = ({ item }: { item: AdaptedOrder }) => (
    <OrderItem 
      key={item.id} 
      order={item} 
      onPress={openDetail} 
    />
  );

  // 渲染空状态/错误状态
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
    <View style={styles.container}>
      {loading && page === 1 ? (
        // 第一页加载时显示全屏loading
        <View style={styles.fullLoading}>
          <ActivityIndicator size="large" color="#1677ff" />
          <Text style={styles.loadingText}>{t('loading')}</Text>
        </View>
      ) : (
        <FlatList<AdaptedOrder>
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2} // 滚动到距离底部20%时触发加载更多
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  fullLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
});