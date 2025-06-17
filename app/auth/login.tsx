import * as React from 'react';
import { useRouter } from 'expo-router';
import { login } from '../../lib/auth';
import {View, Text, TextInput, Button, StyleSheet, ScrollView} from 'react-native';

type LoginState = {
  email: string;
  password: string;
  error: string | null;
};

function LoginWrapper() {
  const router = useRouter();
  return <Login router={router} />;
}

type Props = {
  router: ReturnType<typeof useRouter>;
};

class Login extends React.Component<Props, LoginState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null
    };
  }

  handleFormChange = (name: keyof LoginState, value: string): void => {
    this.setState({ [name]: value } as any);
  };

  handleSubmit = async (): Promise<void> => {
    const { email, password } = this.state;

    try {
      await login(email, password);
      this.setState({ error: null });
      this.props.router.push('/(app)');
    } catch (err) {
      this.setState({ error: 'Email ou mot de passe invalide.' });
    }
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Connexion</Text>

        {this.state.error && (
          <Text style={styles.error}>{this.state.error}</Text>
        )}

        <Text>Email</Text>
        <TextInput style={styles.input} placeholder="Email Address" keyboardType="email-address" value={this.state.email} onChangeText={(text) => this.handleFormChange('email', text)}/>

        <Text>Mot de passe</Text>
        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={this.state.password} onChangeText={(text) => this.handleFormChange('password', text)}/>

        <View style={styles.button}>
          <Button title="Se connecter" onPress={this.handleSubmit} />
        </View>

        <View style={styles.button}>
          <Button title="Créer un compte" onPress={() => this.props.router.push('/auth/register')} color="#6b7280"/>
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
  }
});

export default LoginWrapper;