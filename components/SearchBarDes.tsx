import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { GOOGLE_MAPS_API_KEY } from '@/config';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

interface SearchBarDesProps {
  onPlaceSelected: (location: { latitude: number; longitude: number }) => void;
}

export default function SearchBarDes({ onPlaceSelected }: SearchBarDesProps) {
  return (
    <GooglePlacesAutocomplete
      styles={inputBoxStyles}
      placeholder="Where to?"
      nearbyPlacesAPI="GooglePlacesSearch"
      debounce={400}
      query={{
        key: GOOGLE_MAPS_API_KEY,
        language: 'en',
      }}
      fetchDetails={true}
      minLength={2}
      enablePoweredByContainer={false}
      onPress={(data, details = null) => {
        if (details) {
          const location = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          };
          onPlaceSelected(location);
        }
      }}
    />
  );
}

const inputBoxStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: 10,
    flex: 0,
  },
  textInput: {
    fontSize: 18,
    backgroundColor: '#DDDDDD20',
    borderWidth: 1,
    borderRadius: 50,
  },
  textInputContainer: {
    paddingBottom: 0,
  },
});
