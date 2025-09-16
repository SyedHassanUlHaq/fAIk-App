import { scale } from "@/responsive";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated, { FadeInDown } from "react-native-reanimated";



type IconLibrary = "Ionicons" | "MaterialIcons";

function InfographicSection({
  letter,
  bgColor,
  title,
  description,
  iconLibrary,
  iconName,
  index,
}: {
  letter: string;
  bgColor: string;
  title: string;
  description: string;
  iconLibrary: IconLibrary;
  iconName: string;
  index: number; // used for staggered animation delay
}) {
  const LETTER_SIZE = scale(44);
  const TRIANGLE_SIZE = scale(12);
  const ICON_CIRCLE = scale(46);

  const renderIcon = () => {
    if (iconLibrary === "Ionicons") {
      return <Ionicons name={iconName as any} size={scale(20)} color={bgColor} />;
    }
    return <MaterialIcons name={iconName as any} size={scale(20)} color={bgColor} />;
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(80 * index).duration(420)}
      style={[styles.infoCardWrap]}
    >
      <Pressable style={({ pressed }) => [styles.infoCard, pressed && { opacity: 0.95 }]}>
        {/* Left badge with letter + triangle */}
        <View style={[styles.leftBadge, { backgroundColor: bgColor }]}>
          <View style={styles.leftBadgeInner}>
            <Text style={[styles.letterText, { color: "#fff", fontSize: LETTER_SIZE }]}>{letter}</Text>
            {/* small triangle arrow to the left of the letter */}
            <View style={[styles.leftTriangle, {
              borderLeftColor: bgColor,
              borderLeftWidth: TRIANGLE_SIZE,
              borderTopWidth: TRIANGLE_SIZE,
              borderBottomWidth: TRIANGLE_SIZE,
              marginLeft: scale(-8),
            }]} />
          </View>
        </View>

        {/* Content */}
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>{title}</Text>
          <Text style={styles.infoDesc}>{description}</Text>
        </View>

        {/* Right icon circle */}
        <View style={[styles.rightIconWrap, { width: ICON_CIRCLE, height: ICON_CIRCLE, borderRadius: ICON_CIRCLE / 2 }]}>
          <View style={styles.rightIconInner}>{renderIcon()}</View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

/* ---------- Other components (unchanged) ---------- */

function Chip({ text, active, onPress }: { text: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && { opacity: 0.8 }]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{text}</Text>
    </Pressable>
  );
}

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
      colors={["#FF4D4F", "#FF2628"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.statCard}
    >
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>

      {/* glow ring */}
      <View style={styles.glow} />
    </LinearGradient>
  );
}

function QuickAction({
  label,
  icon,
  prominent,
}: {
  label: string;
  icon: React.ReactNode;
  prominent?: boolean;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.quickBtnOuter, pressed && { transform: [{ scale: 0.98 }] }]}>
      <LinearGradient
        colors={prominent ? ["#93C5FD", "#A5B4FC"] : ["#E5E7EB", "#F3F4F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.quickBtn}
      >
        <View style={styles.quickIconWrap}>{icon}</View>
        <Text style={styles.quickText}>{label}</Text>
      </LinearGradient>
    </Pressable>
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

  /* Chips */
  chipsRow: {
    flexDirection: "row",
    gap: scale(8),
    justifyContent: "center",
    marginBottom: scale(2),
  },
  chip: {
    paddingVertical: scale(6),
    paddingHorizontal: scale(14),
    borderRadius: scale(20),
    backgroundColor: "rgba(255,255,255,0.65)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
  },
  chipActive: {
    backgroundColor: "rgba(59,130,246,0.18)",
    borderColor: "rgba(59,130,246,0.35)",
  },
  chipText: {
    fontFamily: "PoppinsMedium",
    fontSize: scale(12),
    color: "#0A0F1C",
  },
  chipTextActive: {
    color: "#1E3A8A",
  },

  /* ---------- Infographic Styles ---------- */
  infographicContainer: {
    gap: scale(12),
    marginTop: scale(6),
  },
  infoCardWrap: {
    // wrapper for animation spacing
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: scale(14),
    // Rounded right end effect: bigger radius on right side
    borderTopRightRadius: scale(30),
    borderBottomRightRadius: scale(30),
    overflow: "hidden",
    backgroundColor: "transparent",
    // card background is composed: left badge + content + right icon on neutral surface
    // We use shadow and white card look
    padding: scale(0),
    minHeight: scale(86),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  leftBadge: {
    width: scale(86),
    justifyContent: "center",
    alignItems: "center",
    // left side is colored large badge
    // To create smooth rounded left top/bottom we keep standard radius
    borderTopLeftRadius: scale(14),
    borderBottomLeftRadius: scale(14),
    height: "100%",
  },
  leftBadgeInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    paddingLeft: scale(8),
    paddingRight: scale(6),
  },
  leftTriangle: {
    width: 0,
    height: 0,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    backgroundColor: "transparent",
  },
  letterText: {
    fontFamily: "PoppinsBold",
    // color set dynamically
    marginRight: scale(4),
    includeFontPadding: false,
  },
  infoContent: {
    flex: 1,
    paddingHorizontal: scale(12),
    paddingVertical: scale(12),
  },
  infoTitle: {
    fontFamily: "PoppinsBold",
    fontSize: scale(13),
    textTransform: "uppercase",
    marginBottom: scale(6),
    color: "#0A0F1C",
  },
  infoDesc: {
    fontFamily: "PoppinsMedium",
    fontSize: scale(12),
    color: "#4B5563",
    lineHeight: scale(18),
  },
  rightIconWrap: {
    backgroundColor: "#fff",
    marginHorizontal: scale(12),
    alignItems: "center",
    justifyContent: "center",
    // right end should be rounded strongly
    borderTopRightRadius: scale(30),
    borderBottomRightRadius: scale(30),
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  rightIconInner: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },

  /* Stats (kept for possible future use) */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(14),
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

  /* Quick Actions */
  quickRow: {
    flexDirection: "row",
    gap: scale(12),
    marginTop: scale(2),
  },
  quickBtnOuter: {
    flex: 1,
  },
  quickBtn: {
    flex: 1,
    height: scale(56),
    borderRadius: scale(16),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: scale(8),
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  quickIconWrap: {
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: scale(6),
    borderRadius: scale(10),
  },
  quickText: {
    fontFamily: "PoppinsMedium",
    color: "#0A0F1C",
    fontSize: scale(13),
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
});