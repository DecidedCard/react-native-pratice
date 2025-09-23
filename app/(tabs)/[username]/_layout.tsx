import { AuthContext } from "@/app/_layout";
import EditProfileModal from "@/components/EditProfileModal";
import SideMenu from "@/components/SideMenu";
import { Ionicons } from "@expo/vector-icons";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, withLayoutContext } from "expo-router";
import { useContext, useState } from "react";
import {
  Image,
  Pressable,
  Share,
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
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const { username } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  console.log(user);
  const isLoggedIn = !!user;
  const isOwnProfile = isLoggedIn && user?.id === username?.slice(1);

  const handleOpenEditModal = () => {
    setIsEditModalVisible(true);
  };

  const handleCloseEditModal = () => setIsEditModalVisible(false);

  const handleShareProfile = async () => {
    console.log("share profile");
    try {
      await Share.share({ message: `practice://@${username}` });
    } catch (error) {
      console.error(error);
    }
  };

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
            style={[
              style.profileName,
              colorScheme === "dark"
                ? style.profileNameDark
                : style.profileNameLight,
            ]}
          >
            {user?.name}
          </Text>
          <Text
            style={[
              { marginBottom: 16 },
              colorScheme === "dark"
                ? style.profileTextDark
                : style.profileTextLight,
            ]}
          >
            {user?.id}
          </Text>
          <Text
            style={[
              colorScheme === "dark"
                ? style.profileTextDark
                : style.profileTextLight,
            ]}
          >
            {user?.description}
          </Text>
        </View>
        <View style={style.profileActions}>
          {isOwnProfile ? (
            <Pressable
              style={[
                style.actionButton,
                colorScheme === "dark"
                  ? style.actionButtonDark
                  : style.actionButtonLight,
              ]}
              onPress={handleOpenEditModal}
            >
              <Text
                style={[
                  style.actionButtonText,
                  colorScheme === "dark"
                    ? style.actionButtonTextDark
                    : style.actionButtonTextLight,
                ]}
              >
                Edit profile
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={[
                style.actionButton,
                colorScheme === "dark"
                  ? style.actionButtonDark
                  : style.actionButtonLight,
              ]}
            >
              <Text
                style={[
                  style.actionButtonText,
                  colorScheme === "dark"
                    ? style.actionButtonTextDark
                    : style.actionButtonTextLight,
                ]}
              >
                Follow
              </Text>
            </Pressable>
          )}
          <Pressable
            style={[
              style.actionButton,
              colorScheme === "dark"
                ? style.actionButtonDark
                : style.actionButtonLight,
            ]}
            onPress={handleShareProfile}
          >
            <Text
              style={[
                style.actionButtonText,
                colorScheme === "dark"
                  ? style.actionButtonTextDark
                  : style.actionButtonTextLight,
              ]}
            >
              Share profile
            </Text>
          </Pressable>
        </View>
      </View>
      {user && (
        <EditProfileModal
          visible={isEditModalVisible}
          onClose={handleCloseEditModal}
          initialProfileData={user}
        />
      )}
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
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
  profile: { padding: 16 },
  profileHeader: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileNameLight: {
    color: "black",
  },
  profileNameDark: {
    color: "white",
  },
  profileTextDark: {
    color: "white",
  },
  profileTextLight: {
    color: "black",
  },
  profileActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    gap: 16,
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  profileAvatar: {
    position: "absolute",
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  actionButtonLight: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#333",
  },
  actionButtonDark: {
    backgroundColor: "#101010",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtonTextLight: {
    color: "#000",
  },
  actionButtonTextDark: {
    color: "#fff",
  },
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
