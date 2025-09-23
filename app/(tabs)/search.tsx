import SideMenu from "@/components/SideMenu";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useContext, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../_layout";

interface User {
  id: string;
  name: string;
  description: string;
  profileImageUrl: string;
  isVerified: boolean;
}

export default function Index() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/user?cursor=1");
      const data = await res.json();

      setUserData(data);
    };

    fetchData();
  }, []);

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
          source={require("../../assets/images/react-logo.png")}
        />
      </BlurView>
      <ScrollView>
        <View
          style={[
            style.searchBar,
            colorScheme === "dark" && style.searchBarDark,
          ]}
        >
          <TextInput
            style={[
              style.searchInput,
              colorScheme === "dark"
                ? style.searchInputDark
                : style.searchInputLight,
            ]}
            placeholder="Search"
            placeholderTextColor={"gray"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Text
          style={[
            style.followText,
            colorScheme === "dark" && style.followTextDark,
          ]}
        >
          팔로우 추천
        </Text>
        {userData.length ? (
          userData.map((i) => (
            <View key={i.id} style={style.profileCard}>
              <Image
                source={{ uri: i.profileImageUrl }}
                style={style.profileImage}
              />
              <View style={style.profileContents}>
                <Text
                  style={[
                    style.profileText,
                    style.profileIdText,
                    colorScheme === "dark" && style.profileTextDark,
                  ]}
                >
                  {i.name}
                </Text>
                <Text style={[style.profileText, style.profileNameText]}>
                  {i.id}
                </Text>
                <Text
                  style={[
                    style.profileText,
                    style.profileDescriptionText,
                    colorScheme === "dark" && style.profileTextDark,
                  ]}
                >
                  {i.description}
                </Text>
              </View>
              <Pressable
                style={[
                  style.profileFollowButton,
                  colorScheme === "dark"
                    ? style.profileFollowButtonDark
                    : style.profileFollowButtonLight,
                ]}
              >
                <Text
                  style={[
                    style.profileFollowButtonText,
                    colorScheme === "dark"
                      ? style.profileFollowButtonTextDark
                      : style.profileFollowButtonTextLight,
                  ]}
                >
                  팔로우
                </Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text>test</Text>
        )}
      </ScrollView>
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
    backgroundColor: "black",
  },
  header: {
    alignItems: "center",
    height: 50,
  },
  headerLight: { backgroundColor: "white" },
  headerDark: { backgroundColor: "black" },
  headerLogo: {
    width: 42,
    height: 42,
  },
  menuButton: {
    position: "absolute",
    top: 10,
    left: 20,
  },
  searchBar: {
    alignItems: "center",
    padding: 16,
  },
  searchBarDark: { backgroundColor: "#333" },
  searchInput: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  searchInputLight: { color: "#333" },
  searchInputDark: {
    color: "white",
    backgroundColor: "black",
  },

  // 팔로우 텍스트
  followText: { paddingHorizontal: 16, paddingTop: 16, fontSize: 16 },
  followTextDark: { color: "gray" },

  // 프로필
  profileCard: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 9999,
  },
  profileContents: {
    gap: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    paddingBottom: 16,
    width: "90%",
  },
  profileText: { fontSize: 15 },
  profileTextDark: { color: "white" },
  profileIdText: { fontWeight: 600 },
  profileNameText: { fontWeight: 300, color: "gray" },
  profileDescriptionText: { fontWeight: 400 },
  profileFollowButton: {
    position: "absolute",
    top: 16,
    right: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 104,
    height: 34,
    borderRadius: 12,
  },
  profileFollowButtonLight: {
    backgroundColor: "black",
  },
  profileFollowButtonDark: {
    backgroundColor: "white",
  },
  profileFollowButtonText: { fontSize: 15, fontWeight: 600 },
  profileFollowButtonTextLight: { color: "white" },
  profileFollowButtonTextDark: { color: "#333" },
});
