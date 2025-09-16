import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { scale } from "@/responsive";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import BottomCard from "@/components/common/universal_card";
import { useState, useEffect } from "react";
import { getToken } from "@/utils/api";
const { height } = Dimensions.get("window");

export default function DashboardProfileScreen() {
  const router = useRouter();
  
  // Authentication state - check actual token
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        setIsAuthenticated(!!token);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);
  
  return (
    <ImageBackground
      source={require("@/assets/images/dash.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      {/* Lock Overlay when not authenticated */}
      {!isCheckingAuth && !isAuthenticated && (
        <View style={styles.lockOverlay}>
          <View style={styles.lockContent}>
            <MaterialIcons name="lock" size={scale(48)} color="#FF2628" />
            <Text style={styles.lockTitle}>Login Required</Text>
            <Text style={styles.lockDescription}>
              Please log in to access your profile and account settings
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.loginButtonText}>Login Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <View style={styles.headerBlock}>
        <TouchableOpacity style={styles.topBackBtn} onPress={() => router.replace('/(dashboard)/home')}>
          <Ionicons name="chevron-back" size={scale(26)} color="#000" />
        </TouchableOpacity>
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <MaterialIcons name="person" size={scale(46)} color="#fff" />
          </View>
          <Text style={styles.name}>Emma Phillips</Text>
          <Text style={styles.role}>AI Model</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="call" size={scale(20)} color="#333" />
          <Text style={styles.infoText}>(581)-307-6902</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="email" size={scale(20)} color="#333" />
          <Text style={styles.infoText}>emma.phillips@gmail.com</Text>
        </View>
      </View>

      <BottomCard title="Profile" showBack={false} height={height * 0.6}>
        {/* <Text style={styles.cardTitle}>Profile</Text> */}
        <TouchableOpacity style={styles.cardRow} onPress={() => router.push('/manage-user')}>
          <MaterialIcons
            name="manage-accounts"
            size={scale(24)}
            color="#FF2628"
          />
          <Text style={styles.cardText}>Manage User</Text>
          <MaterialIcons
            name="chevron-right"
            size={scale(22)}
            color="#222"
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardRow}>
          <MaterialIcons name="receipt-long" size={scale(24)} color="#FF2628" />
          <Text style={styles.cardText}>Payment</Text>
          <MaterialIcons
            name="chevron-right"
            size={scale(22)}
            color="#222"
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>

        <Image
          source={require("@/assets/images/profile-image.jpg")}
          style={styles.illustration}
          resizeMode="contain"
        />

        <TouchableOpacity style={styles.signOutBtn}>
          <MaterialIcons
            name="power-settings-new"
            size={scale(22)}
            color="#fff"
          />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </BottomCard>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingTop: 0,
    paddingBottom: scale(24),
  },
  headerBlock: { paddingHorizontal: scale(20), paddingTop: scale(40) },
  topBackBtn: { position: 'absolute', left: scale(12), top: scale(50), zIndex: 5, padding: scale(6) },
  header: { alignItems: "center", marginBottom: scale(12), marginTop: scale(20) },
  avatarCircle: {
    width: scale(99),
    height: scale(99),
    borderRadius: scale(55),
    backgroundColor: "#FF2628",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: scale(8),
  },
  name: { fontFamily: "PoppinsExtraBold", fontSize: scale(24), color: "#000" },
  role: { fontFamily: "PoppinsMedium", fontSize: scale(17), color: "#666" },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(14),
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
  },
  infoText: { fontSize: scale(15), color: "#333", fontFamily: "PoppinsMedium" },
  card: { backgroundColor: "transparent" },
  cardTitle: {
    fontFamily: "PoppinsBold",
    fontSize: scale(16),
    color: "#111",
    marginBottom: scale(8),
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(12),
    gap: scale(10),
  },
  cardText: { color: "#111", fontFamily: "PoppinsMedium", fontSize: scale(14) },
  illustration: {
    width: "100%",
    height: scale(190),
    marginTop: scale(12),
    borderRadius: scale(8),
    alignSelf: "stretch",
  },
  signOutBtn: {
    marginTop: scale(18),
    backgroundColor: "#FF2628",
    height: scale(48),
    borderRadius: scale(24),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: scale(8),
  },
  signOutText: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: scale(16),
  },
  
  // Lock overlay styles
  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  lockContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: scale(30),
    margin: scale(20),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  lockTitle: {
    fontSize: scale(24),
    fontFamily: "PoppinsBold",
    color: "#FF2628",
    marginTop: scale(16),
    marginBottom: scale(12),
    textAlign: "center",
  },
  lockDescription: {
    fontSize: scale(16),
    fontFamily: "Poppins",
    color: "#666",
    textAlign: "center",
    lineHeight: scale(24),
    marginBottom: scale(24),
  },
  loginButton: {
    backgroundColor: "#FF2628",
    paddingHorizontal: scale(32),
    paddingVertical: scale(12),
    borderRadius: scale(25),
    elevation: 3,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: scale(16),
    fontFamily: "PoppinsSemiBold",
  },
});
