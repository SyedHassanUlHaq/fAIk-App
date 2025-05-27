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
  ScrollView,
  Alert,
} from "react-native";
import BottomCard from "../components/universal_card";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const { height, width } = Dimensions.get("window");

type FormFields = 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword';

export default function GetStartedScreen() {
  const router = useRouter();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation state
  const [touchedFields, setTouchedFields] = useState<Record<FormFields, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    flex: 1,
  }));

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

  // Handle field blur
  const handleBlur = (field: FormFields) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  function validateForm() {
    // Mark all fields as touched
    setTouchedFields({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const emailRegex = /\S+@\S+\.\S+/;
    return !firstName.trim() || 
           !lastName.trim() || 
           !emailRegex.test(email) || 
           !password || 
           password.length < 6 || 
           password !== confirmPassword;
  }

  async function handleSignUp() {
    if (validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Replace this with your actual signup API call
      await new Promise((res) => setTimeout(res, 1500));

      // Navigate to OTP screen with email
      router.push({
        pathname: "/email_otp",
        params: { email: email }
      });
      
    } catch (e) {
      Alert.alert("Error", "Signup failed. Please try again.");
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
      case 'password':
        return password;
      case 'confirmPassword':
        return confirmPassword;
      default:
        return '';
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
                onChangeText={setFirstName}
                onBlur={() => handleBlur('firstName')}
              />

              {/* Last Name */}
              <Text style={getLabelStyle('lastName')}>Last Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={getInputStyle('lastName')}
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
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
                onChangeText={setEmail}
                onBlur={() => handleBlur('email')}
              />

              {/* Password */}
              <Text style={getLabelStyle('password')}>Password <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={getInputStyle('password')}
                  placeholder="Enter password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
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

              {/* Confirm Password */}
              <Text style={getLabelStyle('confirmPassword')}>Confirm Password <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={getInputStyle('confirmPassword')}
                  placeholder="Confirm password"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
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
});
