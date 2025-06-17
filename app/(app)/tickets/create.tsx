import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { getAuth } from 'firebase/auth';

export default function CreateTicketScreen() {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('hardware');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [location, setLocation] = useState('');
    const [deviceModel, setDeviceModel] = useState('');
    const [deviceOS, setDeviceOS] = useState('');
    const [deviceVersion, setDeviceVersion] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title || !description) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs requis.');
            return;
        }
        try {
            setLoading(true);
            const user = getAuth().currentUser;

            await addDoc(collection(db, 'tickets'),
                {
                    title,
                    description,
                    status: 'new',
                    priority,
                    category,
                    createdBy: user?.uid ?? 'anonymous',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    dueDate: dueDate ? new Date(dueDate) : null,
                    location: location || null,
                    deviceInfo:
                    {
                        model: deviceModel || null,
                        os: deviceOS || null,
                        version: deviceVersion || null
                    }
                });


            Alert.alert('Succès', 'Ticket créé avec succès');
            router.push('/tickets');
        }
        catch (error) {
            console.error(error);
            Alert.alert('Erreur', "Impossible de créer le ticket.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Nouveau ticket</Text>

            <Text>Titre</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />

            <Text>Description</Text>
            <TextInput style={[styles.input, { height: 100 }]} placeholder="Détaillez ici..." multiline value={description} onChangeText={setDescription} />

            <Text>Catégorie</Text>
            <View style={styles.pickerWrapper}>
                <Picker selectedValue={category} onValueChange={setCategory}>
                    <Picker.Item label="Matériel" value="hardware" />
                    <Picker.Item label="Logiciel" value="software" />
                    <Picker.Item label="Réseau" value="network" />
                    <Picker.Item label="Accès" value="access" />
                    <Picker.Item label="Autre" value="other" />
                </Picker>
            </View>

            <Text>Priorité</Text>
            <View style={styles.pickerWrapper}>
                <Picker selectedValue={priority} onValueChange={setPriority}>
                    <Picker.Item label="Faible" value="low" />
                    <Picker.Item label="Moyenne" value="medium" />
                    <Picker.Item label="Élevée" value="high" />
                    <Picker.Item label="Critique" value="critical" />
                </Picker>
            </View>

            <Text>Éché  ance (yyyy-mm-dd)</Text>
            <TextInput style={styles.input} value={dueDate} onChangeText={setDueDate} />

            <Text>Localisation (optionnel)</Text>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} />

            <Text>Modèle de l'appareil</Text>
            <TextInput style={styles.input} value={deviceModel} onChangeText={setDeviceModel} />

            <Text>Système d'exploitation</Text>
            <TextInput style={styles.input} value={deviceOS} onChangeText={setDeviceOS} />

            <Text>Version</Text>
            <TextInput style={styles.input} value={deviceVersion} onChangeText={setDeviceVersion} />

            <View style={styles.button}>
                <Button title={loading ? 'Création...' : 'Créer le ticket'} onPress={handleSubmit} disabled={loading} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create(
    {
        container:
        {
            padding: 20,
            backgroundColor: '#fff',
            flexGrow: 1
        },
        title:
        {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center'
        },
        input:
        {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 10,
            marginBottom: 15
        },
        button:
        {
            marginTop: 20
        },
        pickerWrapper:
        {
            borderWidth: 1,
            borderColor: '#ccc',
            backgroundColor: '#fff',
            borderRadius: 12,
            marginBottom: 15,
            overflow: 'hidden',
            height: 48,
            justifyContent: 'center',
            paddingHorizontal: 10
        }
    });
