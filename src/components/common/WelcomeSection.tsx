import { useRouter } from "expo-router";
import React from "react";
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";

// Step-by-step guide data
const stepsData = [
  "Upload your video",
  "AI analysis begins",
  "Detect AI content",
  "View detailed report",
  "Get results instantly"
];

interface WelcomeSectionProps {
  animatedUpperStyle?: any;
  animatedWelcomeStyle?: any;
  animatedOriginalTextOpacity?: any;
  animatedNewTextOpacity?: any;
  children?: React.ReactNode;
}

export default function WelcomeSection({
  animatedUpperStyle,
  animatedWelcomeStyle,
  animatedOriginalTextOpacity,
  animatedNewTextOpacity,
  children,
}: WelcomeSectionProps) {
  const router = useRouter();
  
  return (
    <Animated.View style={[styles.upperSection, animatedUpperStyle || {}]}>
      <ImageBackground
        source={require("../../../assets/images/dash.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <ScrollView 
        style={styles.upperContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Try it for free button */}
        <TouchableOpacity 
          style={styles.tryButton}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.tryButtonText}>Login/Signup</Text>
        </TouchableOpacity>
        
        {/* Center-aligned logo */}
        <View style={styles.logoContainer}>
        <Image
            source={require("../../../assets/images/logo.png")}
          style={styles.logo}
        />
          {/* AI Video Detector Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>AI Video Detector</Text>
            <Text style={styles.descriptionText}>
              Uncover digital deceptions and detect{"\n"}
              AI-generated content in videos
            </Text>
          </View>
          
          {/* Welcome Image */}
          <View style={styles.welcomeImageContainer}>
            <Image
              source={require("../../../assets/images/welcome.jpeg")}
              style={styles.welcomeImage}
              resizeMode="contain"
            />
          </View>
          
          {/* Step-by-step Guide */}
          <View style={styles.stepsContainer}>
            <Text style={styles.stepsTitle}>How it works</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.stepsScrollContainer}
            >
              {stepsData.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepIcon}>
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        
        <Animated.View style={[styles.welcomeText, animatedWelcomeStyle]}>
          {/* Original Welcome Text */}
          <Animated.View
            style={[{ paddingHorizontal: 20 }, animatedOriginalTextOpacity]}
          >
            <Text
              style={{
                fontSize: 35,
                color: "#000000",
                fontFamily: "PoppinsSemiBold",
              }}
            >
              <Text
                style={{
                  color: "#FF2628",
                  fontFamily: "PoppinsExtraBold",
                }}
              >
                Swipe up{" "}
              </Text>
              to {"\n"}
              uncover digital{"\n"}
              deceptions.
            </Text>
          </Animated.View>
          {/* New Welcome Text */}
          <Animated.View
            style={[{ paddingHorizontal: 20, bottom: 50 }, animatedNewTextOpacity]}
          >
            <Text style={{ fontSize: 35, fontFamily: "PoppinsExtraBold" }}>
              <Text style={{ color: "#FF2628" }}>Hello.</Text>
              {"\n"}
              <Text style={{ color: "#000000" }}>Welcome back!</Text>
            </Text>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  upperSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    zIndex: 1,
  },
  upperContent: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 100,
    minHeight: "100%",
  },
  tryButton: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tryButtonText: {
    color: "#FF2628",
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 40,
  },
  logo: {
    width: 400,
    height: 160,
    resizeMode: "contain",
  },
  descriptionContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  descriptionTitle: {
    fontSize: 48,
    fontFamily: "PoppinsBold",
    color: "#FF2628", // Red color
    marginBottom: 10,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 28,
    fontFamily: "PoppinsMedium",
    color: "#38d20F", // Blue color
    textAlign: "center",
    lineHeight: 40,
  },
  welcomeImageContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  welcomeImage: {
    width: 450,
    height: 350,
  },
  stepsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  stepsTitle: {
    fontSize: 22,
    fontFamily: "PoppinsBold",
    color: "#FF2628",
    textAlign: "center",
    marginBottom: 20,
  },
  stepsScrollContainer: {
    paddingHorizontal: 10,
  },
  stepItem: {
    alignItems: "center",
    marginRight: 25,
    width: 140,
  },
  stepIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0473ea",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  stepNumber: {
    fontSize: 28,
    fontFamily: "PoppinsBold",
    color: "#fff",
  },
  stepText: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: "#333",
    textAlign: "center",
    lineHeight: 20,
  },
  welcomeText: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
}); 