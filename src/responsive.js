// utils/responsive.js
import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Base width used to design your UI (e.g., iPhone 11/12 width)
const BASE_WIDTH = 375;

export const scale = (size) => {
  const scaleFactor = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(PixelRatio.roundToNearestPixel(size * scaleFactor));
};
