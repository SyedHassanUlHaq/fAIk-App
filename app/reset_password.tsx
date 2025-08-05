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
import { useRouter, useLocalSearchParams } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const { height } = Dimensions.get("window");

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userEmail = params.email as string;
  const resetToken = params.resetToken as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

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

  // Password validation function
  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(pass)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(pass)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(pass)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*]/.test(pass)) {
      return "Password must contain at least one special character (!@#$%^&*)";
    }
    return null;
  };

  // Update password validation on change
  useEffect(() => {
    if (touched.password) {
      setPasswordError(validatePassword(password));
    }
  }, [password, touched.password]);

  const isPasswordInvalid = () => {
    if (!touched.password) return false;
    return !password || !!passwordError;
  };

  const isConfirmPasswordInvalid = () => {
    if (!touched.confirmPassword) return false;
    return !confirmPassword || confirmPassword !== password;
  };

  const handleResetPassword = async () => {
    // Mark all fields as touched
    setTouched({
      password: true,
      confirmPassword: true,
    });

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    setLoading(true);

    try {
      // For testing: Skip API call if using test token
      if (resetToken === "test_reset_token") {
        Alert.alert(
          "Success",
          "Password reset successful! Please login with your new password.",
          [
            {
              text: "Continue",
              onPress: () => router.push("/splash_screen"),
            },
          ]
        );
        return;
      }

      const response = await fetch("https://your-api.com/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          password: password,
          resetToken: resetToken,
        }),
      });

      if (response.ok) {
        Alert.alert(
          "Success",
          "Password reset successful! Please login with your new password.",
          [
            {
              text: "Continue",
              onPress: () => router.push("/splash_screen"),
            },
          ]
        );
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to reset password");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getLabelStyle = (field: "password" | "confirmPassword") => [
    styles.label,
    (field === "password" ? isPasswordInvalid() : isConfirmPasswordInvalid()) &&
      styles.labelError,
  ];

  const getInputStyle = (field: "password" | "confirmPassword") => [
    styles.input,
    (field === "password" ? isPasswordInvalid() : isConfirmPasswordInvalid()) &&
      styles.inputError,
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ImageBackground
        source={require("../assets/images/reset-pass-bg.png")}
        style={[StyleSheet.absoluteFill, styles.backgroundImage]}
        resizeMode="cover"
      />

      <Animated.View style={[styles.textContainer, animatedStyle]}>
        <Text style={styles.heading}>
          <Text style={styles.headingHighlight}>Here we goo!!{"\n"}</Text>
          Change your{"\n"}
          password!
        </Text>
      </Animated.View>

      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        <BottomCard title="Reset Password" height={height * 0.48}>
          <View style={styles.inner}>
            {/* Password */}
            <Text style={getLabelStyle("password")}>
              New Password <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={getInputStyle("password")}
                placeholder="Enter new password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, password: true }))
                }
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={25}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
            {touched.password && passwordError && (
              <Text style={styles.errorText}>{passwordError}</Text>
            )}

            {/* Confirm Password */}
            <Text style={getLabelStyle("confirmPassword")}>
              Confirm Password <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={getInputStyle("confirmPassword")}
                placeholder="Confirm new password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, confirmPassword: true }))
                }
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <MaterialIcons
                  name={showConfirmPassword ? "visibility-off" : "visibility"}
                  size={25}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Reset Password</Text>
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
    marginTop: 15,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
    fontFamily: "PoppinsSemiBold",
    marginLeft: 5,
  },
  labelError: {
    color: "#FF3B30",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "transparent",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  inputWrapper: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12.5,
  },
  button: {
    backgroundColor: "#FF2628",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
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
    bottom: height * 0.505,
  },
  heading: {
    fontSize: 30,
    color: "#000000",
    fontFamily: "PoppinsSemiBold",
  },
  headingHighlight: {
    color: "#FF2628",
    fontFamily: "PoppinsExtraBold",
    fontSize: 40,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
    fontFamily: "Poppins",
  },
});
