import { Tabs } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Platform, TouchableOpacity, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isTabBarVisible, setIsTabBarVisible] = useState(false);
  const tabBarOpacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTabBar = () => {
    setIsTabBarVisible(true);
    Animated.timing(tabBarOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to hide tab bar after 5 seconds
    timeoutRef.current = setTimeout(() => {
      hideTabBar();
    }, 5000);
  };

  const hideTabBar = () => {
    Animated.timing(tabBarOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsTabBarVisible(false);
    });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const CustomTabBar = (props: any) => {
    const { state, descriptors, navigation } = props;

    if (!isTabBarVisible) return null;

    return (
      <Animated.View
        style={{
          position: "absolute",
          bottom: 30, // 30px from bottom to ensure 20px clear space
          left: "50%", // Center horizontally
          transform: [{ translateX: -50 }], // Offset by half width to center
          backgroundColor: "#eab676", // Custom background color
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          borderRadius: 20, // Rounded corners
          height: Platform.select({
            ios: 60,
            default: 50,
          }),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          opacity: tabBarOpacity,
          paddingHorizontal: 20,
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            // Reset timeout when tab is pressed
            showTabBar();

            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const color = isFocused
            ? "#000000" // Pure black for focused state
            : "rgba(0, 0, 0, 0.6)"; // Semi-transparent black for unfocused

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 15,
                paddingVertical: 8,
              }}
            >
              {options.tabBarIcon &&
                options.tabBarIcon({ color, focused: isFocused, size: 28 })}
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    );
  };

  const TriggerArea = () => (
    <TouchableOpacity
      style={{
        position: "absolute",
        bottom: 20, // Start 20px from bottom to leave clear space
        left: 0,
        right: 0,
        height: 80, // Touch area height (reduced from 100)
        backgroundColor: "transparent",
        zIndex: isTabBarVisible ? -1 : 1000, // Lower z-index when tab bar is visible
      }}
      onPress={showTabBar}
      activeOpacity={1}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: () => null,
          tabBarStyle: { display: "none" }, // Hide default tab bar
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Today",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="list.bullet" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="vision"
          options={{
            title: "Vision",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="eye.fill" color={color} />
            ),
          }}
        />
      </Tabs>
      <TriggerArea />
    </View>
  );
}
