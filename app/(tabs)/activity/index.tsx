import NotFound from "@/app/+not-found";
import { AuthContext } from "@/app/_layout";
import SideMenu from "@/components/SideMenu";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Activity() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  if (
    ![
      "/activity",
      "/activity/follow",
      "/activity/replies",
      "/activity/quotes",
      "/activity/reposts",
      "/activity/verified",
    ].includes(pathname)
  ) {
    return <NotFound />;
  }

  return (
    <View
      style={[
        style.container,
        {
          paddingTop: insets.top,
        },
        colorScheme === "dark" ? style.containerDark : style.containerLight,
      ]}
    >
      <BlurView
        intensity={colorScheme === "dark" ? 5 : 70}
        style={style.header}
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
      <View style={style.tabBar}>
        <View>
          <TouchableOpacity onPress={() => router.push("/activity")}>
            <Text
              style={colorScheme === "dark" ? style.textDark : style.textLight}
            >
              All
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => router.push("/activity/follow")}>
            <Text
              style={colorScheme === "dark" ? style.textDark : style.textLight}
            >
              Follow
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => router.push("/activity/replies")}>
            <Text
              style={colorScheme === "dark" ? style.textDark : style.textLight}
            >
              Replies
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => router.push("/activity/quotes")}>
            <Text
              style={colorScheme === "dark" ? style.textDark : style.textLight}
            >
              Quotes
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => router.push("/activity/reposts")}>
            <Text
              style={colorScheme === "dark" ? style.textDark : style.textLight}
            >
              Reposts
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => router.push("/activity/verified")}>
            <Text
              style={colorScheme === "dark" ? style.textDark : style.textLight}
            >
              Verified
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  menuButton: {
    position: "absolute",
    top: 10,
    left: 20,
  },
  headerLogo: {
    width: 42,
    height: 42,
  },
  textLight: { color: "#333" },
  textDark: { color: "white" },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
