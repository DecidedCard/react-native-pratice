import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

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
      <Text>text</Text>
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
});
