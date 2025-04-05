import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

export default function UploadDocuments() {
  const [images, setImages] = useState({
    profileImage: null,
    vehicleImage: null,
    insuranceImage: null,
    licenseImage: null,
    mechanicImage: null,
    contractImage: null,
  });

  const pickImage = async (field: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages({ ...images, [field]: result.assets[0].uri });
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();

    Object.entries(images).forEach(([key, uri]) => {
      if (uri) {
        formData.append(key, {
          uri,
          name: `${key}.jpg`,
          type: 'image/jpeg',
        }as any);
      }
    });

    try {
      const res = await fetch('http://192.168.11.66:5000/api/riders/upload-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) return Alert.alert('Error', result.message || 'Upload failed');

      Alert.alert('Success', 'Documents uploaded successfully');
      router.push('/home');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upload Required Documents</Text>

      {Object.entries(images).map(([key, uri]) => (
        <View key={key} style={styles.uploadBox}>
          <TouchableOpacity onPress={() => pickImage(key)} style={styles.uploadButton}>
            <Text style={styles.uploadText}>{key.replace(/([A-Z])/g, ' $1')}</Text>
          </TouchableOpacity>
          {uri && <Image source={{ uri }} style={styles.imagePreview} />}
        </View>
      ))}

      <TouchableOpacity onPress={handleUpload} style={styles.submitButton}>
        <Text style={styles.submitText}>Submit Documents</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  uploadBox: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  uploadText: {
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  imagePreview: {
    width: 200,
    height: 120,
    marginTop: 10,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
