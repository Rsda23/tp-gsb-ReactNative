import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchTicket = async () => {
      try {
        const docRef = doc(db, 'tickets', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTicket({ id: docSnap.id, ...docSnap.data() });
        } else {
          setTicket(null);
        }
      } catch (error) {
        console.error('Erreur de chargement du ticket :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Ticket introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{ticket.title}</Text>
      <Text style={styles.label}>Statut : <Text style={styles.value}>{ticket.status}</Text></Text>
      <Text style={styles.label}>Priorité : <Text style={styles.value}>{ticket.priority}</Text></Text>
      <Text style={styles.label}>Catégorie : <Text style={styles.value}>{ticket.category}</Text></Text>
      <Text style={styles.label}>Description :</Text>
      <Text style={styles.value}>{ticket.description}</Text>

      {ticket.dueDate && (
        <Text style={styles.label}>Échéance : <Text style={styles.value}>{new Date(ticket.dueDate.seconds * 1000).toLocaleDateString()}</Text></Text>
      )}

      {ticket.location && (
        <Text style={styles.label}>Localisation : <Text style={styles.value}>{ticket.location}</Text></Text>
      )}

      {ticket.deviceInfo && (
        <>
          <Text style={styles.label}>Modèle : <Text style={styles.value}>{ticket.deviceInfo.model}</Text></Text>
          <Text style={styles.label}>Système : <Text style={styles.value}>{ticket.deviceInfo.os}</Text></Text>
          <Text style={styles.label}>Version : <Text style={styles.value}>{ticket.deviceInfo.version}</Text></Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10
  },
  value: {
    fontWeight: 'normal'
  },
  error: {
    fontSize: 16,
    color: 'red'
  }
});