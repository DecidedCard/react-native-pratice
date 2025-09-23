import NotFound from "@/app/+not-found";
import { AuthContext } from "@/app/_layout";
import SideMenu from "@/components/SideMenu";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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
      <View>
        <ScrollView horizontal style={style.tabBar}>
          <View>
            <Pressable
              onPress={() => router.push("/activity")}
              style={style.tabButton}
            >
              <Text
                style={
                  colorScheme === "dark" ? style.textDark : style.textLight
                }
              >
                All
              </Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              onPress={() => router.push("/activity/follow")}
              style={style.tabButton}
            >
              <Text
                style={
                  colorScheme === "dark" ? style.textDark : style.textLight
                }
              >
                Follow
              </Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              onPress={() => router.push("/activity/replies")}
              style={style.tabButton}
            >
              <Text
                style={
                  colorScheme === "dark" ? style.textDark : style.textLight
                }
              >
                Replies
              </Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              onPress={() => router.push("/activity/quotes")}
              style={style.tabButton}
            >
              <Text
                style={
                  colorScheme === "dark" ? style.textDark : style.textLight
                }
              >
                Quotes
              </Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              onPress={() => router.push("/activity/reposts")}
              style={style.tabButton}
            >
              <Text
                style={
                  colorScheme === "dark" ? style.textDark : style.textLight
                }
              >
                Reposts
              </Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              onPress={() => router.push("/activity/verified")}
              style={style.tabButton}
            >
              <Text
                style={
                  colorScheme === "dark" ? style.textDark : style.textLight
                }
              >
                Verified
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>

      <View style={style.contents}>
        <Text>아직 활동이 없습니다.</Text>
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
  tabText: { fontSize: 15 },
  textLight: { color: "#333" },
  textDark: { color: "white" },
  tabBar: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexDirection: "row",
  },
  tabButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: 34,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    marginRight: 6,
  },
  contents: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
