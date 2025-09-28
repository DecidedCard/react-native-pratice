import { AuthContext } from "@/app/_layout";
import SideMenu from "@/components/SideMenu";
import { Ionicons } from "@expo/vector-icons";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { Slot, useRouter, withLayoutContext } from "expo-router";
import { useContext, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function Layout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  return (
    <View
      style={[
        style.container,
        { paddingTop: insets.top },
        colorScheme === "dark" ? style.containerDark : style.containerLight,
      ]}
    >
      <BlurView
        intensity={colorScheme === "dark" ? 5 : 70}
        style={[
          style.header,
          colorScheme === "dark" ? style.headerDark : style.headerLight,
        ]}
      >
        {isLoggedIn && (
          <Pressable
            style={style.menuButton}
            onPress={() => setIsSideMenuOpen(true)}
          >
            <Ionicons
              name="menu"
              size={24}
              color={colorScheme === "dark" ? "gray" : "black"}
            />
          </Pressable>
        )}
        <SideMenu
          isVisible={isSideMenuOpen}
          onClose={() => setIsSideMenuOpen(false)}
        />
        <Image
          style={style.headerLogo}
          source={require("../../../assets/images/react-logo.png")}
        />
        {!isLoggedIn && (
          <Pressable
            style={[
              style.loginButton,
              colorScheme === "dark"
                ? style.loginButtonBgDark
                : style.loginButtonBgLight,
            ]}
            onPress={() => router.navigate("/login")}
          >
            <Text
              style={
                colorScheme === "dark"
                  ? style.loginButtonTextDark
                  : style.loginButtonTextLight
              }
            >
              로그인
            </Text>
          </Pressable>
        )}
      </BlurView>
      {isLoggedIn ? (
        <MaterialTopTabs
          screenOptions={{
            lazy: true,
            lazyPreloadDistance: 1,
            tabBarStyle: {
              backgroundColor: colorScheme === "dark" ? "#333" : "white",
              shadowColor: "transparent",
              position: "relative",
            },
            tabBarPressColor: "transparent",
            tabBarActiveTintColor: colorScheme === "dark" ? "white" : "#333",
            tabBarIndicatorStyle: {
              backgroundColor: colorScheme === "dark" ? "white" : "#333",
              height: 1,
            },
            tabBarIndicatorContainerStyle: {
              backgroundColor: colorScheme === "dark" ? "#aaa" : "#555",
              position: "absolute",
              top: 49,
              height: 1,
            },
          }}
        >
          <MaterialTopTabs.Screen name="index" options={{ title: "For you" }} />
          <MaterialTopTabs.Screen
            name="following"
            options={{ title: "Following" }}
          />
        </MaterialTopTabs>
      ) : (
        <Slot />
      )}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: "white",
  },
  containerDark: {
    backgroundColor: "#333",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  headerLight: { backgroundColor: "white" },
  headerDark: { backgroundColor: "#333" },
  headerLogo: {
    width: 42,
    height: 42,
  },
  menuButton: {
    position: "absolute",
    top: 10,
    left: 20,
  },
  loginButton: {
    position: "absolute",
    top: 7,
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  loginButtonBgLight: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
  },
  loginButtonBgDark: {
    backgroundColor: "black",
  },
  loginButtonTextLight: {
    color: "black",
  },
  loginButtonTextDark: {
    color: "white",
  },
});
