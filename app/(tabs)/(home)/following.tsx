import PostDetail, { Post } from "@/components/Post";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { PanResponder, StyleSheet, useColorScheme, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AnimationContext } from "./_layout";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<Post>);

export default function Following() {
  const colorScheme = useColorScheme();

  const isReadyToRefresh = useSharedValue(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const scrollPosition = useSharedValue(0);
  const { pullDownPosition } = useContext(AnimationContext);

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
        `/posts?type=following&cursor=${posts.at(-1)?.id}`
      );
      const data = await res.json();
      if (data.posts.length > 0) {
        setPosts((prev) => [...prev, ...data.posts]);
      }
    }
  }, [posts]);

  const onRefresh = async (done: () => void) => {
    try {
      setPosts([]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      const res = await fetch("/posts");
      const data = await res.json();
      setPosts(data.posts);
    } catch (error) {
      console.error(error);
    } finally {
      done();
    }
  };

  const onPanRelease = () => {
    pullDownPosition.value = withTiming(isReadyToRefresh.value ? 60 : 0, {
      duration: 180,
    });

    if (isReadyToRefresh.value) {
      onRefresh(() => {
        pullDownPosition.value = withTiming(0, { duration: 100 });
      });
    }

    setScrollEnabled(true);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => false,

      onMoveShouldSetPanResponderCapture: (_evt, g) => {
        const atTop = scrollPosition.value <= 5;
        const down = g.dy > 5;
        const activate = atTop && down;
        if (activate) {
          setScrollEnabled(false);
        }
        return activate;
      },

      onPanResponderMove: (event, gestureState) => {
        const max = 120;
        pullDownPosition.value = Math.max(Math.min(gestureState.dy, max), 0);

        if (
          pullDownPosition.value >= max / 2 &&
          isReadyToRefresh.value === false
        ) {
          isReadyToRefresh.value = true;
        }

        if (
          pullDownPosition.value < max / 2 &&
          isReadyToRefresh.value === true
        ) {
          isReadyToRefresh.value = false;
        }
      },
      onPanResponderRelease: onPanRelease,
      onPanResponderTerminate: onPanRelease,
    })
  ).current;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollPosition.value = event.contentOffset.y;
    },
  });

  const pullDownStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: pullDownPosition.value,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        style.container,
        colorScheme === "dark" ? style.containerDark : style.containerLight,
        pullDownStyle,
      ]}
      {...panResponder.panHandlers}
    >
      <AnimatedFlashList
        data={posts}
        renderItem={({ item }) => <PostDetail item={item} />}
        refreshControl={<View />}
        onEndReached={onEndReached}
        onEndReachedThreshold={2}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        scrollEnabled={scrollEnabled}
      />
    </Animated.View>
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
