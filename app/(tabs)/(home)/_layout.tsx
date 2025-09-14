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
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function Layout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  return (
    <View style={[style.container, { paddingTop: insets.top }]}>
      <BlurView intensity={70} style={style.header}>
        {isLoggedIn && (
          <Pressable
            style={style.menuButton}
            onPress={() => setIsSideMenuOpen(true)}
          >
            <Ionicons name="menu" size={24} color="black" />
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
            style={style.loginButton}
            onPress={() => router.navigate("/login")}
          >
            <Text style={style.loginButtonText}>로그인</Text>
          </Pressable>
        )}
      </BlurView>
      {isLoggedIn ? (
        <MaterialTopTabs
          screenOptions={{
            lazy: true,
            tabBarStyle: {
              backgroundColor: "white",
              shadowColor: "transparent",
              position: "relative",
            },
            tabBarPressColor: "transparent",
            tabBarActiveTintColor: "#555",
            tabBarIndicatorStyle: {
              backgroundColor: "black",
              height: 1,
            },
            tabBarIndicatorContainerStyle: {
              backgroundColor: "#aaa",
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
  header: {
    alignItems: "center",
    height: 50,
  },
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
    top: 0,
    right: 20,
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  loginButtonText: {
    color: "white",
  },
});
