import {
  ASYNC_STORAGE_USER,
  SECURE_ACCESS_TOKEN,
  SECURE_REFRESH_TOKEN,
} from "@/const/storage-const";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Login() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isLoggedIn = false;

  const onLogin = () => {
    return fetch("/login", {
      method: "POST",
      body: JSON.stringify({
        username: "card",
        password: "1234",
      }),
    })
      .then((res) => {
        console.log("res", res.status);
        if (res.status >= 400) {
          return Alert.alert("Error", "Invalid credentials");
        }
        return res.json();
      })
      .then((data) => {
        console.log("data", data);
        Promise.all([
          SecureStore.setItemAsync(SECURE_ACCESS_TOKEN, data.accessToken),
          SecureStore.setItemAsync(SECURE_REFRESH_TOKEN, data.refreshToken),
          AsyncStorage.setItem(ASYNC_STORAGE_USER, JSON.stringify(data.user)),
        ]).then(() => router.push("/(tabs)"));
      })
      .catch(console.error);
  };

  if (isLoggedIn) {
    return <Redirect href={"/(tabs)"} />;
  }

  return (
    <View style={{ paddingTop: insets.top }}>
      <Text>Back</Text>
      <Pressable onPress={onLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 6,
    width: 100,
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
  },
});
