import {
  ASYNC_STORAGE_USER,
  SECURE_ACCESS_TOKEN,
  SECURE_REFRESH_TOKEN,
} from "@/const/storage-const";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useState } from "react";
import { Alert } from "react-native";

export const AuthContext = createContext<{
  user?: object | null;
  login?: () => void;
  logout?: () => void;
}>({});

export default function RootLayout() {
  const [user, setUser] = useState(null);

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

  return (
    <AuthContext value={{ user, login, logout }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </AuthContext>
  );
}
