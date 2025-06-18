import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Picker } from '@react-native-picker/picker';

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchTicket = async () => {
      try {
        const docRef = doc(db, 'tickets', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTicket({ id: docSnap.id, ...data });
          setStatus(data.status);
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

  const handleUpdateStatus = async () => {
    if (!ticket || ticket.status === status) return;
    try {
      setSaving(true);
      const ref = doc(db, 'tickets', ticket.id);
      await updateDoc(ref, {
        status,
        updatedAt: serverTimestamp()
      });
      setTicket((prev: any) => ({ ...prev, status }));
    } catch (err) {
      console.error('Erreur mise à jour du statut :', err);
    } finally {
      setSaving(false);
    }
  };

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

  const hasStatusChanged = status !== ticket.status;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{ticket.title}</Text>

      <Text style={styles.label}>Modifier le statut :</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={status} onValueChange={(value) => setStatus(value)}>
          <Picker.Item label="Nouveau" value="new" />
          <Picker.Item label="Assigné" value="assigned" />
          <Picker.Item label="En cours" value="in-progress" />
          <Picker.Item label="Résolu" value="resolved" />
          <Picker.Item label="Clôturé" value="closed" />
        </Picker>
      </View>

      {hasStatusChanged && (
        <Button title={saving ? 'Mise à jour' : 'Enregistrer'} onPress={handleUpdateStatus} disabled={saving} />
      )}

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
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15
  }
});