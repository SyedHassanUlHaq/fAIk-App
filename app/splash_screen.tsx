import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Keyboard,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // For saving JWT token
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  GestureHandlerRootView,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");
const router = useRouter();

export default function GetStartedLoginScreen() {
  const translateY = useSharedValue(0);
  const keyboardHeight = useSharedValue(0);
  const threshold = -height * 0.15;
  const [secureText, setSecureText] = useState(true);

  // New states for authentication
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        keyboardHeight.value = withTiming(e.endCoordinates.height, { duration: 300 });
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        keyboardHeight.value = withTiming(0, { duration: 300 });
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const isSwipedUp = () => translateY.value < threshold;

  // Animate login card content opacity
  const contentOpacity = useAnimatedStyle(() => {
    const visible = translateY.value < threshold;
    return {
      opacity: withTiming(visible ? 1 : 0, { duration: 300 }),
      pointerEvents: visible ? "auto" : "none",
    };
  });

  // Animate welcome text container position (slide down slightly when swiped)
  const animatedWelcomeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(translateY.value < threshold ? 20 : 0, {
            duration: 300,
          }),
        },
      ],
    };
  });

  const animatedOriginalTextOpacity = useAnimatedStyle(() => {
    return {
      opacity: withTiming(translateY.value < threshold ? 0 : 1, {
        duration: 300,
      }),
    };
  });

  const animatedNewTextOpacity = useAnimatedStyle(() => {
    return {
      opacity: withTiming(translateY.value < threshold ? 1 : 0, {
        duration: 300,
      }),
    };
  });

  const animatedLottieStyle = useAnimatedStyle(() => {
    const isVisible = translateY.value === 0;
    return {
      opacity: withTiming(isVisible ? 1 : 0, { duration: 300 }),
      transform: [
        {
          scale: withTiming(isVisible ? 1 : 0.95, { duration: 300 }),
        },
      ],
    };
  });

  // Gesture handler for swipe up/down
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      // Prevent dragging too far down
      const newTranslateY = ctx.startY + event.translationY;
      translateY.value = newTranslateY > 0 ? 0 : newTranslateY;
    },
    onEnd: (event) => {
      if (event.translationY < threshold) {
        translateY.value = withTiming(-height * 0.6, { duration: 500 });
      } else {
        translateY.value = withTiming(0, { duration: 500 });
      }
    },
  });

  // Animated style for the login card, including keyboard avoidance offset
  const animatedCardStyle = useAnimatedStyle(() => {
    // Move login card up by keyboardHeight when keyboard visible
    return {
      transform: [
        { translateY: translateY.value - keyboardHeight.value },
      ],
    };
  });

  // Animated style for upper section (logo + welcome text)
  const animatedUpperStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // === AUTH FUNCTION ===
  const handleLogin = async () => {
    setErrorMsg(""); // reset error
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://your-api-url.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        // Assuming the token is in data.token
        await AsyncStorage.setItem("jwt_token", data.token);

        // Navigate to your app's main screen or update auth state here
        Alert.alert("Success", "Logged in successfully!");
      } else if (response.status === 401) {
        setErrorMsg("Invalid credentials.");
      } else {
        setErrorMsg("Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // === BUTTON HANDLERS ===
  const onForgotPassword = () => {
    router.push("/forgot_password");
  };

  const onGoogleSignIn = () => {
    Alert.alert("Google Sign-In", "Google authentication flow to be implemented");
  };

  const onSignUp = () => {
    Alert.alert("Sign Up", "Navigate to signup screen");
  };



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
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
                      color: "white",
                      fontFamily: "PoppinsSemiBold",
                    }}
                  >
                    <Text
                      style={{
                        color: "#02D1FF",
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
                    <Text style={{ color: "#02D1FF" }}>Hello.</Text>
                    {"\n"}
                    <Text style={{ color: "white" }}>Welcome back!</Text>
                  </Text>
                </Animated.View>
              </Animated.View>

              <Animated.View style={[styles.lottieWrapper, animatedLottieStyle]}>
                <LottieView
                  source={require("../assets/animations/swipe-up-fast.json")}
                  autoPlay
                  loop
                  speed={1}
                  style={styles.lottie}
                />
              </Animated.View>
            </View>
          </Animated.View>
        </PanGestureHandler>

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.loginCard, animatedCardStyle]}>
            {/* Login content - hidden until swiped */}
            <Animated.View style={contentOpacity}>
              <View style={styles.dragHandle} />
              <Text style={styles.loginTitle}>Login to continue</Text>

              {errorMsg ? (
                <Text style={{ color: "red", marginBottom: 10, textAlign: "center" }}>
                  {errorMsg}
                </Text>
              ) : null}

              {/* Email */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.transparentInput}
                  keyboardType="email-address"
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                />
              </View>

              {/* Password */}
              <View style={styles.fieldWrapper}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={{
                      flex: 1,
                      paddingHorizontal: 3,
                      height: 55,
                      fontSize: 16,
                      color: "#000",
                      backgroundColor: "transparent",
                    }}
                    secureTextEntry={secureText}
                    value={password}
                    placeholder="Enter your password..."
                    onChangeText={setPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setSecureText(!secureText)}
                  >
                    <MaterialIcons
                      name={secureText ? "visibility-off" : "visibility"}
                      size={25}
                      color="#888"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={onForgotPassword}
                  disabled={loading}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Separator */}
              <View style={styles.separator}>
                <View style={styles.line} />
                <TouchableOpacity onPress={onGoogleSignIn} disabled={loading}>
                  <Image
                    source={require("../assets/icons/google.png")}
                    style={styles.googleIcon}
                  />
                </TouchableOpacity>
                <View style={styles.line} />
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>

              {/* Footer */}
              <Text style={styles.footerText}>
                Don't have an account?{" "}
                <Text
                  style={{
                    color: "#02D1FF",
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                  onPress={() => router.push('/signup_screen')}
                >
                  Sign up
                </Text>
              </Text>
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upperSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height,
    zIndex: 1,
  },
  upperContent: {
    flex: 1,
    paddingTop: 100,
    zIndex: 2,
  },
  fieldWrapper: {
    marginBottom: 15,
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
  loginCard: {
    position: "absolute",
    top: height * 0.98,
    left: 0,
    right: 0,
    height: height * 0.65,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 19,
    zIndex: 2,
  },
  dragHandle: {
    width: 60,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#000",
    alignSelf: "center",
    marginBottom: 30,
  },
  loginTitle: {
    fontSize: 22,
    fontFamily: "PoppinsSemiBold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f0f0f0",
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
  },
  eyeIcon: {
    padding: 10,
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  googleIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 15,
  },
  footerText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
    fontFamily: "PoppinsSemiBold",
    marginLeft: 5,
  },
  transparentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 55,
    fontSize: 16,
    color: "#000",
    backgroundColor: "transparent",
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
  },

  forgotPasswordText: {
    color: "#797979",
    fontFamily: "Poppins",
    textDecorationLine: "underline",
  },

  loginButton: {
    backgroundColor: "#662D99", // purple
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
  lottieWrapper: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: 100,
    height: 100,
  },

  lottie: {
    width: "100%",
    height: "100%",
  },
});
