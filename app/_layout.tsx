import {
  ASYNC_STORAGE_USER,
  SECURE_ACCESS_TOKEN,
  SECURE_REFRESH_TOKEN,
} from "@/const/storage-const";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";

export interface User {
  id: string;
  name: string;
  profileImageUrl: string;
  description: string;
  link?: string;
  showInstagramBadge?: boolean;
  isPrivate?: boolean;
}

export const AuthContext = createContext<{
  user?: User | null;
  login?: () => Promise<void>;
  logout?: () => Promise<void[]>;
  updateUser?: (user: User) => void;
}>({});

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ASYNC_STORAGE_USER).then((user) => {
      setUser(user ? JSON.parse(user) : null);
    });
  }, []);

  const login = () => {
    return fetch("/login", {
      method: "POST",
      body: JSON.stringify({
        username: "card",
        password: "1234",
      }),
    })
      .then((res) => {
        if (res.status >= 400) {
          return Alert.alert("Error", "Invalid credentials");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        Promise.all([
          SecureStore.setItemAsync(SECURE_ACCESS_TOKEN, data.accessToken),
          SecureStore.setItemAsync(SECURE_REFRESH_TOKEN, data.refreshToken),
          AsyncStorage.setItem(ASYNC_STORAGE_USER, JSON.stringify(data.user)),
        ]);
      })
      .catch(console.error);
  };

  const logout = () => {
    setUser(null);
    return Promise.all([
      SecureStore.setItemAsync(SECURE_ACCESS_TOKEN, ""),
      SecureStore.setItemAsync(SECURE_REFRESH_TOKEN, ""),
      AsyncStorage.setItem(ASYNC_STORAGE_USER, ""),
    ]);
  };

  const updateUser = (user: User) => {
    setUser(user);
    AsyncStorage.setItem("user", JSON.stringify(user));
  };

  return (
    <AuthContext value={{ user, login, logout, updateUser }}>
      <StatusBar style="auto" animated />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </AuthContext>
  );
}
