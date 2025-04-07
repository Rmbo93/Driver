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

export default function RiderSignUp() {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [maxPassengers, setMaxPassengers] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dismissKeyboard = () => Keyboard.dismiss();

  const showToast = (message: string) => {
    Platform.OS === 'android'
      ? ToastAndroid.show(message, ToastAndroid.SHORT)
      : Alert.alert(message);
  };

  const handleSignUp = async () => {
    if (!fullName || !mobile || !password || !confirmPassword) {
      return showToast('Please fill all required fields');
    }
    if (!/^[0-9]{8}$/.test(mobile)) {
      return showToast('Mobile must be 8 digits');
    }
    if (password !== confirmPassword) {
      return showToast('Passwords do not match');
    }
    if (password.length < 8) {
      return showToast('Password too short');
    }

    const riderData = {
      fullName,
      phoneNumber: mobile,
      password,
      emergencyContact,
      vehicleType,
      plateNumber,
      vehicleColor,
      vehicleBrand,
      vehicleModel,
      fuelType,
      maxPassengers: parseInt(maxPassengers),
    };

    try {
      const res = await fetch('http://192.168.11.66:5000/api/riders/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(riderData),
      });

      const result = await res.json();
      if (!res.ok || !result) return showToast(result.message || 'Signup failed');

      await AsyncStorage.setItem('riderToken', result.token);
      showToast('Registration successful');
      router.push('/');
    } catch (err) {
      console.log(err);
      showToast('Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
          <View style={styles.container}>
            <Text style={styles.title}>Register as Rider</Text>

            {[{ val: fullName, set: setFullName, icon: 'person', placeholder: 'Full Name' },
              { val: mobile, set: setMobile, icon: 'device-mobile', placeholder: 'Mobile Number', keyboardType: 'numeric' },
              { val: emergencyContact, set: setEmergencyContact, icon: 'device-mobile', placeholder: 'Emergency Contact', keyboardType: 'numeric' },
              { val: vehicleType, set: setVehicleType, icon: 'gear', placeholder: 'Vehicle Type (car/motorbike/bicycle)' },
              { val: plateNumber, set: setPlateNumber, icon: 'number', placeholder: 'Plate Number' },
              { val: vehicleColor, set: setVehicleColor, icon: 'person', placeholder: 'Vehicle Color' },
              { val: vehicleBrand, set: setVehicleBrand, icon: 'tools', placeholder: 'Vehicle Brand' },
              { val: vehicleModel, set: setVehicleModel, icon: 'tools', placeholder: 'Vehicle Model' },
              { val: fuelType, set: setFuelType, icon: 'flame', placeholder: 'Fuel Type' },
              { val: maxPassengers, set: setMaxPassengers, icon: 'people', placeholder: 'Max Passengers', keyboardType: 'numeric' },
              { val: password, set: setPassword, icon: 'lock', placeholder: 'Password', secure: true },
              { val: confirmPassword, set: setConfirmPassword, icon: 'lock', placeholder: 'Confirm Password', secure: true }
            ].map((field, index) => (
              <View style={styles.formInputWrapper} key={index}>
                <Octicons name={field.icon as any} size={20} color="#808080" />
                <TextInput
                  style={styles.input}
                  value={field.val}
                  onChangeText={field.set}
                  placeholder={field.placeholder}
                  placeholderTextColor="black"
                  keyboardType={ field.keyboardType as any || 'default'}
                  secureTextEntry={field.secure || false}
                />
              </View>
            ))}

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
    marginBottom: 40,
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
