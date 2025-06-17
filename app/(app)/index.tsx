import { StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { logout } from '../../lib/auth';
import { Text, View } from '../../components/Themed';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (err) {
      console.error('Erreur de déconnexion :', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <View style={styles.button}>
        <Button title="Voir mes tickets" onPress={() => router.push('/tickets')} />
      </View>

      <View style={styles.button}>
        <Button title="Nouveau ticket" onPress={() => router.push('/tickets/create')} />
      </View>

      <View style={styles.button}>
        <Button title="Mon profil" onPress={() => router.push('/profile')} />
      </View>

      <View style={styles.button}>
        <Button title="Se déconnecter" onPress={handleLogout} color="#c0392b" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: 
  {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: 
  {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  separator: 
  {
    marginVertical: 30,
    height: 1,
    width: '80%'
  },
  button: 
  {
    marginVertical: 10,
    width: '100%'
  }
});
