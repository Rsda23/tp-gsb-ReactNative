import * as React from 'react';
import { useRouter } from 'expo-router';
import { register } from '../../lib/auth';
import { collection, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';

type RegisterState = {
  fullName: string;
  email: string;
  password: string;
  department: string;
  role: string;
  avatarUrl: string;
  error: string | null;
};

function RegisterWrapper() {
  const router = useRouter();
  return <Register router={router} />;
}

type Props = {
  router: ReturnType<typeof useRouter>;
};

class Register extends React.Component<Props, RegisterState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fullName: '',
      email: '',
      password: '',
      department: '',
      role: 'employee',
      avatarUrl: '',
      error: null
    };
  }

  handleFormChange = (name: keyof RegisterState, value: string): void => {
    this.setState({ [name]: value } as any);
  };

  handleSubmit = async (): Promise<void> => {
    const { fullName, email, password, department, role, avatarUrl } = this.state;

    try {
      const userCredential = await register(email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(collection(db, 'users'), uid), {
        fullName,
        email,
        department,
        role,
        avatarUrl: avatarUrl || null,
        createdAt: serverTimestamp(),
        lastLogin: null
      });

      this.setState({ error: null });
      this.props.router.push('/auth/login');
    } catch (error) {
      this.setState({ error: "Erreur lors de l'inscription. Vérifie les informations." });
      console.error(error);
    }
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Inscription</Text>

        {this.state.error && (
          <Text style={styles.error}>{this.state.error}</Text>
        )}

        <Text>Nom complet</Text>
        <TextInput style={styles.input} placeholder="Nom Prénom" value={this.state.fullName} onChangeText={(text) => this.handleFormChange('fullName', text)}/>

        <Text>Département</Text>
        <TextInput style={styles.input} placeholder="Department" value={this.state.department} onChangeText={(text) => this.handleFormChange('department', text)}/>

        <Text>Rôle</Text>
        <View style={styles.pickerWrapper}>
        <Picker selectedValue={this.state.role} onValueChange={(itemValue) => this.handleFormChange('role', itemValue)} style={styles.picker}>
            <Picker.Item label="Employé" value="employee" />
            <Picker.Item label="Support" value="support" />
            <Picker.Item label="Administrateur" value="admin" />
        </Picker>
        </View>

        <Text>Email</Text>
        <TextInput style={styles.input} placeholder="Email Address" keyboardType="email-address" value={this.state.email} onChangeText={(text) => this.handleFormChange('email', text)}/>

        <Text>Mot de passe</Text>
        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={this.state.password} onChangeText={(text) => this.handleFormChange('password', text)}/>

        <Text>Avatar (URL, optionnel)</Text>
        <TextInput style={styles.input} placeholder="https://..." value={this.state.avatarUrl} onChangeText={(text) => this.handleFormChange('avatarUrl', text)}/>

        <View style={styles.button}>
          <Button title="Inscription" onPress={this.handleSubmit} />
        </View>

        <View style={styles.button}>
          <Button title="Déjà inscrit ? Se connecter" onPress={() => this.props.router.push('/auth/login')} color="#6b7280"/>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
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
    textAlign: 'center',
    marginBottom: 20
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
    marginVertical: 10
  },
  error: 
  {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  },
  pickerWrapper: 
  {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },

  picker: 
  {
    height: 50,
    paddingHorizontal: 10,
  }
});

export default RegisterWrapper;
