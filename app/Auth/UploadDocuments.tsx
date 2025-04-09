import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function UploadDocuments() {
  const [licenseImage, setLicenseImage] = useState<string | null>(null);
  const [insuranceImage, setInsuranceImage] = useState<string | null>(null);
  const [mechanicImage, setMechanicImage] = useState<string | null>(null);
  const [contractImage, setContractImage] = useState<string | null>(null);

  const pickImage = async (type: string) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert('صلاحيات مفقودة', 'يجب منح صلاحية الوصول للصور');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      switch (type) {
        case 'license': setLicenseImage(uri); break;
        case 'insurance': setInsuranceImage(uri); break;
        case 'mechanic': setMechanicImage(uri); break;
        case 'contract': setContractImage(uri); break;
      }
    }
  };

  const handleUpload = async () => {
    console.log('🧠 handleUpload called');

    const token = await AsyncStorage.getItem('riderToken');
    console.log('📦 Rider Token:', token);

    if (!token) {
      Alert.alert('خطأ', 'لم يتم العثور على التوكن');
      return;
    }

    const formData = new FormData();
    if (licenseImage)
      formData.append('licenseImage', {
        uri: licenseImage,
        name: 'license.jpg',
        type: 'image/jpg',
      } as any);
    if (insuranceImage)
      formData.append('insuranceImage', {
        uri: insuranceImage,
        name: 'insurance.jpg',
        type: 'image/jpg',
      } as any);
    if (mechanicImage)
      formData.append('mechanicImage', {
        uri: mechanicImage,
        name: 'mechanic.jpg',
        type: 'image/jpg',
      } as any);
    if (contractImage)
      formData.append('contractImage', {
        uri: contractImage,
        name: 'contract.jpg',
        type: 'image/jpg',
      } as any);

    try {
      const response = await fetch('http://192.168.11.66:5000/api/riders/upload-documents', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('📡 Server Response:', data);

      if (response.ok) {
        Alert.alert('✅ تم', 'تم رفع الوثائق بنجاح');
        router.push('/(tabs)/home')
      } else {
        Alert.alert('❌ خطأ من الخادم', data.message || 'فشل رفع الوثائق');
      }
    } catch (error) {
      console.error('❌ Upload Error:', error);
      Alert.alert('⚠️ خطأ داخلي', 'حدث خطأ أثناء رفع الملفات');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>رفع الوثائق المطلوبة</Text>

      <DocUpload label="رخصة القيادة" image={licenseImage} onPick={() => pickImage('license')} />
      <DocUpload label="تأمين المركبة" image={insuranceImage} onPick={() => pickImage('insurance')} />
      <DocUpload label="فحص الميكانيك" image={mechanicImage} onPick={() => pickImage('mechanic')} />
      <DocUpload label="عقد السائق" image={contractImage} onPick={() => pickImage('contract')} />

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.uploadText}>رفع الوثائق</Text>
      </TouchableOpacity>
    </View>
  );
}

function DocUpload({ label, image, onPick }: { label: string, image: string | null, onPick: () => void }) {
  return (
    <TouchableOpacity style={styles.docContainer} onPress={onPick}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.docPlaceholder}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  docContainer: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 150,
  },
  docPlaceholder: { fontSize: 16, color: '#555' },
  image: { width: 150, height: 150, borderRadius: 10 },
  uploadButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  uploadText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
