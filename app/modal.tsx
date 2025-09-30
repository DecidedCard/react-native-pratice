import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ColorSchemeName,
  FlatList,
  Image,
  Linking,
  Pressable,
  Modal as RNModal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Thread {
  id: string;
  text: string;
  hashtag?: string;
  location?: string;
  imageUrls: string[];
}

export function ListFooter({
  canAddThread,
  addThread,
  colorScheme,
}: {
  canAddThread: boolean;
  addThread: () => void;
  colorScheme: ColorSchemeName;
}) {
  return (
    <View
      style={[
        styles.listFooter,
        colorScheme === "dark" ? styles.listFooterDark : styles.listFooterLight,
      ]}
    >
      <View style={styles.listFooterAvatar}>
        <Image
          source={require("../assets/images/avatar.png")}
          style={styles.avatarSmall}
        />
      </View>
      <View>
        <Pressable onPress={addThread} style={[styles.input]}>
          <Text style={{ color: canAddThread ? "#999" : "#aaa" }}>
            Add to thread
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function Modal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const [threads, setThreads] = useState<Thread[]>([
    { id: Date.now().toString(), text: "", imageUrls: [] },
  ]);

  const [isPosting, setIsPosting] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [replyOption, setReplyOption] = useState("");

  const replyOptions = ["Anyone", "Profiles you follow", "Mentioned only"];

  const handleCancel = () => {};

  const handlePost = async () => {
    const formData = new FormData();
    threads.forEach((thread, index) => {
      formData.append(`posts[${index}][id]`, thread.id);
      formData.append(`posts[${index}][content]`, thread.text);
      formData.append(`posts[${index}][userId]`, "card07");
      formData.append(
        `posts[${index}][location]`,
        thread.location ? thread.location : ""
      );
      thread.imageUrls.forEach((imageUrl, imageIndex) => {
        formData.append(`posts[${index}][imageUrls][${imageIndex}]`, {
          uri: imageUrl,
          name: `image_${index}_${imageIndex}.png`,
          type: "image/png",
        } as unknown as Blob);
      });
    });
    const res = await fetch("/posts", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });
    const data = await res.json();
    router.replace(`/@${data[0].userId}/post/${data[0].id}`);
  };

  const updateThreadHashtag = (id: string, hashtag: string) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id ? { ...thread, hashtag } : thread
      )
    );
  };

  const updateThreadText = (id: string, text: string) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id ? { ...thread, text } : thread
      )
    );
  };

  const canAddThread =
    (threads.at(-1)?.text.trim().length ?? 0) > 0 ||
    (threads.at(-1)?.imageUrls.length ?? 0) > 0;
  const canPost = threads.every(
    (thread) => thread.text.trim().length > 0 || thread.imageUrls.length > 0
  );

  const removeThread = (id: string) => {
    setThreads((prevThreads) =>
      prevThreads.filter((thread) => thread.id !== id)
    );
  };

  const pickImage = async (id: string) => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Library",
        "Please grant library permission to user this feature",
        [
          {
            text: "Open settings",
            onPress: () => {
              Linking.openSettings();
            },
          },
          { text: "Cancel" },
        ]
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "livePhotos", "videos"],
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      setThreads((prevThread) =>
        prevThread.map((thread) =>
          thread.id === id
            ? {
                ...thread,
                imageUrls: thread.imageUrls.concat(
                  result.assets?.map((asset) => asset.uri) ?? []
                ),
              }
            : thread
        )
      );
    }
  };

  const takePhoto = async (id: string) => {
    let { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Camera",
        "Please grant camera permission to user this feature",
        [
          {
            text: "Open settings",
            onPress: () => {
              Linking.openSettings();
            },
          },
          { text: "Cancel" },
        ]
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "livePhotos", "videos"],
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      setThreads((prevThread) =>
        prevThread.map((thread) =>
          thread.id === id
            ? {
                ...thread,
                imageUrls: thread.imageUrls.concat(
                  result.assets?.map((asset) => asset.uri) ?? []
                ),
              }
            : thread
        )
      );
      let { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted" && result.assets[0].uri) {
        MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
      }
    }
  };

  const removeImageFromThread = (id: string, uriToRemove: string) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              imageUrls: thread.imageUrls.filter((uri) => uri !== uriToRemove),
            }
          : thread
      )
    );
  };

  const getMyLocation = async (id: string) => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Location",
        "Please grant location permission to user this feature",
        [
          {
            text: "Open settings",
            onPress: () => {
              Linking.openSettings();
            },
          },
          { text: "Cancel" },
        ]
      );
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const address = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              location: `${address[0].country} ${address[0].city}`,
            }
          : thread
      )
    );
  };

  const renderThreadItem = ({
    item,
    index,
  }: {
    item: Thread;
    index: number;
  }) => (
    <View
      style={[
        styles.threadContainer,
        colorScheme === "dark"
          ? styles.threadContainerDark
          : styles.threadContainerLight,
      ]}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={require("../assets/images/avatar.png")}
          style={styles.avatar}
        />
        <View style={styles.threadLine} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.userInfoContainer}>
          <View style={styles.usernameAndHashtagContainer}>
            <Text
              style={[
                styles.username,
                colorScheme === "dark"
                  ? styles.usernameDark
                  : styles.usernameLight,
              ]}
            >
              username
            </Text>
            <View>
              <Ionicons name="chevron-forward" size={12} color={"#999"} />
            </View>
            <TextInput
              placeholder="Add a topic"
              style={styles.hashtagInput}
              value={item.hashtag}
              placeholderTextColor="#999"
              onChangeText={(hashtag) => updateThreadHashtag(item.id, hashtag)}
            />
          </View>
          {index > 0 && (
            <TouchableOpacity
              onPress={() => removeThread(item.id)}
              style={styles.removeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-outline" size={20} color="#8e8e93" />
            </TouchableOpacity>
          )}
        </View>
        <TextInput
          style={[
            styles.input,
            colorScheme === "dark" ? styles.inputDark : styles.inputLight,
          ]}
          placeholder={"What's new?"}
          placeholderTextColor="#999"
          value={item.text}
          onChangeText={(text) => updateThreadText(item.id, text)}
          multiline
        />
        {item.imageUrls && item.imageUrls.length > 0 && (
          <FlatList
            data={item.imageUrls}
            renderItem={({ item: uri, index: imgIndex }) => (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <Pressable
                  onPress={() =>
                    !isPosting && removeImageFromThread(item.id, uri)
                  }
                  style={styles.removeImageButton}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color="rgba(0,0,0,0.7)"
                  />
                </Pressable>
              </View>
            )}
            keyExtractor={(uri, imgIndex) =>
              `${item.id}-img-${imgIndex}-${uri}`
            }
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageFlatList}
          />
        )}
        {item.location && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        )}
        <View style={styles.actionButtons}>
          <Pressable
            style={styles.actionButton}
            onPress={() => !isPosting && pickImage(item.id)}
          >
            <Ionicons name="image-outline" size={24} color="#777" />
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => !isPosting && takePhoto(item.id)}
          >
            <Ionicons name="camera-outline" size={24} color="#777" />
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              getMyLocation(item.id);
            }}
          >
            <FontAwesome name="map-marker" size={24} color="#777" />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
        colorScheme === "dark" ? styles.containerDark : styles.containerLight,
      ]}
    >
      <View
        style={[
          styles.header,
          colorScheme === "dark" ? styles.headerDark : styles.headerLight,
        ]}
      >
        <Pressable onPress={() => router.back()} disabled={isPosting}>
          <Text
            style={[
              styles.cancel,
              colorScheme === "dark" ? styles.cancelDark : styles.cancelLight,
              isPosting && styles.disabledText,
            ]}
          >
            Cancel
          </Text>
        </Pressable>
        <Text
          style={[
            styles.title,
            colorScheme === "dark" ? styles.titleDark : styles.titleLight,
          ]}
        >
          New thread
        </Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <FlatList
        data={threads}
        keyExtractor={(item) => item.id}
        renderItem={renderThreadItem}
        ListFooterComponent={
          <ListFooter
            canAddThread={canAddThread}
            addThread={() => {
              if (canAddThread) {
                setThreads((prevThreads) => [
                  ...prevThreads,
                  { id: Date.now().toString(), text: "", imageUrls: [] },
                ]);
              }
            }}
            colorScheme={colorScheme}
          />
        }
        style={[
          styles.list,
          colorScheme === "dark" ? styles.listDark : styles.listLight,
        ]}
        contentContainerStyle={{
          backgroundColor: colorScheme === "dark" ? "#101010" : "white",
        }}
        keyboardShouldPersistTaps="handled"
      />

      <RNModal
        transparent={true}
        visible={isDropdownVisible}
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsDropdownVisible(false)}
        >
          <View
            style={[
              styles.dropdownContainer,
              { bottom: insets.bottom + 30 },
              colorScheme === "dark"
                ? styles.dropdownContainerDark
                : styles.dropdownContainerLight,
            ]}
          >
            {replyOptions.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.dropdownOption,
                  option === replyOption && styles.selectedOption,
                ]}
                onPress={() => {
                  setReplyOption(option);
                  setIsDropdownVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    colorScheme === "dark"
                      ? styles.dropdownOptionTextDark
                      : styles.dropdownOptionTextLight,
                    option === replyOption && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </RNModal>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + 10 },
          colorScheme === "dark" ? styles.footerDark : styles.footerLight,
        ]}
      >
        <Pressable onPress={() => setIsDropdownVisible(true)}>
          <Text
            style={[
              styles.footerText,
              colorScheme === "dark"
                ? styles.footerTextDark
                : styles.footerTextLight,
            ]}
          >
            {replyOption} can reply & quote
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.postButton,
            !canPost &&
              (colorScheme === "dark"
                ? styles.postButtonDisabledDark
                : styles.postButtonDisabledLight),
          ]}
          disabled={!canPost}
          onPress={handlePost}
        >
          <Text
            style={[
              styles.postButton,
              colorScheme === "dark"
                ? styles.postButtonDark
                : styles.postButtonLight,
              !canPost &&
                (colorScheme === "dark"
                  ? styles.postButtonDisabledDark
                  : styles.postButtonDisabledLight),
            ]}
          >
            Post
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  headerLight: {
    backgroundColor: "#fff",
  },
  headerDark: {
    backgroundColor: "#333",
  },
  headerRightPlaceholder: {
    width: 60,
  },
  cancel: {
    fontSize: 16,
  },
  cancelLight: {
    color: "#000",
  },
  cancelDark: {
    color: "#fff",
  },
  disabledText: {
    color: "#ccc",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  titleLight: {
    color: "#000",
  },
  titleDark: {
    color: "#fff",
  },
  list: {
    flex: 1,
  },
  listLight: {
    backgroundColor: "white",
  },
  listDark: {
    backgroundColor: "#333",
  },
  threadContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  threadContainerLight: {
    backgroundColor: "white",
  },
  threadContainerDark: {
    backgroundColor: "#333",
  },
  avatarContainer: {
    alignItems: "center",
    marginRight: 12,
    paddingTop: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#555",
  },
  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#555",
  },
  threadLine: {
    width: 1.5,
    flexGrow: 1,
    backgroundColor: "#aaa",
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 6,
  },
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  usernameAndHashtagContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  username: {
    fontWeight: "600",
    fontSize: 15,
  },
  usernameLight: {
    color: "#000",
  },
  usernameDark: {
    color: "#fff",
  },
  hashtagInput: {
    fontSize: 16,
    color: "#000",
    paddingTop: 0,
    paddingBottom: 0,
  },
  input: {
    fontSize: 15,
    paddingTop: 4,
    paddingBottom: 8,
    minHeight: 24,
    lineHeight: 20,
  },
  inputLight: {
    color: "#000",
  },
  inputDark: {
    color: "#fff",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginRight: 15,
  },
  imageFlatList: {
    marginTop: 12,
    marginBottom: 4,
  },
  imagePreviewContainer: {
    position: "relative",
    marginRight: 8,
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    padding: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerLight: {
    backgroundColor: "white",
  },
  footerDark: {
    backgroundColor: "#333",
  },
  footerText: {
    fontSize: 14,
  },
  footerTextLight: {
    color: "#8e8e93",
  },
  footerTextDark: {
    color: "#555",
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 18,
    fontSize: 15,
    fontWeight: "600",
  },
  postButtonLight: {
    backgroundColor: "black",
    color: "white",
  },
  postButtonDark: {
    backgroundColor: "white",
    color: "black",
  },
  postButtonDisabledLight: {
    backgroundColor: "#ccc",
  },
  postButtonDisabledDark: {
    backgroundColor: "#555",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  dropdownContainer: {
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: "hidden",
    marginBottom: 5,
  },
  dropdownContainerLight: {
    backgroundColor: "white",
  },
  dropdownContainerDark: {
    backgroundColor: "#333",
  },
  dropdownOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e5e5",
  },
  selectedOption: {},
  dropdownOptionText: {
    fontSize: 16,
  },
  dropdownOptionTextLight: {
    color: "#000",
  },
  dropdownOptionTextDark: {
    color: "#fff",
  },
  selectedOptionText: {
    fontWeight: "600",
    color: "#007AFF",
  },
  removeButton: {
    padding: 4,
    marginRight: -4,
    marginLeft: 8,
  },
  listFooter: {
    paddingLeft: 26,
    paddingTop: 10,
    flexDirection: "row",
  },
  listFooterLight: {
    backgroundColor: "white",
  },
  listFooterDark: {
    backgroundColor: "#333",
  },
  listFooterAvatar: {
    marginRight: 20,
    paddingTop: 2,
  },
  locationContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#8e8e93",
  },
});
