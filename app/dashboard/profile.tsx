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
import BottomCard from "@/components/universal_card";
const { height } = Dimensions.get("window");

export default function DashboardProfileScreen() {
  const router = useRouter();
  return (
    <ImageBackground
      source={require("@/assets/images/dash.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <View style={styles.headerBlock}>
        <TouchableOpacity style={styles.topBackBtn} onPress={() => router.replace('/dashboard/home')}>
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
        <TouchableOpacity style={styles.cardRow}>
          <MaterialIcons
            name="manage-accounts"
            size={scale(22)}
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
          <MaterialIcons name="receipt-long" size={scale(22)} color="#FF2628" />
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
            size={scale(20)}
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
  cardText: { color: "#111", fontFamily: "PoppinsMedium" },
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
});
