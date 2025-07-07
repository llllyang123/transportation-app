import { completeOrder, getFreightOrderId } from '@/api/freight';
import { useAuth } from '@/context/AuthContext';
import { emitOrderRefresh } from '@/utils/eventBus';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';

// 订单详情类型
type OrderDetail = { 
  id: number;
  origin_location: string;
  origin_code: string;
  destination_location: string;
  destination_code: string;
  type: string;
  typeid: number;
  status: number;
  remark: string;
  order_date: string;
  price: string;
  isUrgent: boolean;
  hasInsurance: boolean;
  contact: string;
  email: string;
};

export default function OrderDetailScreen() {
  const navigation = useNavigation();
  const { orderId } = useLocalSearchParams(); // 从路由获取订单ID
  const [loading, setLoading] = useState(false); // 操作加载状态
  const [isAccepted, setIsAccepted] = useState(false); //  是否已接单
  const { user } = useAuth(); // 获取当前用户
  const [orderInfo, setOrderInfo] = useState<OrderDetail | undefined>(); // 订单详情
  const [error, setError] = useState<string | null>(null); // 错误信息
  const [isLoading, setIsLoading] = useState(true); // 数据加载状态

  // 加载订单详情
  useEffect(() => {
    const fetchOrderInfo = async () => {
      // 重置状态
      setIsLoading(true);
      setError(null);

      try {
        // 验证订单ID
        if (!orderId || typeof orderId !== 'string') {
          throw new Error(t('hallDetail.missingOrderId'));
        }

        const itemIdInt = Number(orderId);
        if (isNaN(itemIdInt)) {
          throw new Error(t('hallDetail.invalidOrderId'));
        }

        // 调用API获取订单详情
        const orderData = await getFreightOrderId(itemIdInt);
        if (!orderData) {
          throw new Error(t('hallDetail.orderNotFound'));
        }

        setOrderInfo(orderData);
      } catch (err) {
        console.error('获取订单详情失败:', err);
        setError(err instanceof Error ? err.message : t('hallDetail.fetchError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderInfo();
  }, [orderId]);

  // 处理接单逻辑
  const handleTakeOrder = async () => {
    // 前置校验
    if (loading || isAccepted) return;
    if (!orderInfo) {
      Alert.alert(t('error'), t('hallDetail.orderNotLoaded'));
      return;
    }
    if (!user?.id) {
      Alert.alert(t('error'), t('userNotLogin'));
      return;
    }

    setLoading(true);
    try {
      // 调用接单API（注意：这里如果是接单应该用acceptOrder，而非completeOrder）
      await completeOrder(orderInfo.id, user.id);

      // 显示成功提示
      Alert.alert(
        t('success'),
        t('orderDetail.acceptSuccess'),
        [
          {
            text: t('confirm'),
            onPress: () => {
              setIsAccepted(true);
              emitOrderRefresh(); // 通知刷新列表
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('接单失败:', error);
      Alert.alert(
        t('error'),
        error instanceof Error ? error.message : t('tryAgain')
      );
    } finally {
      setLoading(false);
    }
  };

  // 获取订单状态样式
  const getStatusStyle = () => {
    // 未加载完成时返回默认样式
    if (!orderInfo) {
      return { bg: '#f5f5f5', color: '#666', text: t('loading') };
    }

    switch (orderInfo.status) {
      case 1: // 待接单
        return { bg: '#fffbe6', color: '#faad14', text: t('hallInfo.waitingForPickup') };
      case 2: // 运输中
        return { bg: '#e6f7ff', color: '#1890ff', text: t('hallInfo.inTransit') };
      case 3: // 已完成
        return { bg: '#f6ffed', color: '#52c41a', text: t('hallInfo.completed') };
      default:
        return { bg: '#f5f5f5', color: '#666', text: t('unknown') };
    }
  };

  const statusStyle = getStatusStyle();

  // 数据加载中
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1677ff" />
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    );
  }

  // 错误状态
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryText}>{t('back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 订单信息未找到（理论上不会走到这里，因为error已处理）
  if (!orderInfo) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('orderDetail.notFound')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* 标题栏 */}
      <Text style={styles.title}>{t('hallDetail.cargoDetails')}</Text>

      {/* 订单状态卡片 */}
      <Card style={styles.statusCard}>
        <Card.Content style={styles.statusContent}>
          <MaterialIcons 
            name={orderInfo.status === 1 ? 'pending' : 
                  orderInfo.status === 2 ? 'local-shipping' : 'check-circle'} 
            size={24} 
            color={statusStyle.color} 
          />
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {statusStyle.text}
          </Text>
          
          {/* 紧急/保险标签 */}
          <View style={styles.tagsContainer}>
            {orderInfo.isUrgent && (
              <View style={styles.urgentTag}>
                <Text style={styles.tagText}>{t('hallInfo.emergency')}</Text>
              </View>
            )}
            {orderInfo.hasInsurance && (
              <View style={styles.insuranceTag}>
                <Text style={styles.tagText}>{t('hallInfo.Insurance')}</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* 订单信息卡片 */}
      <Card style={styles.infoCard}>
        <Card.Content>
          {/* 路线信息 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('hallDetail.routeInfo')}</Text>
            
            <View style={styles.routeContainer}>
              <View style={styles.locationItem}>
                <MaterialIcons name="location-on" size={18} color="#ff4d4f" />
                <Text style={styles.locationText}>{orderInfo.origin_location}</Text>
                {orderInfo.origin_code && (
                  <Text style={styles.locationCode}>{orderInfo.origin_code}</Text>
                )}
              </View>
              
              <MaterialIcons 
                name="arrow-right-alt" 
                size={20} 
                color="#999" 
                style={styles.arrowIcon} 
              />
              
              <View style={styles.locationItem}>
                <MaterialIcons name="location-on" size={18} color="#1890ff" />
                <Text style={styles.locationText}>{orderInfo.destination_location}</Text>
                {orderInfo.destination_code && (
                  <Text style={styles.locationCode}>{orderInfo.destination_code}</Text>
                )}
              </View>
            </View>
          </View>

          {/* 基本信息 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('hallDetail.basicInfo')}</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('hallDetail.cargoType')}</Text>
              <Text style={styles.value}>{orderInfo.type}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('hallDetail.orderDate')}</Text>
              <Text style={styles.value}>{orderInfo.order_date}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('publish.price')}</Text>
              <Text style={styles.priceValue}>{orderInfo.price}</Text>
            </View>
          </View>

          {/* 备注信息 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('hallDetail.remarks')}</Text>
            <Text style={styles.remarkText}>{orderInfo.remark || t('noRemark')}</Text>
          </View>

          {/* 联系方式 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('hallDetail.contactInfo')}</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('hallDetail.contact')}</Text>
              <Text style={styles.value}>{orderInfo.contact}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('hallDetail.email')}</Text>
              <Text style={styles.value}>{orderInfo.email}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* 操作按钮 */}
      {orderInfo.status === 2 && !isAccepted && (
        <TouchableOpacity
          style={[styles.actionButton, loading && styles.buttonLoading]}
          onPress={handleTakeOrder}
          disabled={loading || isAccepted}
        >
          <Text style={styles.buttonText}>
            {loading ? t('loading') : t('hallDetail.acceptOrder')}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },

  // 状态卡片样式
  statusCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
  },

  // 标签样式
  urgentTag: {
    backgroundColor: '#ff4d4f',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  insuranceTag: {
    backgroundColor: '#722ed1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#fff',
  },

  // 信息卡片样式
  infoCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  // 路线信息样式
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  locationItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 6,
  },
  locationCode: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 3,
    borderRadius: 2,
  },
  arrowIcon: {
    marginHorizontal: 8,
  },

  // 信息行样式
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    width: 100,
    fontSize: 14,
    color: '#666',
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  priceValue: {
    flex: 1,
    fontSize: 14,
    color: '#1677ff',
    fontWeight: 'bold',
  },
  remarkText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },

  // 操作按钮样式
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonLoading: {
    backgroundColor: '#91c4ff',
  },

  // 加载状态样式
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },

  // 错误状态样式
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
  },

  // 空状态样式
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});