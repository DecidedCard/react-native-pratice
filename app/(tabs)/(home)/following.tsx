import PostDetail, { Post } from "@/components/Post";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setPosts([]);
    const fetchData = async () => {
      const res = await fetch(`/posts?type=following`);
      const data = await res.json();
      setPosts(data.posts);
    };

    fetchData();
  }, []);

  const onEndReached = useCallback(async () => {
    if (posts.length > 0) {
      const res = await fetch(
        `/posts?type=following?cursor=${posts.at(-1)?.id}`
      );
      const data = await res.json();
      if (data.posts.length > 0) {
        setPosts((prev) => [...prev, ...data.posts]);
      }
    }
  }, [posts]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setPosts([]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      const res = await fetch("/posts");
      const data = await res.json();
      setPosts(data.posts);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
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
      <FlashList
        data={posts}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => <PostDetail item={item} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={2}
      />
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
