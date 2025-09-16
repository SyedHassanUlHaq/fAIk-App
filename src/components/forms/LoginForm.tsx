import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Animated, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface LoginFormProps {
  loading: boolean;
  errorMsg: string;
  onLogin: (email: string, password: string) => void;
  onForgotPassword: () => void;
  onGoogleSignIn: () => void;
}

export default function LoginForm({ loading, errorMsg, onLogin, onForgotPassword, onGoogleSignIn }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [localError, setLocalError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // Removed auto-focus - keyboard should only open when user taps on input fields

  const shakeForm = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validateAndLogin = async () => {
    setLocalError("");
    setEmailError("");
    setPasswordError("");
    let valid = true;
    
    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email address.");
        valid = false;
      }
    }
    
    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    }
    
    if (!valid) {
      shakeForm();
      return;
    }

    // Show success feedback briefly before calling onLogin
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onLogin(email, password);
    }, 500);
  };

  const handleEmailSubmit = () => {
    // Let user manually navigate between fields
    // Removed automatic focus to prevent focus loop
  };

  return (
    <Animated.View 
      style={[
        styles.formContainer,
        { transform: [{ translateX: shakeAnimation }] }
      ]}
    >
      {errorMsg ? (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {errorMsg}
        </Text>
      ) : null}
      {localError ? (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {localError}
        </Text>
      ) : null}
      
      {/* Success feedback */}
      {showSuccess && (
        <View style={styles.successContainer}>
          <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
          <Text style={styles.successText}>Logging in...</Text>
        </View>
      )}

      {/* Email */}
      <View style={styles.fieldWrapper}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          ref={emailRef}
          style={[
            styles.emailInput,
            emailFocused && styles.inputFocused,
            emailError && styles.inputError,
          ]}
          keyboardType="email-address"
          placeholder="Enter your email"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          accessibilityLabel="Email input"
          accessibilityHint="Enter your email address"
          onFocus={() => {
            console.log('Email focused - this should not happen when clicking on password');
            setEmailFocused(true);
          }}
          onBlur={() => {
            console.log('Email blurred');
            setEmailFocused(false);
          }}
          returnKeyType="next"
          blurOnSubmit={false}
          autoCorrect={false}
        />
        {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
      </View>

      {/* Password */}
      <View style={styles.fieldWrapper}>
        <Text style={styles.label}>Password</Text>
        <View style={[
          styles.passwordContainer,
          passwordFocused && styles.inputFocused,
          passwordError && styles.inputError,
        ]}>
          <TextInput
            ref={passwordRef}
            style={styles.passwordInput}
            secureTextEntry={secureText}
            value={password}
            placeholder="Enter your password..."
            onChangeText={setPassword}
            editable={!loading}
            accessibilityLabel="Password input"
            accessibilityHint="Enter your password"
            onFocus={() => {
              console.log('Password focused - should stay here');
              setPasswordFocused(true);
            }}
            onBlur={() => {
              console.log('Password blurred - this should not happen when clicking on password');
              setPasswordFocused(false);
            }}
            returnKeyType="done"
            blurOnSubmit={false}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
          />
          <TouchableOpacity
            style={styles.eyeIconTouchable}
            onPress={() => setSecureText(!secureText)}
            accessible 
            accessibilityLabel={secureText ? "Show password" : "Hide password"}
            accessibilityRole="button"
            accessibilityHint="Toggle password visibility"
            disabled={loading}
          >
            <MaterialIcons
              name={secureText ? "visibility-off" : "visibility"}
              size={25}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={onForgotPassword}
          disabled={loading}
          accessible 
          accessibilityLabel="Forgot Password"
          accessibilityRole="button"
          accessibilityHint="Navigate to forgot password screen"
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Separator */}
      <View style={styles.separator}>
        <View style={styles.line} />
        <TouchableOpacity 
          onPress={onGoogleSignIn} 
          disabled={loading} 
          accessible 
          accessibilityLabel="Sign in with Google" 
          accessibilityRole="button"
          accessibilityHint="Sign in using Google account"
          style={styles.googleButton}
        >
          <Image
            source={require("../../../assets/icons/google.png")}
            style={styles.googleIcon}
          />
        </TouchableOpacity>
        <View style={styles.line} />
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
        onPress={validateAndLogin}
        disabled={loading}
        accessible 
        accessibilityLabel="Login"
        accessibilityRole="button"
        accessibilityHint="Submit login credentials"
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  fieldWrapper: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
    fontFamily: "PoppinsSemiBold",
    marginLeft: 5,
  },
  emailInput: {
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    color: "#000",
    backgroundColor: "transparent",
    marginBottom: 2,
  },
  transparentInput: {
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    color: "#000",
    backgroundColor: "transparent",
    marginBottom: 2,
  },
  inputFocused: {
    borderColor: "#FF2628",
    shadowColor: "#FF2628",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.03, // Reduced from 0.15
    shadowRadius: 0.5,     // Reduced from 4
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 5,
    marginBottom: 2,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    color: "#4CAF50",
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
    marginLeft: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    marginBottom: 2,
    position: "relative",
    zIndex: 0, // Ensure proper layering
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 0,
    height: 56,
    fontSize: 16,
    color: "#000",
    backgroundColor: "transparent",
  },
  eyeIconTouchable: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44,
    minHeight: 44,
    // Remove zIndex to prevent interference with input
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  forgotPasswordText: {
    color: "#797979",
    fontFamily: "Poppins",
    textDecorationLine: "underline",
    fontSize: 14,
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    marginBottom: 32,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  googleButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  googleIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 15,
  },
  loginButton: {
    backgroundColor: "#FF2628",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 8,
    shadowColor: "#FF2628",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
}); 