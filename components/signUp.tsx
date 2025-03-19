import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import Ripple from 'react-native-material-ripple';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateAccount() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const handleSignUp = async () => {
    if (!firstName.trim() || !lastName.trim() || !mobile.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      showToast('All fields are required except email.');
      return;
    }

    if (!/^[0-9]{8}$/.test(mobile)) {
      showToast('Mobile number must be exactly 8 digits.');
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      showToast('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      showToast('Password must be at least 8 characters long');
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Invalid email format.');
      return;
    }

    try {
      const requestBody: Record<string, string> = {
        firstName,
        lastName,
        mobile,
        password,
      };

      if (email.trim()) {
        requestBody.email = email;
      }

      const response = await fetch('http://192.168.11.66:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log('✅ Server Response:', result);

      if (!response.ok) {
        showToast(result.error || 'Signup Failed');
        return;
      }

      if (!result.token) {
        showToast('No token received from server');
        return;
      }

      await AsyncStorage.setItem('userToken', result.token);
      showToast('Account created successfully');
      router.push('/');

    } catch (err: unknown) {
      console.error('Signup Error:', err);
      showToast('An error occurred. Please try again later.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>Hello! Register to get started</Text>

            <View style={styles.formInputWrapper}>
              <Octicons name="person" size={20} color="#808080" />
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                placeholderTextColor="black"
              />
            </View>

            <View style={styles.formInputWrapper}>
              <Octicons name="person" size={20} color="#808080" />
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                placeholderTextColor="black"
              />
            </View>

            <View style={styles.formInputWrapper}>
              <Octicons name="device-mobile" size={20} color="#808080" />
              <TextInput
                style={styles.input}
                value={mobile}
                onChangeText={setMobile}
                placeholder="Mobile Number"
                placeholderTextColor="black"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formInputWrapper}>
              <Octicons name="mail" size={20} color="#808080" />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address (Optional)"
                placeholderTextColor="black"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.formInputWrapper}>
              <Octicons name="lock" size={20} color="#808080" />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Password"
                placeholderTextColor="black"
              />
            </View>

            <View style={styles.formInputWrapper}>
              <Octicons name="lock" size={20} color="#808080" />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirm Password"
                placeholderTextColor="black"
              />
            </View>

            <Ripple
              rippleColor="rgb(0, 0, 0)"
              rippleOpacity={0.5}
              rippleDuration={300}
              rippleCentered={true}
              rippleFades={false}
              rippleContainerBorderRadius={20}
              style={styles.signUpButton}
              onPress={handleSignUp}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </Ripple>

            <TouchableOpacity style={styles.backToSignIn} onPress={() => router.push('/')}>
              <Text style={styles.backToSignInText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 60,
  },
  formInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9f9',
    borderRadius: 2,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
    height: 50,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    color: '#000',
    textAlign: 'left',
  },
  signUpButton: {
    backgroundColor: '#000',
    width: '100%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backToSignIn: {
    marginTop: 20,
    padding: 10,
  },
  backToSignInText: {
    color: 'black',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
