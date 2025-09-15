import SideMenu from "@/components/SideMenu";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useContext, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../_layout";

export default function Index() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
      </BlurView>
      <View style={style.searchBar}>
        <TextInput
          style={[
            style.searchInput,
            colorScheme === "dark"
              ? style.searchInputDark
              : style.searchInputLight,
          ]}
          placeholder="Search"
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
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
  headerLight: { backgroundColor: "white" },
  headerDark: { backgroundColor: "#333" },
  menuButton: {
    position: "absolute",
    top: 10,
    left: 20,
  },
  searchBar: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    width: "90%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchInputLight: { color: "#333" },
  searchInputDark: { color: "white" },
});
