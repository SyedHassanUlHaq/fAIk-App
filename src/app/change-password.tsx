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
  View,
} from "react-native";

const { height } = Dimensions.get("window");

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        </View>
      </View>

      <BottomCard title="Change Password" showBack={false} height={height * 0.55}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Old Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter old password"
            placeholderTextColor="#999"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor="#999"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Re-enter New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter new password"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
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
  saveBtn: {
    marginTop: scale(18),
    backgroundColor: "#FF2628",
    height: scale(48),
    borderRadius: scale(24),
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: scale(16),
  },
});


