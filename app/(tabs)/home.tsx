import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [isOnline, setIsOnline] = useState(false);
  const [ridePreferences, setRidePreferences] = useState({
    vip: false,
    okonomi: false,
  });

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission for push notifications was denied');
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const expoPushToken = tokenData.data;
      console.log('📱 Expo Push Token:', expoPushToken);

      await AsyncStorage.setItem('expoPushToken', expoPushToken);
      const riderToken = await AsyncStorage.getItem('riderToken');
      if (!riderToken) return;

      await fetch('http://192.168.11.66:5000/api/riders/save-token', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${riderToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expoPushToken }),
      });
    } catch (error) {
      console.error('❌ Notification setup failed:', error);
    }
  };

  const togglePreference = async (type: 'vip' | 'okonomi') => {
    const updated = {
      ...ridePreferences,
      [type]: !ridePreferences[type],
    };
    setRidePreferences(updated);
  
    const selected = Object.entries(updated)
      .filter(([_, v]) => v)
      .map(([k]) => k.toUpperCase()); // Expo server يحتاج VIP بصيغة كبيرة
  
    const riderToken = await AsyncStorage.getItem('riderToken');
    if (!riderToken) return;
  
    await fetch('http://192.168.11.66:5000/api/riders/update-preferences', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${riderToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ridePreferences: selected }),
    });
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <View style={styles.container}>
        <Text style={styles.header}>Welcome, Driver</Text>

        <View style={styles.statusRow}>
          <MaterialCommunityIcons
            name={isOnline ? 'check-circle-outline' : 'close-circle-outline'}
            size={24}
            color={isOnline ? 'green' : 'gray'}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.statusText}>{isOnline ? 'You are Online' : 'You are Offline'}</Text>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: '#ccc', true: '#4cd137' }}
            thumbColor="#fff"
          />
        </View>

        <Text style={styles.sectionTitle}>Select Ride Preferences</Text>
        <View style={styles.prefRow}>
          <TouchableOpacity
            style={[styles.prefButton, ridePreferences.vip && styles.prefSelected]}
            onPress={() => togglePreference('vip')}
          >
            <MaterialCommunityIcons name="star-circle" size={24} color="#333" />
            <Text style={styles.prefText}>VIP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.prefButton, ridePreferences.okonomi && styles.prefSelected]}
            onPress={() => togglePreference('okonomi')}
          >
            <MaterialCommunityIcons name="car-estate" size={24} color="#333" />
            <Text style={styles.prefText}>Okonomi</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Current Settings:</Text>
          <Text style={styles.summaryText}>Status: {isOnline ? 'Online' : 'Offline'}</Text>
          <Text style={styles.summaryText}>
            Preferences: {ridePreferences.vip ? 'VIP ' : ''}
            {ridePreferences.okonomi ? 'Okonomi' : ''}
            {!ridePreferences.vip && !ridePreferences.okonomi && 'None'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#222',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusText: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  prefButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  prefSelected: {
    borderColor: '#000',
    backgroundColor: '#e0e0e0',
  },
  prefText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  summaryBox: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 16,
    color: '#555',
  },
});
