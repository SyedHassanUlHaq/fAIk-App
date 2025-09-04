import {
  ImageBackground,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { scale } from "@/responsive";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as WebBrowser from "expo-web-browser";
import {
  mockUploadFile,
  mockStartProcessing,
  mockFetchReport,
} from "@/utils/api";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function UploadScreen() {
  const [fileName, setFileName] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);
  const [uploadType, setUploadType] = useState<"gallery" | "link">("gallery");
  const [linkInput, setLinkInput] = useState<string>("");
  const [isLinkValid, setIsLinkValid] = useState<boolean>(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const [uploadId, setUploadId] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  // Validate URL
  const validateUrl = (url: string) =>
    /^(https?:\/\/)[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(url);

  const handleLinkChange = (text: string) => {
    setLinkInput(text);
    setIsLinkValid(validateUrl(text));
  };

  const handleGalleryUpload = async () => {
    Alert.alert(
      "Gallery Upload",
      "Gallery upload will be available later. Simulating file selection...",
      [
        {
          text: "OK",
          onPress: () => {
            const fileName = `gallery_${Date.now()}.mp4`;
            setFileName(fileName);
            mockUploadFile(`file:///simulated/${fileName}`, fileName).then(
              (upload) => {
                setUploadId(upload.uploadId);
                setUploadType("gallery");
              }
            );
          },
        },
      ]
    );
  };

  const handleLinkUpload = async () => {
    if (!isLinkValid) {
      Alert.alert("Invalid URL", "Please enter a valid URL");
      return;
    }
    const fileName = `link_${Date.now()}.mp4`;
    setFileName(fileName);
    const upload = await mockUploadFile(linkInput, fileName);
    setUploadId(upload.uploadId);
    setUploadType("link");
  };

  const handleProcess = async () => {
    if (processing || !uploadId) return;
    setProcessing(true);
    setProgress(0);
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 4000,
      useNativeDriver: false,
    }).start(async () => {
      setProcessing(false);
      const started = await mockStartProcessing(uploadId);
      setJobId(started.jobId);
    });
  };

  useEffect(() => {
    const id = progressAnim.addListener(({ value }) =>
      setProgress(Math.round(value))
    );
    return () => progressAnim.removeListener(id);
  }, [progressAnim]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ImageBackground
      source={require("@/assets/images/dash.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <HamburgerMenu currentScreen="upload" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.container,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Header */}
          {/* <View style={styles.headerRow}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={scale(24)} color="#fff" />
            </View>
            <View>
              <Text style={styles.userName}>Emma Phillips</Text>
              <Text style={styles.subtitle}>AI Model Specialist</Text>
            </View>
          </View> */}

          {/* Illustration */}
          <View style={styles.illustrationWrap}>
            <Image
              source={require("@/assets/images/upload.jpg")}
              style={styles.illustration}
              resizeMode="contain"
            />
            <Text style={styles.title}>Upload Your Media</Text>
            <Text style={styles.subtitleCenter}>
              Pick from gallery or paste a link
            </Text>
          </View>

          {/* Upload Method */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Upload Method</Text>
            <View style={styles.toggleRow}>
              {["gallery", "link"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.toggleBtn,
                    uploadType === type && styles.toggleBtnActive,
                  ]}
                  onPress={() => setUploadType(type as any)}
                >
                  <Ionicons
                    name={type === "gallery" ? "images-outline" : "link-outline"}
                    size={scale(18)}
                    color={uploadType === type ? "#fff" : "#666"}
                  />
                  <Text
                    style={[
                      styles.toggleText,
                      uploadType === type && styles.toggleTextActive,
                    ]}
                  >
                    {type === "gallery" ? "Gallery" : "Link"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Upload Action */}
          <View style={styles.card}>
            {uploadType === "gallery" ? (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleGalleryUpload}
              >
                <FontAwesome name="video-camera" size={18} color="#666" />
                <Text style={styles.actionText}>Choose from Gallery</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </TouchableOpacity>
            ) : (
              <View>
                <View style={styles.inputRow}>
                  <Ionicons name="link" size={16} color="#666" />
                  <TextInput
                    style={styles.input}
                    placeholder="Paste media URL..."
                    placeholderTextColor="#aaa"
                    value={linkInput}
                    onChangeText={handleLinkChange}
                    keyboardType="url"
                  />
                  {isLinkValid && (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#4CAF50"
                    />
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    styles.uploadBtn,
                    !isLinkValid && styles.uploadBtnDisabled,
                  ]}
                  onPress={handleLinkUpload}
                  disabled={!isLinkValid}
                >
                  <Ionicons
                    name="cloud-upload"
                    size={16}
                    color={isLinkValid ? "#fff" : "#999"}
                  />
                  <Text
                    style={[
                      styles.uploadBtnText,
                      !isLinkValid && styles.uploadBtnTextDisabled,
                    ]}
                  >
                    Upload
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* File Info */}
          <View style={styles.card}>
            <View style={styles.inputRow}>
              <Ionicons name="document-text" size={16} color="#666" />
              <Text
                style={[
                  styles.filename,
                  !fileName && { color: "#bbb" },
                ]}
              >
                {fileName || "No file selected"}
              </Text>
              {fileName && (
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              )}
            </View>
          </View>

          {/* Process Button */}
          <TouchableOpacity
            style={[styles.processBtn, !uploadId && styles.btnDisabled]}
            onPress={handleProcess}
            disabled={!uploadId}
          >
            <MaterialIcons name="play-arrow" size={22} color="#fff" />
            <Text style={styles.processText}>Start AI Processing</Text>
          </TouchableOpacity>

          {/* Progress */}
          {(processing || progress > 0) && (
            <View style={styles.card}>
              <View style={styles.progressHeader}>
                <Text style={styles.cardTitle}>Processing</Text>
                <Text style={styles.progressText}>{progress}%</Text>
              </View>
              <View style={styles.progressBar}>
                <Animated.View
                  style={{
                    height: "100%",
                    backgroundColor: "#FF2628",
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  }}
                />
              </View>
              <Text style={styles.smallText}>
                AI is analyzing your media...
              </Text>
            </View>
          )}

          {/* Report */}
          {jobId && (
            <TouchableOpacity
              style={styles.reportBtn}
              onPress={async () => {
                const report = await mockFetchReport(jobId);
                await WebBrowser.openBrowserAsync(report.url);
              }}
            >
              <AntDesign name="filetext1" size={18} color="#fff" />
              <Text style={styles.reportText}>View Report</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: scale(40) },
  container: { flex: 1, padding: scale(20), paddingTop: scale(30) },

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FF2628",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    elevation: 4,
  },
  userName: { fontSize: 18, fontWeight: "bold", color: "#000" },
  subtitle: { fontSize: 13, color: "#666" },

  illustrationWrap: { 
    alignItems: "center", 
    marginBottom: 28,   // a bit more breathing space
  },
  
  illustration: { 
    width: "80%",        // responsive: 80% of container width
    height: undefined,   // let aspect ratio handle it
    aspectRatio: 1.2,    // adjust based on your vector’s ratio
    maxWidth: 320,       // don’t blow up too much on tablets
    opacity: 0.95,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#000", marginTop: 12 },
  subtitleCenter: { fontSize: 14, color: "#666", textAlign: "center" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    elevation: 3,
  },
  cardTitle: { fontSize: 15, fontWeight: "bold", color: "#000", marginBottom: 10 },

  toggleRow: { flexDirection: "row", borderRadius: 8, overflow: "hidden" },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#f1f1f1",
  },
  toggleBtnActive: { backgroundColor: "#FF2628" },
  toggleText: { marginLeft: 6, color: "#333" },
  toggleTextActive: { color: "#fff", fontWeight: "bold" },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  actionText: { flex: 1, marginLeft: 10, color: "#333" },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 1,
  },
  input: { flex: 1, marginLeft: 10, color: "#000" },

  uploadBtn: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FF2628",
  },
  uploadBtnDisabled: { backgroundColor: "#ddd" },
  uploadBtnText: { marginLeft: 6, color: "#fff", fontWeight: "bold" },
  uploadBtnTextDisabled: { color: "#999" },

  filename: { flex: 1, marginLeft: 10, color: "#111" },

  processBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF2628",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 5,
  },
  processText: { marginLeft: 8, color: "#fff", fontWeight: "bold" },
  btnDisabled: { backgroundColor: "#ccc" },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressText: { color: "#FF2628", fontWeight: "bold" },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#eee",
    overflow: "hidden",
    marginBottom: 6,
  },
  smallText: { fontSize: 12, color: "#666", textAlign: "center" },

  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 12,
    elevation: 5,
  },
  reportText: { marginLeft: 8, color: "#fff", fontWeight: "bold" },
});
