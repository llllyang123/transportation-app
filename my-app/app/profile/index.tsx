import i18n from '@/i18n';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { t } from 'i18next';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function ProfileHome() {
  const router = useRouter();
  const navigation = useNavigation();

   // 跳转到设置页逻辑
   const handleGoToSettings = () => {
    router.push("/profile/settings"); // 根据实际路由调整
  };

  return (
    <ScrollView style={styles.container}>
      {/* 个人信息区域 */}
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={() => router.push('/profile/info')} // 跳转个人信息页
      >
        <Image
          source={{ uri: 'https://picsum.photos/100/100' }}
          style={styles.avatar}
          contentFit="cover"
          alt="用户头像"
        />
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{t('userInfo')}</Text>
          <Text style={styles.editProfile}>{t('userInfoTips')}</Text>
        </View>
        <FontAwesome name="angle-right" size={24} color="#888" />
      </TouchableOpacity>

      {/* 功能导航区域 */}
      <View style={styles.functionContainer}>
        <TouchableOpacity
          style={styles.functionItem}
          onPress={() => router.push('/profile/orders/list')} // 跳转订单列表
        >
          {/* <FontAwesome name="list-alt" size={24} color="#333" /> */}
          <Text style={styles.functionText}>{i18n.t('myOrders.title')}</Text>
          <FontAwesome name="angle-right" size={24} color="#888" />
        </TouchableOpacity>

        {/* 可继续扩展其他功能（收货地址、支付设置等） */}
      </View>

      {/* 最近订单 */}
      {/* <View style={styles.recentOrdersHeader}>
        <Text style={ styles.functionText }>{ t('recentOrders')}</Text>
        <TouchableOpacity onPress={() => router.push('/profile/orders/list')}>
          <Text style={styles.viewAllText}>{t('viewAll')}</Text>
        </TouchableOpacity>
      </View> */}

      <View style={styles.functionContainer}>
        <TouchableOpacity
          style={styles.functionItem}
          onPress={handleGoToSettings} 
        >
          {/* <FontAwesome name="list-alt" size={24} color="#333" /> */}
          <Text style={styles.functionText}>{ i18n.t("settings")}</Text>
          <FontAwesome name="angle-right" size={24} color="#888" />
        </TouchableOpacity>

        {/* 可继续扩展其他功能（收货地址、支付设置等） */}
      </View>
    </ScrollView>
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
  // container: {
  //   flex: 1,
  //   padding: 16,
  //   backgroundColor: "#fff",
  // },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
  },
  settingsButton: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 6,
    marginVertical: 8,
  },
  settingsButtonText: {
    fontSize: 16,
  },
});