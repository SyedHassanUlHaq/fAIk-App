import { Image, ImageBackground, View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { fetchDashboardMock, type DashboardData } from "@/utils/api";
import { scale } from "@/responsive";

export default function DashboardHomeScreen() {
  const [data, setData] = useState<DashboardData | null>(null);

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
      <View style={styles.container}>
        <View style={styles.logoWrap}>
          <Image
            source={require("@/assets/images/logo-1.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.welcomeWrap}>
          <Text style={styles.welcomeTitle}>Welcome,</Text>
          <Text style={styles.welcomeName}>{data?.name ?? '...'} !</Text>
        </View>

        <View style={styles.row}>
          <StatCard value={(data?.totalVideos ?? 0).toString()} label="Total Videos" />
          <StatCard value={`${data?.aiGeneratedPercent ?? 0} %`} label="AI Generated" />
        </View>
        <View style={[styles.row, { marginBottom: scale(40) }]}>
          <StatCard value={`${data?.accuracyPercent ?? 0} %`} label="Accuracy" />
          <StatCard value={(data?.deletedVideos ?? 0).toString()} label="Deleted Videos" />
        </View>

        <View style={styles.recentPanel}>
          <Text style={styles.recentTitle}>Recent Files :</Text>
          <ScrollView style={styles.recentScroll} showsVerticalScrollIndicator>
            {(data?.recentFiles ?? []).map((fileName, index) => (
              <Text style={styles.recentItem} key={`${fileName}-${index}`}>{`${index + 1}. ${fileName}`}</Text>
            ))}
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: scale(20), paddingTop: scale(32) },
  logoWrap: { alignItems: "center", marginBottom: scale(12) },
  logo: { width: scale(125), height: scale(125), marginBottom: scale(-10) },
  welcomeWrap: { marginBottom: scale(12) },
  welcomeTitle: {
    color: "#000",
    fontFamily: "PoppinsExtraBold",
    fontSize: scale(36),
    marginBottom: scale(0),
  },
  welcomeName: { fontSize: scale(18), color: "#000", fontFamily: "PoppinsMedium" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: scale(12),
  },
  statCard: {
    width: "48%",
    minHeight: scale(110),
    backgroundColor: "#FF2628",
    borderRadius: scale(16),
    paddingVertical: scale(20),
    paddingHorizontal: scale(16),
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    color: "#ffffff",
    fontSize: scale(28),
    fontWeight: "bold",
    marginBottom: scale(6),
  },
  statLabel: { color: "#ffffff", fontSize: scale(14) },
  recentPanel: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#FF2628",
    borderRadius: scale(8),
    padding: scale(16),
    height: Math.min(Math.round(SCREEN_HEIGHT * 0.28), scale(260)),
  },
  recentScroll: { flex: 1 },
  recentTitle: {
    fontSize: scale(18),
    fontWeight: "bold",
    color: "#111",
    marginBottom: scale(8),
  },
  recentItem: { fontSize: scale(14), color: "#111", lineHeight: scale(20) },
});
