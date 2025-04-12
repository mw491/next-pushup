const IS_DEV = process.env.APP_VARIANT === "development";

export default {
  name: IS_DEV ? "NEXT PUSHUP (DEV)" : "NEXT PUSHUP",
  slug: "next-pushup",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV
      ? "com.mw491.nextpushup.dev"
      : "com.mw491.nextpushup",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#111111",
    },
    package: IS_DEV ? "com.mw491.nextpushup.dev" : "com.mw491.nextpushup",
  },
  splash: {
    image: "./assets/images/icon.png",
    resizeMode: "cover",
    backgroundColor: "#111111",
  },
  androidStatusBar: {
    backgroundColor: "#111111",
    barStyle: "light-content",
    translucent: false,
  },
  androidNavigationBar: {
    backgroundColor: "#111111",
  },
  notification: {
    icon: "./assets/images/adaptive-icon.png",
  },
  plugins: ["expo-router", "expo-splash-screen", "expo-font", "expo-localization"],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    posthogApiKey: process.env.POSTHOG_API_KEY,
    router: {
      origin: false,
    },
    eas: {
      projectId: "1fe9b498-6857-41d8-9615-0fe88b782f86",
    },
  },
  owner: "mw491",
  runtimeVersion: {
    policy: "appVersion",
  },
  updates: {
    url: "https://u.expo.dev/1fe9b498-6857-41d8-9615-0fe88b782f86",
  },
};
