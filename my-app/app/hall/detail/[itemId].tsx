import { emitOrderRefresh } from '@/utils/eventBus';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { t } from 'i18next';
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
  price: string;
};

// 模拟货物详情数据
const mockCargoDetail: CargoDetail = {
  id: '1',
  origin: 'Shanghai, China',
  destination: 'New York, USA',
  type: 'Electronic products',
  remark: 'This is a long remark, used to test the ellipsis display...',
  contact: '13800138000',
  email: 'cargo@example.com',
  price: '$300'
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
      // 模拟接单API请求
      // await fetch(`https://api.example.com/cargos/${route.params.cargoId}/accept`, {
      //   method: 'POST',
      // });

      
      // 显示成功提示
      Alert.alert(
        `${t('hallDetail.success')}`,
        `${t('hallDetail.successTips')}`,
        [
          {
            text:  `${t('hallDetail.enter')}`,
            onPress: () => {
              setIsAccepted( true );
              // 触发刷新事件
              emitOrderRefresh();
              // 返回上一页
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error(`${t('hallDetail.error')}`, error);
      Alert.alert(`${t('hallDetail.error')}`, error.message || `${t('hallDetail.tryAgain')}`);
    } finally {
      setLoading(false);
    }
    // router.push(`/profile/${itemId}`);
  };

  // 模拟接单API
  const acceptOrderApi = async (itemId: any) => {
    // 实际项目中这里应该调用后端API
    console.log(itemId)
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <View style={styles.container}>
      <Text style={ styles.title }>{ t( 'hallDetail.cargoDetails' ) }</Text>

      <View style={styles.infoSection}>
        <Text style={styles.label}>{ t( 'hallDetail.origin' ) }</Text>
        <Text style={styles.value}>{cargo.origin}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>{ t( 'hallDetail.destination' ) }</Text>
        <Text style={styles.value}>{cargo.destination}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>{ t( 'hallDetail.cargoType' ) }</Text>
        <Text style={styles.value}>{cargo.type}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>{ t( 'hallDetail.remarks' ) }</Text>
        <Text style={[styles.value, styles.remark]}>
          {cargo.remark.length > 30 
            ? `${cargo.remark.slice(0, 30)}...` 
            : cargo.remark}
        </Text>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.label}>{ t( 'publish.price' ) }</Text>
        <Text style={styles.value}>{cargo.price}</Text>
      </View>
      

      <TouchableOpacity 
        style={styles.takeOrderButton} 
        onPress={handleTakeOrder}
      >
        <Text style={styles.takeOrderText}>{ t( 'hallDetail.orders' ) }</Text>
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