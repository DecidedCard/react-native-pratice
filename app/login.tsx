import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login as kakaoLogin, me } from "@react-native-kakao/user";
import * as AppleAuthentication from "expo-apple-authentication";
import { Redirect } from "expo-router";
import { useContext, useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "./_layout";

export default function Login() {
  const insets = useSafeAreaInsets();
  const { user, login } = useContext(AuthContext);
  const isLoggedIn = !!user;

  useEffect(() => {
    initializeKakaoSDK(process.env.EXPO_PUBLIC_KAKAO_NATIVE_KEY as string);
  }, []);

  const onKakaoLogin = async () => {
    const result = await kakaoLogin();
    console.log(result);
    const user = await me();
    console.log(user);
  };

  const onAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log("credential", credential);
    } catch (e) {
      console.error("error", e);
    }
  };

  if (isLoggedIn) {
    return <Redirect href={"/(tabs)"} />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text>Back</Text>
      <Pressable onPress={login} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>
      <Pressable
        onPress={onKakaoLogin}
        style={[styles.loginButton, styles.kakaoLoginButton]}
      >
        <Text style={[styles.loginButtonText, styles.kakaoLoginButtonText]}>
          KaKao Login
        </Text>
      </Pressable>
      {Platform.OS === "ios" && (
        <Pressable
          onPress={onAppleLogin}
          style={[styles.loginButton, styles.appleLoginButton]}
        >
          <Text style={styles.loginButtonText}>Apple Login</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "blue",
    borderRadius: 6,
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  kakaoLoginButton: {
    backgroundColor: "yellow",
  },
  appleLoginButton: {
    backgroundColor: "black",
  },
  loginButtonText: {
    color: "white",
  },
  kakaoLoginButtonText: {
    color: "black",
  },
});
