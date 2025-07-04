import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { t } from 'i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen ()
{
  const navigation = useNavigation();
  const router = useRouter()
  return (
    <View style={styles.container}>
      {/* Banner图 */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: 'https://picsum.photos/800/300' }}
          style={styles.bannerImage}
          contentFit="cover"
          alt="首页横幅广告"
        />
      </View>

      {/* 功能按钮区域 */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/publish')}
        >
          <Text style={styles.buttonText}>{t('publish.publishButton')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/hall')}
        >
          <Text style={styles.buttonText}>{t('hall')}</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  bannerContainer: {
    height: 200,
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    flex: 1,
    margin: 10,
    height: 100,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
