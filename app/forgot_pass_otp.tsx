import React, { useState, useEffect } from "react";
import {
  View,
  Text,
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
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { OtpInput } from "react-native-otp-entry";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");

export default function ForgotPassOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userEmail = params.email as string;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
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

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0 && resendDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, resendDisabled]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      // For testing: accept 000000 as valid OTP
      if (otp === "000000") {
        // Navigate to reset password screen 
        router.push({
          pathname: "/reset_password",
          params: { email: userEmail }
        });
        return;
      }

      // Regular API verification
      const response = await fetch("https://your-api.com/verify-forgot-password-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          otp: otp,
        }),
      });

      if (response.ok) {
        // Navigate to reset password screen
        router.push({
          pathname: "/reset_password",
          params: { email: userEmail }
        });
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendDisabled(true);
    setCountdown(30);
    setLoading(true);

    try {
      const response = await fetch("https://your-api.com/resend-forgot-password-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "OTP has been resent to your email");
      } else {
        throw new Error("Failed to resend OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
      setResendDisabled(false);
      setCountdown(0);
    } finally {
      setLoading(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboardHeight.value }],
  }));

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
          <Text style={styles.headingHighlight}>Verification.{"\n"}</Text>
          Check your email{"\n"}
          for OTP!
        </Text>
      </Animated.View>

      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        <BottomCard title="Enter OTP" height={height * 0.42}>
          <View style={styles.inner}>
            <Text style={styles.instructions}>
              We've sent a verification code to{"\n"}
              <Text style={styles.emailText}>{userEmail}</Text>
            </Text>

            <View style={styles.otpContainer}>
              <OtpInput
                numberOfDigits={6}
                focusColor="#662D99"
                focusStickBlinkingDuration={500}
                onTextChange={setOtp}
                onFilled={setOtp}
                hideStick={true}
                textInputProps={{ accessibilityLabel: "OTP" }}
                theme={{
                  containerStyle: styles.otpContainerStyle,
                  pinCodeContainerStyle: styles.pinCodeContainer,
                  pinCodeTextStyle: styles.pinCodeText,
                  focusStickStyle: styles.focusStick,
                  focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                }}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleVerify}
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={resendDisabled || loading}
              >
                <Text
                  style={[
                    styles.resendText,
                    (resendDisabled || loading) && styles.resendTextDisabled,
                  ]}
                >
                  {resendDisabled
                    ? `Resend OTP in ${countdown}s`
                    : "Resend OTP"}
                </Text>
              </TouchableOpacity>
            </View>
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
  instructions: {
    fontSize: 16,
    marginBottom: 25,
    color: "#333",
    fontFamily: "Poppins",
    textAlign: "center"
  },
  emailText: {
    color: "#662D99",
    fontFamily: "PoppinsSemiBold",
  },
  otpContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
  },
  otpContainerStyle: {
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
    gap: 10,
  },
  pinCodeContainer: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  pinCodeText: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
    fontFamily: "PoppinsSemiBold",
  },
  focusStick: {
    position: "absolute",
    bottom: 0,
    width: "90%",
    height: 2,
    backgroundColor: "#000",
  },
  activePinCodeContainer: {
    borderColor: "#000",
  },
  button: {
    backgroundColor: "#662D99",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "PoppinsBold",
  },
  resendContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resendText: {
    color: "#662D99",
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
    textDecorationLine: "underline",
  },
  resendTextDisabled: {
    color: "#999",
    textDecorationLine: "none",
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
