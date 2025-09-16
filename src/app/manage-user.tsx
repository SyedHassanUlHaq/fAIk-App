import BottomCard from "@/components/common/universal_card";
import { scale } from "@/responsive";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { height } = Dimensions.get("window");

export default function ManageUserScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <ImageBackground
      source={require("@/assets/images/dash.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <View style={styles.headerBlock}>
        <TouchableOpacity style={styles.topBackBtn} onPress={() => router.back()}>
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

      <BottomCard title="Manage User" showBack={false} height={height * 0.6}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter first name"
            placeholderTextColor="#999"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter last name"
            placeholderTextColor="#999"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        {/* <Image
          source={require("@/assets/images/profile-image.jpg")}
          style={styles.illustration}
          resizeMode="contain"
        /> */}

        <TouchableOpacity style={styles.signOutBtn} onPress={() => router.push('/change-password')}>
          <MaterialIcons
            name="lock-outline"
            size={scale(22)}
            color="#fff"
          />
          <Text style={styles.signOutText}>Change Password</Text>
        </TouchableOpacity>
      </BottomCard>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
  inputGroup: { marginBottom: scale(12) },
  label: { fontFamily: "PoppinsMedium", fontSize: scale(14), color: "#111", marginBottom: scale(6) },
  input: {
    height: scale(46),
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: scale(10),
    paddingHorizontal: scale(12),
    fontFamily: "Poppins",
    fontSize: scale(14),
    color: "#111",
    backgroundColor: "#fafafa",
  },
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


