import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        style.container,
        {
          paddingTop: insets.top,
        },
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
});
