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
  View
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import BottomCard from "../components/universal_card";
import { API_BASE_URL, handleApiError, storeToken } from "./utils/api";

const { height, width } = Dimensions.get("window");

type FormFields = 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword' | 'phone';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}

export default function GetStartedScreen() {
  const router = useRouter();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation state
  const [touchedFields, setTouchedFields] = useState<Record<FormFields, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const keyboardHeight = useSharedValue(0);

  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: "Too Weak",
    color: "#ff3b30"
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

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

  // Calculate password strength
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

  // Enhanced field validation
  const validateField = (field: FormFields, value: string): string | undefined => {
    switch (field) {
      case 'firstName':
        if (!value.trim()) return "First name is required";
        if (value.length < 2) return "First name must be at least 2 characters";
        if (value.length > 50) return "First name must be less than 50 characters";
        if (!/^[a-zA-Z\s-']+$/.test(value)) return "First name can only contain letters, spaces, hyphens, and apostrophes";
        break;

      case 'lastName':
        if (!value.trim()) return "Last name is required";
        if (value.length < 2) return "Last name must be at least 2 characters";
        if (value.length > 50) return "Last name must be less than 50 characters";
        if (!/^[a-zA-Z\s-']+$/.test(value)) return "Last name can only contain letters, spaces, hyphens, and apostrophes";
        break;

      case 'email':
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        break;

      case 'password':
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters long";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number";
        if (!/[^A-Za-z0-9]/.test(value)) return "Password must contain at least one special character";
        break;

      case 'confirmPassword':
        if (!value) return "Please confirm your password";
        if (value !== password) return "Passwords do not match";
        break;
    }
    return undefined;
  };

  // Handle field blur with validation
  const handleBlur = (field: FormFields) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    const value = getFieldValue(field);
    const error = validateField(field, value);
    setValidationErrors(prev => ({ ...prev, [field]: error }));
  };

  // Handle field change with validation
  const handleFieldChange = (field: FormFields, value: string) => {
    switch (field) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        setPasswordStrength(calculatePasswordStrength(value));
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }

    if (touchedFields[field]) {
      const error = validateField(field, value);
      setValidationErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  function validateForm() {
    const errors: ValidationErrors = {};
    let hasErrors = false;

    // Validate all fields
    const fields: FormFields[] = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'];
    fields.forEach(field => {
      const value = getFieldValue(field);
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
        hasErrors = true;
      }
    });

    setValidationErrors(errors);
    setTouchedFields({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    return hasErrors;
  }

  async function handleSignUp() {
    if (validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Attempting signup with:', { email, firstName, lastName });
      
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
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        throw {
          response: {
            data: data
          }
        };
      }

      // Store the token if it's included in the response
      if (data.token) {
        console.log('Token received, storing...');
        await storeToken(data.token);
        console.log('Token stored successfully');
      }

      // Navigate to login screen on success
      router.push("/splash_screen");
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = handleApiError(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Style helper for labels and inputs
  const getLabelStyle = (field: FormFields) => [
    styles.label,
    isFieldInvalid(field, getFieldValue(field)) && styles.labelError
  ];

  const getInputStyle = (field: FormFields) => [
    styles.input,
    isFieldInvalid(field, getFieldValue(field)) && styles.inputError
  ];

  // Helper to get field value
  const getFieldValue = (field: FormFields): string => {
    switch (field) {
      case 'firstName':
        return firstName;
      case 'lastName':
        return lastName;
      case 'email':
        return email;
      case 'phone':
        return phone;
      case 'password':
        return password;
      case 'confirmPassword':
        return confirmPassword;
      default:
        return '';
    }
  };

  // Helper function to check if a field is invalid
  const isFieldInvalid = (field: FormFields, value: string) => {
    if (!touchedFields[field]) return false;
    
    switch (field) {
      case 'firstName':
      case 'lastName':
        return !value.trim();
      case 'email':
        const emailRegex = /\S+@\S+\.\S+/;
        return !emailRegex.test(value);
      case 'password':
        return !value || value.length < 6;
      case 'confirmPassword':
        return !value || value !== password;
      default:
        return false;
    }
  };

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
              <Text style={getLabelStyle('firstName')}>First Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={getInputStyle('firstName')}
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={(text) => handleFieldChange('firstName', text)}
                onBlur={() => handleBlur('firstName')}
              />

              {/* Last Name */}
              <Text style={getLabelStyle('lastName')}>Last Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={getInputStyle('lastName')}
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={(text) => handleFieldChange('lastName', text)}
                onBlur={() => handleBlur('lastName')}
              />

              {/* Email */}
              <Text style={getLabelStyle('email')}>Email <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={getInputStyle('email')}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => handleFieldChange('email', text)}
                onBlur={() => handleBlur('email')}
              />

              {/* Phone */}
              <Text style={getLabelStyle('phone')}>Phone Number <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={getInputStyle('phone')}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(text) => handleFieldChange('phone', text)}
                onBlur={() => handleBlur('phone')}
              />

              {/* Password */}
              <Text style={getLabelStyle('password')}>Password <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={getInputStyle('password')}
                  placeholder="Enter password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => handleFieldChange('password', text)}
                  onBlur={() => handleBlur('password')}
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
              <Text style={getLabelStyle('confirmPassword')}>Confirm Password <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={getInputStyle('confirmPassword')}
                  placeholder="Confirm password"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(text) => handleFieldChange('confirmPassword', text)}
                  onBlur={() => handleBlur('confirmPassword')}
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

              {/* Error Message */}
              {error && <Text style={styles.errorText}>{error}</Text>}

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[styles.signupButton, loading && { opacity: 0.6 }]}
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
    color: "#02D1FF",
    fontFamily: "PoppinsExtraBold",
    fontSize: 40,
  },
  form: {
    marginTop: 5,
    paddingHorizontal: 5,
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "PoppinsSemiBold",
  },
  labelError: {
    color: '#FF3B30',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  required: {
    color: '#FF3B30',
    fontSize: 16,
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