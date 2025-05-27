import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from "react-native";
import BottomCard from "../components/universal_card";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const { height } = Dimensions.get("window");

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const keyboardHeight = useSharedValue(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        keyboardHeight.value = withTiming(e.endCoordinates.height, {
          duration: 300,
        });
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboardHeight.value }],
  }));

  const isEmailInvalid = () => {
    if (!touched) return false;
    if (!email) return true;
    return !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSendOTP = async () => {
    setTouched(true);
    
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return;
    }

    setLoading(true);

    try {
      // For testing: Skip API calls and navigate directly
      router.push({
        pathname: "/forgot_pass_otp",
        params: { 
          email,
          purpose: "reset_password"
        },
      });

      /* Commented out for testing
      // First, check if the email exists
      const checkEmailResponse = await fetch("https://your-api.com/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!checkEmailResponse.ok) {
        if (checkEmailResponse.status === 404) {
          setTouched(true);
          return;
        }
        throw new Error("Failed to verify email");
      }

      // If email exists, proceed with sending OTP
      const sendOTPResponse = await fetch("https://your-api.com/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (sendOTPResponse.ok) {
        router.push({
          pathname: "/forgot_pass_otp",
          params: { 
            email,
            purpose: "reset_password"
          },
        });
      } else {
        throw new Error("Failed to send OTP");
      }
      */
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getLabelStyle = () => [
    styles.label,
    isEmailInvalid() && styles.labelError
  ];

  const getInputStyle = () => [
    styles.input,
    isEmailInvalid() && styles.inputError
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ImageBackground
        source={require("../assets/images/signup-bg.jpg")}
        style={[StyleSheet.absoluteFill, styles.backgroundImage]}
        resizeMode="cover"
      />

      <Animated.View style={[styles.textContainer, animatedStyle]}>
        <Text style={styles.heading}>
          <Text style={styles.headingHighlight}>Oh no.{"\n"}</Text>
          Forgot Password?{"\n"}
          we got you.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        <BottomCard title="Reset Password" height={height * 0.42}>
          <View style={styles.inner}>
            <Text style={styles.instructions}>
              Enter your email address and we'll send you an OTP to reset your password.
            </Text>

            <Text style={getLabelStyle()}>Email <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={getInputStyle()}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setTouched(false);
              }}
              onBlur={() => setTouched(true)}
            />

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleSendOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </View>
        </BottomCard>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    transform: [{ translateY: -height * 0.3 }],
  },
  cardContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  inner: {
    marginTop: 5,
    paddingBottom: 10,
  },
  form: {
    marginTop: 5,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 25,
    color: "#333",
    fontFamily: "Poppins",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
    fontFamily: "PoppinsSemiBold",
    marginLeft: 5,
  },
  labelError: {
    color: '#FF3B30',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "transparent",
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  button: {
    backgroundColor: "#662D99",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
  required: {
    color: "#FF3B30",
    fontSize: 16,
  },
  textContainer: {
    position: "absolute",
    left: "5%",
    right: "5%",
    bottom: height * 0.445,
  },
  heading: {
    fontSize: 30,
    color: "white",
    fontFamily: "PoppinsSemiBold",
  },
  headingHighlight: {
    color: "#02D1FF",
    fontFamily: "PoppinsExtraBold",
    fontSize: 40,
  },
});
