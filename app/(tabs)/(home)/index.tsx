import { AuthContext } from "@/app/_layout";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import { useContext } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  return (
    <SafeAreaView style={style.container}>
      <BlurView intensity={80} style={style.header}>
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

      {isLoggedIn && (
        <View style={style.tabContainer}>
          <View style={style.tab}>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={{ color: pathname === "/" ? "red" : "black" }}>
                For you
              </Text>
            </TouchableOpacity>
          </View>

          <View style={style.tab}>
            <TouchableOpacity onPress={() => router.push("/following")}>
              <Text style={{ color: pathname === "/" ? "black" : "red" }}>
                Following
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View>
        <TouchableOpacity onPress={() => router.push("/test/post/1")}>
          <Text>게시글1</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push("/test/post/1")}>
          <Text>게시글2</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push("/test/post/1")}>
          <Text>게시글3</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
  },
  headerLogo: {
    width: 42,
    height: 42,
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
