import { Stack } from 'expo-router';
import { ThemeProvider } from '../ThemeProvider'; // ✅ custom provider
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    PoppinsLight: require('../assets/fonts/Poppins-Light.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'), 
    PoppinsExtraBold: require('../assets/fonts/Poppins-ExtraBold.ttf'),
    PoppinsBlack: require('../assets/fonts/Poppins-Black.ttf'),
    PoppinsThin: require('../assets/fonts/Poppins-Thin.ttf'),
    PoppinsExtraLight: require('../assets/fonts/Poppins-ExtraLight.ttf'),
    PoppinsItalic: require('../assets/fonts/Poppins-Italic.ttf'),
    PoppinsBoldItalic: require('../assets/fonts/Poppins-BoldItalic.ttf'),
    PoppinsLightItalic: require('../assets/fonts/Poppins-LightItalic.ttf'),
    PoppinsMediumItalic: require('../assets/fonts/Poppins-MediumItalic.ttf'),
    PoppinsSemiBoldItalic: require('../assets/fonts/Poppins-SemiBoldItalic.ttf'),
    PoppinsExtraBoldItalic: require('../assets/fonts/Poppins-ExtraBoldItalic.ttf'),
    PoppinsBlackItalic: require('../assets/fonts/Poppins-BlackItalic.ttf'),
    PoppinsThinItalic: require('../assets/fonts/Poppins-ThinItalic.ttf'), 
  });

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <Stack initialRouteName="splash_screen" 
      screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="splash_screen.tsx"/> */}
        <Stack.Screen name="signup_screen" />
        <Stack.Screen name="email_otp" />
      </Stack>
    </ThemeProvider>
  );
}
