import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function TabsLayout() { // ✅ تم تصحيح الخطأ بإزالة التكرار
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        router.replace('/'); // إعادة توجيه المستخدم إلى تسجيل الدخول إذا لم يكن مسجلًا
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // لا يتم تحميل `Tabs` إذا لم يكن المستخدم مسجلًا
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0077B6",
        headerStyle: { backgroundColor: "#000000" },
        headerShadowVisible: false,
        tabBarBadgeStyle: { backgroundColor: "#000000" },
        headerTintColor: "#fff",
        tabBarLabelStyle: { color: 'black' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "home-sharp" : "home-outline"} color={"black"} size={30} />
          ),
        }}
      />
      <Tabs.Screen
        name="Services"
        options={{
          headerTitle: "Service",
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "apps" : "apps-outline"} color={"black"} size={30} />
          ),
        }}
      />
      <Tabs.Screen
        name="Activity"
        options={{
          headerTitle: "Activity",
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "reader" : "reader-outline"} color={"black"} size={30} />
          ),
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          headerTitle: "Account",
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} color={"black"} size={30} />
          ),
        }}
      />
    </Tabs>
  );
}
