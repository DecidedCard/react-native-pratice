import { AuthContext } from "@/app/_layout";
import SideMenu from "@/components/SideMenu";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
      }}
    >
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

      <View style={style.tabBar}>
        <View>
          <TouchableOpacity onPress={() => router.push(`/${username}`)}>
            <Text>Threads</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => router.push(`/${username}/replies`)}>
            <Text>Replies</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => router.push(`/${username}/reposts`)}>
            <Text>Reposts</Text>
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
