import { Dimensions } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useMemo } from "react";
import { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { useAnimatedGestureHandler } from "react-native-reanimated";

const { height } = Dimensions.get("window");

export const SWIPE_THRESHOLD = -height * 0.15;
export const SWIPE_UP_POSITION = -height * 0.6;
export const SWIPE_ANIMATION_DURATION = 500;

/**
 * Custom hook to handle swipe up/down gesture for a card.
 * Returns { translateY, gestureHandler, threshold }
 */
export function useSwipeGesture() {
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      const newTranslateY = ctx.startY + event.translationY;
      translateY.value = newTranslateY > 0 ? 0 : newTranslateY;
    },
    onEnd: (event) => {
      if (event.translationY < SWIPE_THRESHOLD) {
        translateY.value = withTiming(SWIPE_UP_POSITION, { duration: SWIPE_ANIMATION_DURATION });
      } else {
        translateY.value = withTiming(0, { duration: SWIPE_ANIMATION_DURATION });
      }
    },
  });

  return useMemo(
    () => ({
      translateY,
      gestureHandler,
      threshold: SWIPE_THRESHOLD,
    }),
    []
  );
} 