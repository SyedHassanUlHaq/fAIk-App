import { useEffect } from "react";
import { Keyboard, Platform } from "react-native";
import { withTiming } from "react-native-reanimated";

/**
 * Custom hook to handle keyboard show/hide and update a shared value for keyboard height.
 * @param keyboardHeight - a Reanimated shared value to update
 */
export function useKeyboard(keyboardHeight: any) {
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
} 