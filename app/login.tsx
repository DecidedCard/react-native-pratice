import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login as kakaoLogin, me } from "@react-native-kakao/user";
import { Redirect } from "expo-router";
import { useContext, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "./_layout";

export default function Login() {
  const insets = useSafeAreaInsets();
  const { user, login } = useContext(AuthContext);
  const isLoggedIn = !!user;

  useEffect(() => {
    initializeKakaoSDK("11c6efe3d3f6f998dd715b0bc165ce8a");
  }, []);

  const onKakaoLogin = async () => {
    const result = await kakaoLogin();
    console.log(result);
    const user = await me();
    console.log(user);
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
      <Pressable
        onPress={login}
        style={[styles.loginButton, styles.appleLoginButton]}
      >
        <Text style={styles.loginButtonText}>Apple Login</Text>
      </Pressable>
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
