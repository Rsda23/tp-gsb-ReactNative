import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserInfo(docSnap.data());
        }
      } else {
        router.replace('/auth/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.replace('/auth/login');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      {userInfo ? (
        <View style={styles.card}>
          <Text style={styles.label}>Nom :</Text>
          <Text>{userInfo.fullName}</Text>

          <Text style={styles.label}>Email :</Text>
          <Text>{userInfo.email}</Text>

          <Text style={styles.label}>Rôle :</Text>
          <Text>{userInfo.role}</Text>

          <Text style={styles.label}>Département :</Text>
          <Text>{userInfo.department}</Text>

          {userInfo.avatarUrl ? (
            <Text style={styles.label}>Avatar : {userInfo.avatarUrl}</Text>
          ) : null}
        </View>
      ) : (
        <Text>Aucune information utilisateur disponible</Text>
      )}

      <View style={styles.logoutBtn}>
        <Button title="Se déconnecter" onPress={handleLogout} color="#c0392b" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: 
  {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1
  },
  title: 
  {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  card: 
  {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30
  },
  label: 
  {
    fontWeight: 'bold',
    marginTop: 10
  },
  logoutBtn: 
  {
    marginTop: 20
  }
});