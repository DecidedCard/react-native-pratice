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
import { withLayoutContext } from "expo-router";
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
      </BlurView>
      <View style={style.profile}>
        <View style={style.profileHeader}>
          <Image
            source={{ uri: user?.profileImageUrl }}
            style={style.profileAvatar}
          />
          <Text>{user?.name}</Text>
          <Text>{user?.id}</Text>
          <Text>{user?.description}</Text>
        </View>
      </View>
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
        <MaterialTopTabs.Screen name="index" options={{ title: "Threads" }} />
        <MaterialTopTabs.Screen name="replies" options={{ title: "Replies" }} />
        <MaterialTopTabs.Screen name="reposts" options={{ title: "Reposts" }} />
      </MaterialTopTabs>
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
  menuButton: {
    position: "absolute",
    top: 10,
    left: 20,
  },
  profile: {},
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileAvatar: { width: 50, height: 50, borderRadius: 25 },
  headerLogo: {
    width: 42,
    height: 42,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
