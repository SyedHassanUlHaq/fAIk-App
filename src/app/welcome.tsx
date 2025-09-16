import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import WelcomeSection from "../components/common/WelcomeSection";

const { height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <WelcomeSection />
      
      {/* Get Started Button */}
      <TouchableOpacity 
        style={styles.getStartedButton}
        onPress={() => {
          router.push("/(dashboard)/upload");
        }}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Get Started</Text>
          <View style={styles.buttonIcon}>
            <Text style={styles.buttonIconText}>→</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  getStartedButton: {
    position: "absolute",
    bottom: height * 0.05,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
    color: "#000",
  },
  buttonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF2628",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonIconText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
});