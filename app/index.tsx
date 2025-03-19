import { View, Text,SafeAreaView,Image } from 'react-native'
import React from 'react'
import SearchBar from '@/components/SearchBar'

import 'react-native-get-random-values';
import "../global.css"
import SignIn from '@/components/signIn';

export default function index() {
  return (
      <View className="flex-1 justify-center items-center">
        
      <SignIn/>
     
      </View>
  )
}