import HamburgerMenu from "@/components/layout/HamburgerMenu";
import { scale } from "@/responsive";
import { fetchDashboardMock, getToken, type DashboardData } from "@/utils/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function DashboardHomeScreen() {
  const router = useRouter();
  
  // Authentication state - check actual token
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedRange, setSelectedRange] = useState<"today" | "week" | "all">("week");

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

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetchDashboardMock();
      if (mounted) setData(res);
    })();
    return () => {
      mounted = false;
    };
  }, []);


  return (
    <ImageBackground
      source={require("@/assets/images/dash.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <HamburgerMenu currentScreen="home" />
      
      {/* Lock Overlay when not authenticated */}
      {!isCheckingAuth && !isAuthenticated && (
        <View style={styles.lockOverlay}>
          <View style={styles.lockContent}>
            <MaterialIcons name="lock" size={scale(48)} color="#FF2628" />
            <Text style={styles.lockTitle}>Login Required</Text>
            <Text style={styles.lockDescription}>
              Please log in to access your dashboard and view analytics
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
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero / Logo */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.logoWrap}>
          <Image
            source={require("@/assets/images/logo-1.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.welcomeWrap}>
            <Text style={styles.welcomeTitle}>Welcome,</Text>
            <Text style={styles.welcomeName}>{data?.name ?? "..."}</Text>
          </View>
        </Animated.View>

        {/* Dashboard Stats */}
        <View style={styles.statsGrid}>
          {data ? (
            <>
               <StatCard
                 value={(data?.totalVideos ?? 0).toString()}
                 label="Total Videos"
                 icon={<Ionicons name="videocam" size={24} color="#0473ea" />}
                 gradient={["#E96B56", "#D55A45"]}
                 cardStyle={styles.statCard1}
                 cardNumber={<Ionicons name="videocam" size={28} color="#fff" />}
                 blobStyle={styles.blob1}
               />
               <StatCard
                 value={`${data?.aiGeneratedPercent ?? 0}%`}
                 label="AI Generated"
                 icon={<Ionicons name="warning" size={24} color="#F7A35C" />}
                 gradient={["#F7A35C", "#E8944A"]}
                 cardStyle={styles.statCard2}
                 cardNumber={<Ionicons name="warning" size={28} color="#fff" />}
                 blobStyle={styles.blob2}
               />
               <StatCard
                 value="12"
                 label="Processed Today"
                 icon={<Ionicons name="checkmark-circle" size={24} color="#92B48C" />}
                 gradient={["#92B48C", "#7FA078"]}
                 cardStyle={styles.statCard3}
                 cardNumber={<Ionicons name="checkmark-circle" size={28} color="#fff" />}
                 blobStyle={styles.blob3}
               />
               <StatCard
                 value="Pro Plan"
                 label="Active Package"
                 icon={<Ionicons name="diamond" size={24} color="#8b5cf6" />}
                 gradient={["#8b5cf6", "#7c3aed"]}
                 cardStyle={styles.statCard4}
                 cardNumber={<Ionicons name="diamond" size={28} color="#fff" />}
                 blobStyle={styles.blob4}
               />
            </>
          ) : (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}
        </View>

      </ScrollView>
    </ImageBackground>
  );
}

/* ---------- Components ---------- */

function StatCard({
  value,
  label,
  icon,
  gradient,
  cardStyle,
  cardNumber,
  blobStyle,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  gradient: [string, string];
  cardStyle?: any;
  cardNumber: React.ReactNode;
  blobStyle?: any;
}) {
  return (
    <View style={[styles.cardContainer, cardStyle]}>
      {/* The prominent colored blob with the icon */}
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.coloredBlob, blobStyle]}
      >
        <View style={styles.cardNumberContainer}>{cardNumber}</View>
      </LinearGradient>

      {/* The main white card body */}
      <View style={styles.whiteCardBody}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        <View style={styles.glow} />
      </View>
    </View>
  );
}

function SkeletonCard() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skelIcon} />
      <View style={styles.skelLineWide} />
      <View style={styles.skelLine} />
    </View>
  );
}


/* ---------- Styles ---------- */
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingTop: scale(32),
    paddingBottom: scale(40),
    gap: scale(14),
  },

  /* Hero */
  logoWrap: {
    alignItems: "center",
    marginBottom: scale(6),
  },
  logo: { width: scale(120), height: scale(120), marginBottom: scale(6) },
  welcomeWrap: { alignItems: "center" },
  welcomeTitle: {
    color: "#0A0F1C",
    fontFamily: "PoppinsBold",
    fontSize: scale(24),
    marginBottom: scale(2),
  },
  welcomeName: {
    fontSize: scale(18),
    color: "#4B5563",
    fontFamily: "PoppinsMedium",
  },

  /* Stats */
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: scale(16),
    gap: scale(12),
  },
  cardContainer: {
    position: "relative",
    width: "48%",
    minHeight: scale(150),
    elevation: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    borderRadius: scale(32),
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  whiteCardBody: {
    backgroundColor: "#fafbfc",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: scale(60),
    paddingVertical: scale(20),
    paddingHorizontal: scale(18),
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: scale(32),
    borderBottomRightRadius: scale(32),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    borderTopWidth: 0,
  },
  coloredBlob: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "75%",
    height: scale(60),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    borderTopLeftRadius: scale(32),
    borderTopRightRadius: scale(32),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cardNumberContainer: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  cardNumberText: {
    color: "#fff",
    fontSize: scale(36),
    fontFamily: "PoppinsBold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 1.5,
    fontWeight: "800",
  },
  statValue: {
    color: "#0A0F1C",
    fontSize: scale(28),
    fontFamily: "PoppinsBold",
    marginBottom: scale(8),
    letterSpacing: 0.8,
    fontWeight: "700",
    textAlign: "center",
  },
  statLabel: {
    color: "#64748B",
    fontSize: scale(14),
    fontFamily: "PoppinsSemiBold",
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: scale(20),
    fontWeight: "600",
  },
  glow: {
    position: "absolute",
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -scale(40),
    right: -scale(30),
    opacity: 0.6,
  },

  // Individual card styles with different corner configurations
  statCard1: {
    // Top-left card - colored blob in top-left
  },
  statCard2: {
    // Top-right card - colored blob in top-right
  },
  statCard3: {
    // Bottom-right card - colored blob in bottom-right
  },
  statCard4: {
    // Bottom-left card - colored blob in bottom-left
  },

  // Colored blob styles for each card position - modern organic shapes
  blob1: {
    // Top-left card - prominent top-left corner with modern curve
    borderTopLeftRadius: scale(50),
    borderTopRightRadius: scale(20),
    transform: [{ scale: 1.02 }],
  },
  blob2: {
    // Top-right card - prominent top-right corner with modern curve
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(50),
    transform: [{ scale: 1.02 }],
  },
  blob3: {
    // Bottom-right card - prominent top-right corner with modern curve
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(50),
    transform: [{ scale: 1.02 }],
  },
  blob4: {
    // Bottom-left card - prominent top-left corner with modern curve
    borderTopLeftRadius: scale(50),
    borderTopRightRadius: scale(20),
    transform: [{ scale: 1.02 }],
  },


  /* Skeletons */
  skeletonCard: {
    width: "48%",
    minHeight: scale(110),
    borderRadius: scale(20),
    backgroundColor: "rgba(255,255,255,0.65)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
    paddingVertical: scale(16),
    paddingHorizontal: scale(12),
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  skelIcon: {
    width: scale(36),
    height: scale(36),
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.08)",
    marginBottom: scale(2),
  },
  skelLineWide: {
    width: "60%",
    height: scale(12),
    borderRadius: scale(8),
    backgroundColor: "rgba(15,23,42,0.08)",
  },
  skelLine: {
    width: "40%",
    height: scale(10),
    borderRadius: scale(8),
    backgroundColor: "rgba(15,23,42,0.08)",
  },
  packageBanner: {
    marginTop: scale(20),
    alignItems: "center",
  },
  
  packageGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scale(10),
    paddingHorizontal: scale(18),
    borderRadius: scale(14),
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  
  packageText: {
    fontFamily: "PoppinsBold",
    fontSize: scale(14),
    color: "#fff",
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
