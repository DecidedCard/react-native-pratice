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
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
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
      </BlurView>
      <View style={style.profile}>
        <View style={style.profileHeader}>
          <Image
            source={{ uri: user?.profileImageUrl }}
            style={style.profileAvatar}
          />
          <Text
            style={colorScheme === "dark" ? style.textDark : style.textLight}
          >
            {user?.name}
          </Text>
          <Text
            style={colorScheme === "dark" ? style.textDark : style.textLight}
          >
            {user?.id}
          </Text>
          <Text
            style={colorScheme === "dark" ? style.textDark : style.textLight}
          >
            {user?.description}
          </Text>
        </View>
      </View>
      <MaterialTopTabs
        screenOptions={{
          lazy: true,
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
  containerLight: {
    backgroundColor: "white",
  },
  containerDark: {
    backgroundColor: "#333",
  },
  header: {
    alignItems: "center",
    height: 50,
  },
  headerLight: {
    backgroundColor: "white",
  },
  headerDark: {
    backgroundColor: "#333",
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
  textLight: { color: "#333" },
  textDark: { color: "white" },
  headerLogo: {
    width: 42,
    height: 42,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
