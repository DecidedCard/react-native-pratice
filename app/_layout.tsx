import {
  ASYNC_STORAGE_USER,
  SECURE_ACCESS_TOKEN,
  SECURE_REFRESH_TOKEN,
} from "@/const/storage-const";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Href, Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert, Animated, Linking, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

// First, set the handler that will cause the notification
// to show the alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
  handleSuccess: (notificationId) => {
    console.log("handleSuccess", notificationId);
  },
  handleError: (notificationId, error) => {
    console.log("handleError", notificationId, error);
  },
});

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

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
    return fetch(
      `${__DEV__ ? "" : Constants.expoConfig?.extra?.apiUrl}/login`,
      {
        method: "POST",
        body: JSON.stringify({
          username: "card07",
          password: "1234",
        }),
      }
    )
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
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  console.log("expoPushToken", expoPushToken);
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

  const onFetchUpdateAsync = async () => {
    try {
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert("Update available", "Please update your app", [
            {
              text: "Update",
              onPress: () => Updates.reloadAsync(),
            },
            { text: "Cancel", style: "cancel" },
          ]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onImageLoaded = async () => {
    try {
      // 데이터 준비
      await Promise.all([
        AsyncStorage.getItem(ASYNC_STORAGE_USER).then((user) => {
          updateUser?.(user ? JSON.parse(user) : null);
        }),
        onFetchUpdateAsync(),
      ]);

      await SplashScreen.hideAsync();
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        return Linking.openSettings();
      }
      const token = await Notifications.getExpoPushTokenAsync({
        projectId:
          Constants.expoConfig?.extra?.eas.projectId ??
          Constants.easConfig?.projectId,
      });
      console.log("push-token", token);
      setExpoPushToken(token.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAppReady(true);
    }
  };

  useEffect(() => {
    if (expoPushToken && Device.isDevice) {
      sendPushNotification(expoPushToken);
    }
  }, [expoPushToken]);

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

function useNotificationObserver() {
  const router = useRouter();
  useEffect(() => {
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url as string;
      if (url && url.startsWith("practice://")) {
        Alert.alert("redirect to url", url);
        router.push(url.replace("practice://", "/") as Href);
        // Linking.openURL(url);
      }
    }

    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) {
      redirect(response.notification);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      }
    );

    return () => {
      subscription.remove();
    };
  }, [router]);
}

export default function RootLayout() {
  useNotificationObserver();

  return (
    <AnimatedAppLoader image={require("../assets/images/react-logo.png")}>
      <StatusBar style="auto" animated />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
      <Toast />
    </AnimatedAppLoader>
  );
}
