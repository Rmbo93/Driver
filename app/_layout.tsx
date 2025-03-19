import { Stack } from 'expo-router';
import { View, Text } from 'react-native'
import React, { Component } from 'react'
import signIn from '@/components/signIn';
import signUp from '@/components/signUp';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

export default function _layout() {
  return (
    <Stack>  
       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
       <Stack.Screen name="+not-found" />
    


       </Stack> 
  )
}