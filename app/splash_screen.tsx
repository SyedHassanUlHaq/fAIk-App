import { BlurView } from 'expo-blur';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler
} from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";
import LoginForm from "../components/LoginForm";
import WelcomeSection from "../components/WelcomeSection";
import { useKeyboard } from "../hooks/useKeyboard";
import { useSwipeGesture } from "../hooks/useSwipeGesture";
import { API_BASE_URL, handleApiError, storeToken } from "../utils/api";

const { height } = Dimensions.get("window");
const LOGIN_CARD_HEIGHT = height * 0.65;

const router = useRouter();

export default function GetStartedLoginScreen() {
  // Use custom hooks
  const { translateY, gestureHandler, threshold } = useSwipeGesture();
  const keyboardHeight = useSharedValue(0);
  useKeyboard(keyboardHeight);

  // Auth state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Animations
  const contentOpacity = useAnimatedStyle(() => {
    const visible = translateY.value < threshold;
    return {
      opacity: withTiming(visible ? 1 : 0, { duration: 300 }),
      pointerEvents: visible ? "auto" : "none",
    };
  });

  const animatedWelcomeStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(translateY.value < threshold ? 20 : 0, {
          damping: 15,
          stiffness: 100,
        }),
      },
    ],
  }));

  const animatedOriginalTextOpacity = useAnimatedStyle(() => ({
    opacity: withTiming(translateY.value < threshold ? 0 : 1, { duration: 300 }),
  }));

  const animatedNewTextOpacity = useAnimatedStyle(() => ({
    opacity: withTiming(translateY.value < threshold ? 1 : 0, { duration: 300 }),
  }));

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value - keyboardHeight.value },
    ],
  }));

  // Enhanced drag handle animation
  const dragHandleStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateY.value,
      [0, threshold],
      [0, 1],
      Extrapolate.CLAMP
    );
    
    return {
      opacity: withTiming(progress > 0.3 ? 0.3 : 1, { duration: 200 }),
      transform: [
        {
          scale: withSpring(progress > 0.5 ? 0.8 : 1, {
            damping: 15,
            stiffness: 100,
          }),
        },
      ],
    };
  });

  // Background blur when card is up
  const backgroundBlurStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateY.value,
      [0, threshold],
      [0, 1],
      Extrapolate.CLAMP
    );
    
    return {
      opacity: withTiming(progress, { duration: 300 }),
    };
  });

  // Card preview when at rest
  const cardPreviewStyle = useAnimatedStyle(() => {
    // Use the exact same pattern as contentOpacity but inverted
    // contentOpacity shows when translateY.value < threshold (swiped up)
    // cardPreview should hide when translateY.value < threshold (swiped up)
    const shouldHide = translateY.value < threshold;
    
    return {
      opacity: withTiming(shouldHide ? 0 : 1, { duration: 300 }),
      transform: [
        {
          translateY: withTiming(shouldHide ? 20 : 0, { duration: 300 }),
        },
      ],
    };
  });

  // Auth logic
  const handleLogin = async (email: string, password: string) => {
    setErrorMsg("");
    setLoading(true);
    try {
      // Create form data as required by OAuth2PasswordRequestForm
      const formData = new FormData();
      formData.append("username", email); // OAuth2 uses 'username' field for email
      formData.append("password", password);
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw {
          response: {
            data: data,
          },
        };
      }
      // Store the token securely
      if (data.access_token) {
        await storeToken(data.access_token); // Should use SecureStore/Keychain
        router.push("/splash_screen"); // TODO: Change to main/home screen
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Button handlers
  const onForgotPassword = () => router.push("/forgot_password");
  const onGoogleSignIn = () => Alert.alert("Google Sign-In", "Google authentication flow to be implemented");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
      <View style={styles.container}>
          {/* Background blur overlay when card is up */}
          <Animated.View style={[styles.backgroundBlur, backgroundBlurStyle]} pointerEvents="none">
            {Platform.OS === 'ios' ? (
              <BlurView style={StyleSheet.absoluteFill} intensity={20} />
            ) : (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]} />
            )}
                </Animated.View>

          {/* Upper section is now static, no gesture or animation */}
          <WelcomeSection
            animatedUpperStyle={{}}
            animatedWelcomeStyle={animatedWelcomeStyle}
            animatedOriginalTextOpacity={animatedOriginalTextOpacity}
            animatedNewTextOpacity={animatedNewTextOpacity}
          >
            {/* Removed the swipe up GIF */}
          </WelcomeSection>

          {/* Card preview when at rest - moved higher up and now clickable */}
          <TouchableOpacity 
            style={[styles.cardPreview, cardPreviewStyle]} 
            onPress={() => {
              // Trigger swipe up animation when tapped
              translateY.value = withSpring(-height * 0.6, {
                damping: 15,
                stiffness: 100,
              });
            }}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.cardPreviewContent}>
              <Text style={styles.cardPreviewText}>Login</Text>
              <View style={styles.cardPreviewIcon}>
                <Text style={styles.cardPreviewIconText}>↑</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* The login card animates as before, but now is also swipeable for down gesture */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.loginCard, animatedCardStyle]}>
            <Animated.View style={contentOpacity}>
                <Animated.View style={[styles.dragHandle, dragHandleStyle]} />
              <Text style={styles.loginTitle}>Login to continue</Text>
                <LoginForm
                  loading={loading}
                  errorMsg={errorMsg}
                  onLogin={handleLogin}
                  onForgotPassword={onForgotPassword}
                  onGoogleSignIn={onGoogleSignIn}
                />
              {/* Footer */}
              <Text style={styles.footerText}>
                Don't have an account?{" "}
                <Text
                  style={{
                    color: "#FF2628",
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                    onPress={() => router.push("/signup_screen")}
                >
                  Sign up
                </Text>
              </Text>
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  cardPreview: {
    position: "absolute",
    bottom: height * 0.06, // Moved a bit lower from 0.15
    left: 20,
    right: 20,
    zIndex: 1, // Lower than login card so it can be hidden behind it
  },
  cardPreviewContent: {
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
  cardPreviewText: {
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
    color: "#000",
  },
  cardPreviewIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF2628",
    justifyContent: "center",
    alignItems: "center",
  },
  cardPreviewIconText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  loginCard: {
    position: "absolute",
    top: height * 0.98,
    left: 0,
    right: 0,
    height: LOGIN_CARD_HEIGHT,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    zIndex: 2,
    borderWidth: 2,
    borderColor: "#FF2628",
    borderBottomWidth: 0,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  dragHandle: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF2628",
    alignSelf: "center",
    marginBottom: 24,
    shadowColor: "#FF2628",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  loginTitle: {
    fontSize: 24,
    fontFamily: "PoppinsSemiBold",
    marginBottom: 24,
    textAlign: "center",
    color: "#000",
  },
  footerText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 24,
    fontFamily: "Poppins",
  },
});
