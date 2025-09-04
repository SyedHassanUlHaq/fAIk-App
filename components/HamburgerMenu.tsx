import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  Easing,
} from 'react-native';
import { scale } from '@/responsive';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  iconFamily: 'MaterialIcons' | 'Ionicons' | 'AntDesign';
  route?: string;
  onPress?: () => void;
}

interface HamburgerMenuProps {
  currentScreen?: string;
}

export default function HamburgerMenu({ currentScreen = 'home' }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-SCREEN_WIDTH));
  const [overlayAnim] = useState(new Animated.Value(0));
  const [anim] = useState(new Animated.Value(0)); // for hamburger animation
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      id: 'subscriptions',
      title: 'Subscriptions',
      icon: 'credit-card', // MaterialIcons
      iconFamily: 'MaterialIcons',
      route: '/subscriptions',
    },
    {
      id: 'share-profile',
      title: 'Share Profile Link',
      icon: 'share-social', // Ionicons
      iconFamily: 'Ionicons',
      onPress: () => console.log('Share Profile Link pressed'),
    },
    {
      id: 'delete-account',
      title: 'Delete Account',
      icon: 'trash', // Ionicons
      iconFamily: 'Ionicons',
      onPress: () => console.log('Delete Account pressed'),
    },
    {
      id: 'privacy-policy',
      title: 'View Privacy Policy',
      icon: 'lock-closed', // Ionicons
      iconFamily: 'Ionicons',
      route: '/privacy-policy',
    },
    {
      id: 'terms',
      title: 'View Terms of Service',
      icon: 'document-text', // Ionicons
      iconFamily: 'Ionicons',
      route: '/terms-of-service',
    },
    {
      id: 'licensing',
      title: 'View Licensing Info',
      icon: 'information-circle', // Ionicons
      iconFamily: 'Ionicons',
      route: '/licensing-info',
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: 'logout', // AntDesign
      iconFamily: 'AntDesign',
      onPress: () => console.log('Logout pressed'),
    },
  ];

  const toggleMenu = () => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: -SCREEN_WIDTH,
          useNativeDriver: true,
          damping: 20,
          stiffness: 150,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0, // back to hamburger
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 150,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 1, // morph to X
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // 🔄 Hamburger line animations
  const line1Style = {
    transform: [
      {
        rotate: anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 6],
        }),
      },
    ],
  };

  const line2Style = {
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
  };

  const line3Style = {
    transform: [
      {
        rotate: anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-45deg'],
        }),
      },
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -6],
        }),
      },
    ],
  };

  const handleMenuItemPress = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route as any);
    } else if (item.onPress) {
      item.onPress();
    }
    toggleMenu();
  };

  const getIconComponent = (iconFamily: string, iconName: string, color: string, size: number) => {
    switch (iconFamily) {
      case 'MaterialIcons':
        return <MaterialIcons name={iconName as any} size={size} color={color} />;
      case 'Ionicons':
        return <Ionicons name={iconName as any} size={size} color={color} />;
      case 'AntDesign':
        return <AntDesign name={iconName as any} size={size} color={color} />;
      default:
        return <MaterialIcons name="help" size={size} color={color} />;
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <TouchableOpacity style={styles.hamburgerButton} onPress={toggleMenu} activeOpacity={0.85}>
        <Animated.View style={[styles.hamburgerLine, line1Style]} />
        <Animated.View style={[styles.hamburgerLine, line2Style]} />
        <Animated.View style={[styles.hamburgerLine, line3Style]} />
      </TouchableOpacity>

      {/* Overlay */}
      <Modal visible={isOpen} transparent animationType="none" onRequestClose={toggleMenu}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayAnim,
            },
          ]}
        >
          <TouchableOpacity style={styles.overlayTouchable} activeOpacity={1} onPress={toggleMenu} />
        </Animated.View>

        {/* Menu Panel */}
        <Animated.View
          style={[
            styles.menuPanel,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.menuHeader}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <MaterialIcons name="person" size={scale(24)} color="#fff" />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>Emma Phillips</Text>
                <Text style={styles.userRole}>AI Model Specialist</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={toggleMenu} activeOpacity={0.8}>
              <Ionicons name="close" size={scale(24)} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Items */}
          <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, currentScreen === item.id && styles.menuItemActive]}
                onPress={() => handleMenuItemPress(item)}
                activeOpacity={0.85}
              >
                <View style={styles.menuItemLeft}>
                  <View
                    style={[
                      styles.menuItemIcon,
                      currentScreen === item.id && styles.menuItemIconActive,
                    ]}
                  >
                    {getIconComponent(
                      item.iconFamily,
                      item.icon,
                      currentScreen === item.id ? '#FF2628' : '#666',
                      scale(20),
                    )}
                  </View>
                  <Text
                    style={[
                      styles.menuItemText,
                      currentScreen === item.id && styles.menuItemTextActive,
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>
                {currentScreen === item.id && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.menuFooter}>
            <Text style={styles.footerText}>fAIk App v1.0.0</Text>
            <Text style={styles.footerSubtext}>AI-Powered Media Analysis</Text>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
    hamburgerButton: {
      position: 'absolute',
      top: scale(45),
      left: scale(16),
      zIndex: 1000,
      width: scale(36),
      height: scale(36),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: scale(18),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 4,
    },
    hamburgerLine: {
      width: scale(16),
      height: scale(2),
      backgroundColor: '#FF2628',
      marginVertical: scale(2),
      borderRadius: scale(1),
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    overlayTouchable: {
      flex: 1,
    },
    menuPanel: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: SCREEN_WIDTH * 0.7, // slimmer panel
      height: SCREEN_HEIGHT,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    menuHeader: {
      backgroundColor: '#FF2628',
      paddingTop: scale(50),
      paddingBottom: scale(14),
      paddingHorizontal: scale(14),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatar: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(10),
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      color: '#fff',
      fontFamily: 'PoppinsBold',
      fontSize: scale(14),
      marginBottom: scale(1),
    },
    userRole: {
      color: 'rgba(255, 255, 255, 0.85)',
      fontFamily: 'PoppinsMedium',
      fontSize: scale(11),
    },
    closeButton: {
      width: scale(28),
      height: scale(28),
      borderRadius: scale(14),
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuItems: {
      flex: 1,
      paddingTop: scale(14),
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: scale(12),
      paddingHorizontal: scale(14),
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    menuItemActive: {
      backgroundColor: 'rgba(255, 38, 40, 0.05)',
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuItemIcon: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(16),
      backgroundColor: '#f8f9fa',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(12),
    },
    menuItemIconActive: {
      backgroundColor: 'rgba(255, 38, 40, 0.12)',
    },
    menuItemText: {
      fontFamily: 'PoppinsMedium',
      fontSize: scale(14),
      color: '#333',
    },
    menuItemTextActive: {
      fontFamily: 'PoppinsBold',
      color: '#FF2628',
    },
    activeIndicator: {
      width: scale(3),
      height: scale(18),
      backgroundColor: '#FF2628',
      borderRadius: scale(1.5),
    },
    menuFooter: {
      padding: scale(14),
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
      alignItems: 'center',
    },
    footerText: {
      fontFamily: 'PoppinsBold',
      fontSize: scale(11),
      color: '#666',
      marginBottom: scale(2),
    },
    footerSubtext: {
      fontFamily: 'PoppinsMedium',
      fontSize: scale(9),
      color: '#999',
    },
  });
  