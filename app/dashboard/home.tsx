import HamburgerMenu from "@/components/HamburgerMenu";
import { scale } from "@/responsive";
import { fetchDashboardMock, type DashboardData } from "@/utils/api";
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import RadialProgressRing from "@/components/ProgressRing";

export default function DashboardHomeScreen() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedRange, setSelectedRange] = useState<"today" | "week" | "all">("week");

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

  const recentFiles = useMemo(() => data?.recentFiles ?? [], [data]);

  return (
    <ImageBackground
      source={require("@/assets/images/dash.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <HamburgerMenu currentScreen="home" />
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
        <View style={styles.row}>
  {data ? (
    <>
      <RadialProgressRing
        progress={67} // always full circle for totals
        value={(data?.totalVideos ?? 0).toString()}
        label="Total Videos"
        color="#3cd306" // 🟢 Green
        size={110}
      />
      <RadialProgressRing
        progress={29} // animate percentage
        value={`${data?.aiGeneratedPercent ?? 0}%`}
        label="AI Generated"
        color="#FF4D4F" // 🔴 Red
        size={110}
      />
    </>
  ) : (
    <>
      <SkeletonCard />
      <SkeletonCard />
    </>
  )}
</View>

{/* Package Banner */}
<View style={styles.packageBanner}>
  <LinearGradient
    colors={["#0473e9", "#0473e9"]} // matches your app’s accent 🔴
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.packageGradient}
  >
    <Ionicons name="star" size={18} color="#fff" style={{ marginRight: scale(8) }} />
    <Text style={styles.packageText}>
      {'Your Plan: xxxxx} : "No active package'}
    </Text>
  </LinearGradient>
</View>


        {/* Recent Files (Glass) */}
        <Animated.View entering={FadeInDown.delay(160).duration(550)} style={styles.recentPanelWrap}>
          <BlurView intensity={30} tint="light" style={styles.recentPanel}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recent Files</Text>
              <View style={styles.recentHeaderRight}>
                <Ionicons name="time-outline" size={16} color="#0A0F1C" />
                <Text style={styles.recentHint}>latest first</Text>
              </View>
            </View>

            {data ? (
              <ScrollView style={styles.recentScroll} showsVerticalScrollIndicator={false}>
                {recentFiles.length === 0 ? (
                  <EmptyState />
                ) : (
                  recentFiles.map((fileName, index) => (
                    <Pressable
                      style={({ pressed }) => [
                        styles.recentItemWrap,
                        pressed && { opacity: 0.7 },
                      ]}
                      key={`${fileName}-${index}`}
                    >
                      <View style={styles.recentIcon}>
                        <Ionicons
                          name="document-text-outline"
                          size={16}
                          color="#0A0F1C"
                        />
                      </View>
                      <Text style={styles.recentItem} numberOfLines={1}>
                        {fileName}
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color="#0A0F1C" />
                    </Pressable>
                  ))
                )}
              </ScrollView>
            ) : (
              <View style={{ gap: scale(10) }}>
                <SkeletonLine />
                <SkeletonLine />
                <SkeletonLine />
                <SkeletonLine />
              </View>
            )}
          </BlurView>
        </Animated.View>
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
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  gradient: [string, string];
}) {
  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.statCard}
    >
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.glow} />
    </LinearGradient>
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

function SkeletonLine() {
  return <View style={styles.skeletonLine} />;
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="cloud-upload-outline" size={18} color="#0A0F1C" />
      </View>
      <Text style={styles.emptyTitle}>No recent files</Text>
      <Text style={styles.emptySub}>Upload or scan to see items here.</Text>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: scale(16),
  },
  statCard: {
    flex: 1,
    minHeight: scale(120),
    borderRadius: scale(18),
    paddingVertical: scale(18),
    paddingHorizontal: scale(14),
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    overflow: "hidden",
  },
  iconWrap: {
    marginBottom: scale(8),
    backgroundColor: "rgba(255,255,255,0.22)",
    padding: scale(8),
    borderRadius: scale(50),
  },
  statValue: {
    color: "#fff",
    fontSize: scale(24),
    fontFamily: "PoppinsBold",
    marginBottom: scale(4),
  },
  statLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: scale(12),
    fontFamily: "PoppinsMedium",
  },
  glow: {
    position: "absolute",
    width: scale(180),
    height: scale(180),
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    bottom: -scale(80),
    right: -scale(60),
  },

  /* Recent Files (Glass) */
  recentPanelWrap: {
    marginTop: scale(8),
  },
  recentPanel: {
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: scale(18),
    padding: scale(16),
    minHeight: Math.min(Math.round(SCREEN_HEIGHT * 0.28), scale(260)),
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
    overflow: "hidden",
  },
  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: scale(10),
  },
  recentHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  recentHint: {
    fontSize: scale(11),
    color: "#6B7280",
    fontFamily: "PoppinsMedium",
  },
  recentScroll: { maxHeight: Math.min(Math.round(SCREEN_HEIGHT * 0.28), scale(260)) },
  recentTitle: {
    fontSize: scale(16),
    fontFamily: "PoppinsBold",
    color: "#0A0F1C",
  },
  recentItemWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(15,23,42,0.06)",
    gap: scale(10),
  },
  recentIcon: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
  },
  recentItem: {
    flex: 1,
    fontSize: scale(13),
    fontFamily: "PoppinsMedium",
    color: "#0A0F1C",
  },

  /* Skeletons */
  skeletonCard: {
    flex: 1,
    minHeight: scale(120),
    borderRadius: scale(18),
    backgroundColor: "rgba(255,255,255,0.65)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
    paddingVertical: scale(18),
    paddingHorizontal: scale(14),
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
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
  skeletonLine: {
    width: "100%",
    height: scale(14),
    borderRadius: scale(8),
    backgroundColor: "rgba(15,23,42,0.08)",
  },

  /* Empty state */
  emptyState: {
    alignItems: "center",
    paddingVertical: scale(18),
    gap: scale(6),
  },
  emptyIcon: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(50),
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontFamily: "PoppinsBold",
    color: "#0A0F1C",
    fontSize: scale(13),
  },
  emptySub: {
    fontFamily: "PoppinsMedium",
    color: "#6B7280",
    fontSize: scale(11),
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
});
