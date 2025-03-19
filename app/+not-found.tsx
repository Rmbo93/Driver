import { Link, Stack } from "expo-router";

import { View, Text } from 'react-native';
import React from 'react';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "OBS! Not found page" }} />

      <View className="flex-1 justify-center items-center bg-blue-100">
        <Link
          href="/"
          className="bg-blue-500 px-6 py-3 rounded-full text-blue text-center"
        >
          Go back to home screen!
        </Link>
      </View>
    </>
  );
}
