import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import BottomCard from "../components/universal_card";
import { API_BASE_URL, handleApiError, storeToken } from "./utils/api";

const { height, width } = Dimensions.get("window");

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export default function GetStartedScreen() {
  const router = useRouter();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const keyboardHeight = useSharedValue(0);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: "Too Weak",
    color: "#ff3b30"
  });

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
    flex: 1,
  }));

  function validateForm() {
    const errors: ValidationErrors = {};
    
    // First Name validation
    if (!firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (firstName.length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    } else if (firstName.length > 50) {
      errors.firstName = "First name must be less than 50 characters";
    } else if (!/^[a-zA-Z\s-']+$/.test(firstName)) {
      errors.firstName = "First name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Last Name validation
    if (!lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    } else if (lastName.length > 50) {
      errors.lastName = "Last name must be less than 50 characters";
    } else if (!/^[a-zA-Z\s-']+$/.test(lastName)) {
      errors.lastName = "Last name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Email validation
    if (!email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else {
      if (password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      } else if (!/[A-Z]/.test(password)) {
        errors.password = "Password must contain at least one uppercase letter";
      } else if (!/[a-z]/.test(password)) {
        errors.password = "Password must contain at least one lowercase letter";
      } else if (!/[0-9]/.test(password)) {
        errors.password = "Password must contain at least one number";
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.password = "Password must contain at least one special character";
      }
    }

    // Confirm Password validation
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0 ? null : "Please fix the errors in the form";
  }

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, label: "Too Weak", color: "#ff3b30" };
    }

    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Complexity check
    if (password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) {
      score += 1;
    }

    // Determine strength level
    if (score <= 2) {
      return { score, label: "Too Weak", color: "#ff3b30" };
    } else if (score <= 4) {
      return { score, label: "Weak", color: "#ff9500" };
    } else if (score <= 6) {
      return { score, label: "Medium", color: "#ffcc00" };
    } else if (score <= 8) {
      return { score, label: "Strong", color: "#34c759" };
    } else {
      return { score, label: "Very Strong", color: "#30b0c7" };
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordStrength(calculatePasswordStrength(text));
    setValidationErrors(prev => ({ ...prev, password: undefined }));
  };

  async function handleSignUp() {
    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          response: {
            data: data
          }
        };
      }

      if (data.token) {
        await storeToken(data.token);
      }
      
      router.push("/splash_screen");
    } catch (e) {
      const errorMessage = handleApiError(e);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <Animated.View style={animatedStyle}>
        <ImageBackground
          source={require("../assets/images/signup-bg.jpg")}
          style={[StyleSheet.absoluteFill, styles.backgroundImage]}
          resizeMode="cover"
        />

        {/* Top Text Positioned Above the Card */}
        <View style={styles.textContainer}>
          <Text style={styles.heading}>
            <Text style={styles.headingHighlight}>Signup.{"\n"}</Text>
            See through AI{"\n"}
            edits!
          </Text>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          showsVerticalScrollIndicator={false}
        >
          <BottomCard height={height * 0.78} title="Signup to continue">
            <View style={styles.form}>
              {/* First Name */}
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={[styles.input, validationErrors.firstName && styles.inputError]}
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  setValidationErrors(prev => ({ ...prev, firstName: undefined }));
                }}
              />
              {validationErrors.firstName && (
                <Text style={styles.errorText}>{validationErrors.firstName}</Text>
              )}

              {/* Last Name */}
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={[styles.input, validationErrors.lastName && styles.inputError]}
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  setValidationErrors(prev => ({ ...prev, lastName: undefined }));
                }}
              />
              {validationErrors.lastName && (
                <Text style={styles.errorText}>{validationErrors.lastName}</Text>
              )}

              {/* Email */}
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, validationErrors.email && styles.inputError]}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setValidationErrors(prev => ({ ...prev, email: undefined }));
                }}
              />
              {validationErrors.email && (
                <Text style={styles.errorText}>{validationErrors.email}</Text>
              )}

              {/* Password */}
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, validationErrors.password && styles.inputError]}
                  placeholder="Enter password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={handlePasswordChange}
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
              
              {/* Password Strength Indicator */}
              <View style={styles.strengthContainer}>
                <View style={styles.strengthMeter}>
                  <View 
                    style={[
                      styles.strengthBar, 
                      { 
                        width: `${(passwordStrength.score / 8) * 100}%`,
                        backgroundColor: passwordStrength.color 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                  {passwordStrength.label}
                </Text>
              </View>

              {validationErrors.password && (
                <Text style={styles.errorText}>{validationErrors.password}</Text>
              )}

              {/* Confirm Password */}
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, validationErrors.confirmPassword && styles.inputError]}
                  placeholder="Confirm password"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setValidationErrors(prev => ({ ...prev, confirmPassword: undefined }));
                  }}
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
              {validationErrors.confirmPassword && (
                <Text style={styles.errorText}>{validationErrors.confirmPassword}</Text>
              )}

              {/* General Error Message */}
              {error && <Text style={styles.errorText}>{error}</Text>}

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[styles.signupButton, loading && styles.signupButtonDisabled]}
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text style={styles.signupButtonText}>
                  {loading ? "Signing Up..." : "Sign Up"}
                </Text>
              </TouchableOpacity>

              {/* Footer Text */}
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text
                  style={styles.footerLink}
                  onPress={() => router.push("/splash_screen")}
                >
                  Login
                </Text>
              </Text>
            </View>
          </BottomCard>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    transform: [{ translateY: -height * 0.55 }],
  },
  textContainer: {
    position: "absolute",
    left: "5%",
    right: "5%",
    bottom: height * 0.805, // height * 0.78 + ~2.5% for spacing
  },
  heading: {
    fontSize: 30,
    color: "white",
    fontFamily: "PoppinsSemiBold",
  },
  headingHighlight: {
    color: "#662D99",
    fontFamily: "PoppinsExtraBold",
  },
  form: {
    marginTop: -10,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
    fontFamily: "PoppinsSemiBold",
    marginLeft: 5,
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
  inputWrapper: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12.5,
  },
  signupButton: {
    backgroundColor: "#662D99",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
  footerText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 15,
  },
  footerLink: {
    color: "#02D1FF",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  inputError: {
    borderColor: '#ff3b30',
    borderWidth: 1,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
    fontFamily: "PoppinsRegular",
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  strengthContainer: {
    marginTop: -10,
    marginBottom: 15,
  },
  strengthMeter: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5,
    fontFamily: "PoppinsMedium",
  },
});
