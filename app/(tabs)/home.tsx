import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import TaxiOrderScreen from '../Order/OrderTaxi';

TaxiOrderScreen
export default function Services() {

  const [address, setAddress] = useState('Fetching location...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setAddress('Location permission denied');
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        let reverseGeocode = await Location.reverseGeocodeAsync(location.coords);

        if (reverseGeocode.length > 0) {
          let addr = reverseGeocode[0];

          let street = addr.street || 'Unknown Street';
          let city = addr.city || 'Unknown City';
          let postalCode = addr.postalCode || 'No Postal Code';
          let country = addr.country || 'Unknown Country';

          setAddress(` ${street}, ${postalCode}, ${city}, ${country}`);
        } else {
          setAddress('Location Not Found');
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        setAddress('Error retrieving location');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Services</Text>

      {/* Address Section - Shows Real Address */}
      <TouchableOpacity style={styles.addressContainer} onPress={() => console.log('Change Address')}>
        {loading ? (
          <ActivityIndicator size="small" color="#374151" />
        ) : (
          <Text style={styles.addressText}>📍 {address}</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Go Anywhere</Text>
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.serviceCard} onPress={() => router.push('/Order/OrderTaxi')}>
          <Image source={require('../../assets/images/istockphoto-1675979127-2048x2048.jpg')} style={styles.icon} />
          <Text style={styles.label}>Order Taxi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.serviceCard} onPress={() => router.push('../../components/OrderTaxi')}>
          <Image source={require('../../assets/images/istockphoto-1675979127-2048x2048.jpg')} style={styles.icon} />
          <Text style={styles.label}>LEB/JOR Taxi</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Get Anything Delivered</Text>
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.serviceCard} onPress={() => router.push('/Order/orderFood')}>
          <Image source={require('../../assets/images/istockphoto-1675979127-2048x2048.jpg')} style={styles.icon} />
          <Text style={styles.label}>Order Food</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 40,
  },
  addressContainer: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    aspectRatio: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
});
