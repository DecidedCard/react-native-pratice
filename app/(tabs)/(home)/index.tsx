import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        style.container,
        { paddingTop: insets.top },
        colorScheme === "dark" ? style.containerDark : style.containerLight,
      ]}
    >
      <View>
        <TouchableOpacity onPress={() => router.push("/test/post/1")}>
          <Text
            style={colorScheme === "dark" ? style.textDark : style.textLight}
          >
            게시글1
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push("/test/post/1")}>
          <Text
            style={colorScheme === "dark" ? style.textDark : style.textLight}
          >
            게시글2
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push("/test/post/1")}>
          <Text
            style={colorScheme === "dark" ? style.textDark : style.textLight}
          >
            게시글3
          </Text>
        </TouchableOpacity>
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
  textLight: {
    color: "black",
  },
  textDark: {
    color: "white",
  },
});
