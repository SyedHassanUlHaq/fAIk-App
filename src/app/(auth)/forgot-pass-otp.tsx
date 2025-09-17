import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import BottomCard from "../../components/common/universal_card";

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
          pathname: "/reset-password",
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
          pathname: "/reset-password",
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
        source={require("../../../assets/images/otp-bg.png")}
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
    fontSize: 17,
    marginBottom: 28,
    color: "#4b5563",
    fontFamily: "Poppins-Medium",
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: -0.1,
    lineHeight: 24,
  },
  emailText: {
    color: "#FF2628",
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
    letterSpacing: -0.2,
    textShadowColor: 'rgba(255, 38, 40, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    fontSize: 22,
    color: "#1f2937",
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  focusStick: {
    position: "absolute",
    bottom: 0,
    width: "90%",
    height: 2,
    backgroundColor: "#000",
  },
  activePinCodeContainer: {
    borderColor: "#FF2628",
  },
  button: {
    backgroundColor: "#FF2628",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-Black",
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  resendContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resendText: {
    color: "#FF2628",
    fontSize: 15,
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
    textDecorationLine: "underline",
    letterSpacing: -0.2,
    textShadowColor: 'rgba(255, 38, 40, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    fontSize: 34,
    color: "#1a1a1a",
    fontFamily: "Poppins-Black",
    fontWeight: "900",
    letterSpacing: -1.0,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 42,
  },
  headingHighlight: {
    color: "#FF2628",
    fontFamily: "Poppins-Black",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: -1.2,
    textShadowColor: 'rgba(255, 38, 40, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
});
