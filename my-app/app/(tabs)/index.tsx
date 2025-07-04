import HomePage from '@/app/home';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
export default function HomeScreen ()
{
  const navigation = useNavigation();
  const router = useRouter()
  return (
      <HomePage></HomePage>
  );
}

