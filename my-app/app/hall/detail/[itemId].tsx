import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 货物详情类型
type CargoDetail = {
  id: string;
  origin: string;
  destination: string;
  type: string;
  remark: string;
  contact: string; // 模拟联系方式
  email: string;   // 模拟邮箱
};

// 模拟货物详情数据
const mockCargoDetail: CargoDetail = {
  id: '1',
  origin: '中国上海',
  destination: '美国纽约',
  type: '电子产品',
  remark: '这是一个很长的备注信息，用于测试省略号展示...',
  contact: '13800138000',
  email: 'cargo@example.com',
};

export default function HallDetail ()
{
  const navigation = useNavigation();
  const { itemId } = useLocalSearchParams();
  const router = useRouter();
  const cargo = mockCargoDetail; // 实际项目中应通过 itemId 接口获取
  const [ loading, setLoading ] = useState( false );
  const [isAccepted, setIsAccepted] = useState(false);


  // 接单逻辑：跳转到我的运输详情页
  const handleTakeOrder = async () =>
  {
    if (loading || isAccepted) return;
    
    setLoading( true );
    try {
      // 模拟API请求
      await acceptOrderApi(itemId); // 调用实际接单API
      
      // 显示成功提示
      Alert.alert(
        '接单成功',
        '您已成功接收此订单！',
        [
          {
            text: '确定',
            onPress: () => {
              setIsAccepted(true);
              // 返回上一页
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('接单失败', error);
      Alert.alert('接单失败', error.message || '请重试');
    } finally {
      setLoading(false);
    }
    // router.push(`/profile/${itemId}`);
  };

  // 模拟接单API
  const acceptOrderApi = async (itemId) => {
    // 实际项目中这里应该调用后端API
    console.log(itemId)
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>货物详情</Text>

      <View style={styles.infoSection}>
        <Text style={styles.label}>始发地：</Text>
        <Text style={styles.value}>{cargo.origin}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>目的地：</Text>
        <Text style={styles.value}>{cargo.destination}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>货物类型：</Text>
        <Text style={styles.value}>{cargo.type}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>备注：</Text>
        <Text style={[styles.value, styles.remark]}>
          {cargo.remark.length > 30 
            ? `${cargo.remark.slice(0, 30)}...` 
            : cargo.remark}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.takeOrderButton} 
        onPress={handleTakeOrder}
      >
        <Text style={styles.takeOrderText}>接单</Text>
      </TouchableOpacity>
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
  },
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