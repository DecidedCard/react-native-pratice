import { ScrollView, StyleSheet, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  return (
    <ScrollView
      style={[
        style.container,
        { paddingTop: insets.top },
        colorScheme === "dark" ? style.containerDark : style.containerLight,
      ]}
    >
      {/* <PostDetail
        item={{
          id: "0",
          username: "madison",
          displayName: "Madison",
          content: "What is this?",
          timeAgo: "30 minutes ago",
          likes: 10,
          comments: 5,
          reposts: 2,
          isVerified: true,
          avatar: "https://randomuser.me/api/portraits/men/2.jpg",
          image: `https://picsum.photos/800/600?random=${Math.random()}`,
          location: [37.125, 124.97],
        }}
      />
      <PostDetail
        item={{
          id: "1",
          username: "zerocho",
          displayName: "Zerocho",
          content: "Hello, world!",
          timeAgo: "1 hour ago",
          likes: 10,
          comments: 5,
          reposts: 2,
          isVerified: true,
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        }}
      />
      <PostDetail
        item={{
          id: "2",
          username: "zerocho",
          displayName: "Zerocho",
          content: "Hello, world!",
          timeAgo: "1 hour ago",
          likes: 10,
          comments: 5,
          reposts: 2,
          isVerified: true,
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        }}
      />
      <PostDetail
        item={{
          id: "3",
          username: "karina",
          displayName: "Karina",
          content: "Hello, world!",
          timeAgo: "1 hour ago",
          likes: 10,
          comments: 5,
          reposts: 2,
          isVerified: true,
          avatar: "https://randomuser.me/api/portraits/women/3.jpg",
          image: `https://picsum.photos/800/600?random=${Math.random()}`,
          location: [37.125, 124.97],
        }}
      /> */}
    </ScrollView>
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
