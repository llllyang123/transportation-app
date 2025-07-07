import { acceptOrder, getFreightOrderId } from '@/api/freight';
import { MarginCargo } from '@/components/FindList';
import { useAuth } from '@/context/AuthContext';
import { emitOrderRefresh } from '@/utils/eventBus';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HallDetail() {
  const navigation = useNavigation();
  const { itemId } = useLocalSearchParams();
  const [orderInfo, setOrderInfo] = useState<MarginCargo>();
  const [loading, setLoading] = useState(true); // 初始化为加载中状态
  const [error, setError] = useState<string | null>(null); // 错误状态
  const [isAccepted, setIsAccepted] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false); // 接单操作状态
  const { user } = useAuth();
  // 生命周期：加载订单详情
  useEffect(() => {
    // 检查itemId是否存在
    if (!itemId) {
      setError(t('hallDetail.missingOrderId'));
      setLoading(false);
      return;
    }
    
    const fetchOrderInfo = async () => {
      try {
        const itemIdInt = Number(itemId);
        const orderInfo = await getFreightOrderId(itemIdInt);
        if (!orderInfo) {
          throw new Error(t('hallDetail.orderNotFound'));
        }
        setOrderInfo(orderInfo);
      } catch (err) {
        console.error('Failed to fetch order info:', err);
        setError(err instanceof Error ? err.message : t('hallDetail.fetchError'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderInfo();
  }, [itemId]);

  // 接单逻辑
  const handleTakeOrder = async () => {
    // 防止重复点击
    if (isAccepting || isAccepted) return;
    
    setIsAccepting(true);
    try {
      // 实际接单API调用
      await acceptOrderApi(itemId);
      
      // 显示成功提示
      Alert.alert(
        t('hallDetail.success'),
        t('hallDetail.successTips'),
        [
          {
            text: t('hallDetail.enter'),
            onPress: () => {
              setIsAccepted(true);
              emitOrderRefresh(); // 通知刷新订单列表
              navigation.goBack(); // 返回上一页
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Failed to accept order:', error);
      Alert.alert(
        t('hallDetail.error'),
        error.message || t('hallDetail.tryAgain'),
        [{ text: t('hallDetail.enter') }]
      );
    } finally {
      setIsAccepting(false);
    }
  };

  // 模拟接单API（实际项目中应替换为真实API）
  const acceptOrderApi = async (itemId: number) => {
    // 检查订单ID是否有效
    console.log('userid', user.id, itemId)
    await acceptOrder(user.id, itemId)
    if (!itemId) {
      throw new Error(t('hallDetail.invalidOrderId'));
    }
    
    // 实际项目中这里应该调用后端API
    console.log("Accepting order with ID:", itemId);
    
    // 模拟API请求延迟
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  // 渲染加载状态
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>{t('hallDetail.loading')}</Text>
      </View>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
          }}
        >
          <Text style={styles.retryButtonText}>{t('hallDetail.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 渲染订单详情
  const cargo = orderInfo;
  if (!cargo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('hallDetail.orderNotFound')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('hallDetail.cargoDetails')}</Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoSection}>
          <Text style={styles.label}>{t('hallDetail.origin')}</Text>
          <Text style={styles.value}>{cargo.origin_location}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>{t('hallDetail.destination')}</Text>
          <Text style={styles.value}>{cargo.destination_location}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>{t('hallDetail.cargoType')}</Text>
          <Text style={styles.value}>{cargo.type}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>{t('hallDetail.remarks')}</Text>
          <Text style={[styles.value, styles.remark]}>
            {cargo.remark?.length > 100
              ? `${cargo.remark.slice(0, 100)}...`
              : cargo.remark}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>${t('publish.price')}</Text>
          <Text style={styles.value}>{cargo.price}</Text>
        </View>

        {/* 可以添加更多信息字段 */}
      </View>

      {/* 接单按钮 */}
      {!isAccepted && (
        <TouchableOpacity
          style={[
            styles.takeOrderButton,
            isAccepting && styles.acceptingButton,
          ]}
          onPress={handleTakeOrder}
          disabled={isAccepting}
        >
          {isAccepting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.takeOrderText}>{t('hallDetail.orders')}</Text>
          )}
        </TouchableOpacity>
      )}

      {/* 已接单状态 */}
      {isAccepted && (
        <View style={styles.acceptedContainer}>
          <Text style={styles.acceptedText}>{t('hallDetail.orderAccepted')}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoSection: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontWeight: 'bold',
    width: 100,
    color: '#666',
  },
  value: {
    flex: 1,
    color: '#333',
  },
  remark: {
    color: '#666',
    fontSize: 14,
  },
  takeOrderButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  acceptingButton: {
    backgroundColor: '#90caf9',
  },
  takeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#f44336',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  acceptedContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptedText: {
    color: '#43a047',
    fontWeight: 'bold',
  },
});