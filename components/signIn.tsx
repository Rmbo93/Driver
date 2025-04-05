import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, MaterialIcons, Octicons } from '@expo/vector-icons';
import Ripple from 'react-native-material-ripple';
import { router } from 'expo-router';

export default function SignIn() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSignIn = async () => {
    if (!mobile.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    if (!/^[0-9]{8}$/.test(mobile)) {
      Alert.alert('Error', 'Mobile number must be exactly 8 digits');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    try {
      const response = await fetch('http://192.168.11.66:5000/api/riders/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        Alert.alert('Error', result.error || 'Login failed');
        return;
      }

      if (!result.token) {
        Alert.alert('Error', 'No token received from server');
        return;
      }

      await AsyncStorage.setItem('riderToken', result.token);
      Alert.alert('Success', 'Sign-in successful');
      router.push('/home');

    } catch (err) {
      console.error('❌ Fetch Error:', err);
      Alert.alert('Error', 'Network issue, try again later.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text style={styles.title}>RIDER PANEL</Text>

        <View style={styles.formInputWrapper}>
          <Octicons name="device-mobile" size={20} color="#808080" />
          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            placeholder="Phone Number"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formInputWrapper}>
          <Octicons name="shield-lock" size={20} color="#808080" />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#ccc"
          />
        </View>

        <Ripple
          rippleColor="rgb(0, 0, 0)"
          rippleOpacity={0.5}
          rippleDuration={300}
          rippleCentered={true}
          rippleFades={false}
          rippleContainerBorderRadius={20}
          style={styles.login}
          onPress={handleSignIn}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </Ripple>

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => router.push('/Auth/CreateAccount')}
        >
          <Text style={styles.createAccountText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  formInputWrapper: {
    width: '100%',
    height: 55,
    backgroundColor: '#f8f9f9',
    borderWidth: 1,
    borderColor: '#DCDCDC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    color: '#000',
    textAlign: 'left',
  },
  login: {
    padding: 15,
    backgroundColor: '#000000',
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  createAccountButton: {
    padding: 10,
    marginTop: 15,
  },
  createAccountText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
