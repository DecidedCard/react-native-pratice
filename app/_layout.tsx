import {
  ASYNC_STORAGE_USER,
  SECURE_ACCESS_TOKEN,
  SECURE_REFRESH_TOKEN,
} from "@/const/storage-const";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert, Animated, StyleSheet, View } from "react-native";

SplashScreen.preventAutoHideAsync().catch(() => {});

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

function AnimatedAppLoader({
  children,
  image,
}: {
  children: React.ReactNode;
  image: number;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isSplashReady, setIsSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      Asset.loadAsync(image);
      setIsSplashReady(true);
    }
    prepare();
  }, [image]);

  const login = () => {
    return fetch("/login", {
      method: "POST",
      body: JSON.stringify({
        username: "card07",
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
    if (user) {
      AsyncStorage.setItem(ASYNC_STORAGE_USER, JSON.stringify(user));
    } else {
      AsyncStorage.removeItem(ASYNC_STORAGE_USER);
    }
  };

  if (!isSplashReady) {
    return null;
  }

  return (
    <AuthContext value={{ user, login, logout, updateUser }}>
      <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>
    </AuthContext>
  );
}

function AnimatedSplashScreen({
  children,
  image,
}: {
  children: React.ReactNode;
  image: number;
}) {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isSplashAnimationComplete, setIsSplashAnimationComplete] =
    useState(false);
  const animation = useRef(new Animated.Value(1)).current;
  const { updateUser } = useContext(AuthContext);

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => setIsSplashAnimationComplete(true));
    }
  }, [isAppReady, animation]);

  const onImageLoaded = async () => {
    try {
      // 데이터 준비
      await AsyncStorage.getItem(ASYNC_STORAGE_USER).then((user) => {
        updateUser?.(user ? JSON.parse(user) : null);
      });

      await SplashScreen.hideAsync();
    } catch (error) {
      console.error(error);
    } finally {
      setIsAppReady(true);
    }
  };

  const rotateValue = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents={"none"}
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                Constants.expoConfig?.splash?.backgroundColor || "#ffffff",
              opacity: animation,
            },
          ]}
        >
          <Animated.Image
            source={image}
            resizeMode={Constants.expoConfig?.splash?.resizeMode || "contain"}
            style={{
              width: Constants.expoConfig?.splash?.imageWidth || 200,
              transform: [{ scale: animation }, { rotate: rotateValue }],
            }}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AnimatedAppLoader image={require("../assets/images/react-logo.png")}>
      <StatusBar style="auto" animated />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </AnimatedAppLoader>
  );
}
