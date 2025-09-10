import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <SafeAreaView style={style.container}>
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

        <View style={style.tab}>
          <TouchableOpacity onPress={() => router.push("/test/post/1")}>
            <Text>게시글1</Text>
          </TouchableOpacity>
        </View>

        <View style={style.tab}>
          <TouchableOpacity onPress={() => router.push("/test/post/1")}>
            <Text>게시글2</Text>
          </TouchableOpacity>
        </View>

        <View style={style.tab}>
          <TouchableOpacity onPress={() => router.push("/test/post/1")}>
            <Text>게시글3</Text>
          </TouchableOpacity>
        </View>
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
  },
});
