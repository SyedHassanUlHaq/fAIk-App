import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

export default function BottomCard({
  height = screenHeight * 0.7,
  title = "",
  onBackPress,
  children,
}: {
  height?: number;
  title?: string;
  onBackPress?: () => void;
  children?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <View style={[styles.card, { height }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={onBackPress || (() => router.back())}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.centerText}>{title}</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: screenWidth * 0.07, // ~30 on standard screen
    borderTopRightRadius: screenWidth * 0.07,
    paddingVertical: screenHeight * 0.025,
    borderTopColor: "#FF2628",
    borderTopWidth: 2,
    borderRightColor: "#FF2628",
    borderLeftColor: "#FF2628",
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  headerRow: {
    height: screenHeight * 0.06,
    justifyContent: "center",
    position: "relative",
    marginBottom: screenHeight * 0.025,
    flexDirection: "row", // Ensure center text and back icon layout properly
    alignItems: "center",
    zIndex: 2, // Make sure it is above anything that might overlap
    paddingHorizontal: screenWidth * 0.05,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: Platform.OS === "ios" ? 8 : 4,
    padding: screenWidth * 0.01,
  },
  centerText: {
    textAlign: "center",
    fontSize: screenWidth * 0.055, // ~22 on 400px wide screen
    fontFamily: "PoppinsSemiBold",
    fontWeight: "600",
    color: "#000",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: screenWidth * 0.05,
  },
});
