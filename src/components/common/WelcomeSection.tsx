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
                fontSize: 28,
                color: "#1a1a1a",
                fontFamily: "Poppins-ExtraBold",
                lineHeight: 36,
                letterSpacing: -0.8,
                textShadowColor: 'rgba(0, 0, 0, 0.1)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
                fontWeight: '800',
              }}
            >
              <Text
                style={{
                  color: "#FF2628",
                  fontFamily: "Poppins-Black",
                  fontSize: 32,
                  letterSpacing: -1.2,
                  fontWeight: "900",
                  textShadowColor: 'rgba(255, 38, 40, 0.3)',
                  textShadowOffset: { width: 0, height: 3 },
                  textShadowRadius: 6,
                }}
              >
                SWIPE UP{" "}
              </Text>
              {"\n"}to {"\n"}
              <Text style={{ color: "#0473ea", fontFamily: "Poppins-Bold", fontWeight: "700" }}>
                uncover digital{"\n"}
              </Text>
              <Text style={{ color: "#38d200", fontFamily: "Poppins-SemiBold", fontWeight: "600" }}>
                deceptions.
              </Text>
            </Text>
          </Animated.View>
          {/* New Welcome Text */}
          <Animated.View
            style={[{ paddingHorizontal: 20, bottom: 50 }, animatedNewTextOpacity]}
          >
            <Text style={{ 
              fontSize: 32, 
              fontFamily: "Poppins-Black", 
              lineHeight: 40, 
              letterSpacing: -1.0,
              textShadowColor: 'rgba(0, 0, 0, 0.15)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
              fontWeight: '900'
            }}>
              <Text style={{ 
                color: "#FF2628", 
                fontFamily: "Poppins-Black",
                fontSize: 36,
                textShadowColor: 'rgba(255, 38, 40, 0.4)',
                textShadowOffset: { width: 0, height: 3 },
                textShadowRadius: 6,
              }}>Hello.</Text>
              {"\n"}
              <Text style={{ 
                color: "#1a1a1a", 
                fontFamily: "Poppins-ExtraBold",
                fontSize: 28,
                letterSpacing: -0.6,
              }}>Welcome back!</Text>
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
    fontSize: 15,
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textShadowColor: 'rgba(255, 38, 40, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    fontSize: 38,
    fontFamily: "Poppins-Black",
    color: "#FF2628",
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 46,
    letterSpacing: -1.2,
    fontWeight: "900",
    textShadowColor: 'rgba(255, 38, 40, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  descriptionText: {
    fontSize: 21,
    fontFamily: "Poppins-Bold",
    color: "#0473ea",
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 12,
    letterSpacing: -0.3,
    fontWeight: "700",
    textShadowColor: 'rgba(4, 115, 234, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
    fontSize: 26,
    fontFamily: "Poppins-Black",
    color: "#FF2628",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 32,
    letterSpacing: -0.8,
    fontWeight: "900",
    textShadowColor: 'rgba(255, 38, 40, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#0473ea",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#0473ea",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  stepNumber: {
    fontSize: 26,
    fontFamily: "Poppins-Black",
    color: "#fff",
    fontWeight: "900",
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  stepText: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: "#1a1a1a",
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: -0.1,
    fontWeight: "600",
    textShadowColor: 'rgba(0, 0, 0, 0.08)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  welcomeText: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
}); 