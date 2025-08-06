import React from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

interface WelcomeSectionProps {
  animatedUpperStyle: any;
  animatedWelcomeStyle: any;
  animatedOriginalTextOpacity: any;
  animatedNewTextOpacity: any;
  children?: React.ReactNode;
}

export default function WelcomeSection({
  animatedUpperStyle,
  animatedWelcomeStyle,
  animatedOriginalTextOpacity,
  animatedNewTextOpacity,
  children,
}: WelcomeSectionProps) {
  return (
    <Animated.View style={[styles.upperSection, animatedUpperStyle]}>
      <ImageBackground
        source={require("../assets/images/bg.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={styles.upperContent}>
        <Image
          source={require("../assets/images/logo-small.png")}
          style={styles.logo}
        />
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
      </View>
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
    paddingTop: 100,
    zIndex: 2,
  },
  logo: {
    width: 130,
    alignSelf: "flex-start",
    marginLeft: 20,
    height: 50,
    marginBottom: 0,
  },
  welcomeText: {
    position: "absolute",
    alignSelf: "flex-start",
    bottom: 10,
  },
}); 