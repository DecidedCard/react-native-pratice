export default {
  expo: {
    name: "react-native-practice",
    slug: "react-native-practice",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "practice",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      usesAppleSignIn: true,
      bundleIdentifier: "com.card07.reactnativepractice",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.card07.reactnativepractice",
      googleServicesFile: "./google-services.json",
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.RECORD_AUDIO",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.READ_MEDIA_VISUAL_USER_SELECTED",
        "android.permission.ACCESS_MEDIA_LOCATION",
        "android.permission.READ_MEDIA_AUDIO",
        "android.permission.READ_MEDIA_IMAGES",
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    splash: {
      image: "./assets/images/react-logo.png",
      imageWidth: 200,
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/react-logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow $(PRODUCT_NAME) to use your location.",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
        },
      ],
      [
        "expo-media-library",
        {
          photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
          savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos.",
          isAccessMediaLocationEnabled: true,
          granularPermissions: ["audio", "photo"],
        },
      ],
      "expo-secure-store",
      "expo-notifications",
      [
        "expo-build-properties",
        {
          android: {
            extraMavenRepos: [
              "https://devrepo.kakao.com/nexus/content/groups/public/",
            ],
          },
        },
      ],
      [
        "@react-native-kakao/core",
        {
          nativeAppKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_KEY,
          android: { authCodeHandlerActivity: true },
          ios: { handleKakaoOpenUrl: true },
        },
      ],
      ["expo-apple-authentication"],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "7205fc20-c0e8-4967-89a2-7f7fc41943a0",
      },
    },
  },
};
