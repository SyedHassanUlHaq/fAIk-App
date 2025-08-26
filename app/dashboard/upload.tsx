import {
  ImageBackground,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { scale } from "@/responsive";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as WebBrowser from 'expo-web-browser';
import { mockUploadFile, mockStartProcessing, mockFetchReport } from '@/utils/api';

export default function UploadScreen() {
  const [fileName, setFileName] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [uploadId, setUploadId] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const handleFakeUpload = async () => {
    // Dummy picker: generate a placeholder file reference
    const pickedName = `video_${Date.now()}.mp4`;
    const pickedUri = `file:///dummy/${pickedName}`;
    setFileName(pickedName);
    const upload = await mockUploadFile(pickedUri, pickedName);
    setUploadId(upload.uploadId);
  };

  const handleProcess = async () => {
    if (processing) return;
    if (!uploadId) {
      // Require a file to be uploaded first
      await handleFakeUpload();
    }
    setProcessing(true);
    setProgress(0);
    // Restart animation from 0
    progressAnim.stopAnimation();
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 5000,
      useNativeDriver: false,
    }).start(async () => {
      setProcessing(false);
      const started = await mockStartProcessing(uploadId ?? 'upl_temp');
      setJobId(started.jobId);
    });
  };

  // Keep numeric label in sync with the animated value
  useEffect(() => {
    const id = progressAnim.addListener(({ value }) => {
      setProgress(Math.min(100, Math.max(0, Math.round(value))));
    });
    return () => {
      progressAnim.removeListener(id);
    };
  }, [progressAnim]);

  return (
    <ImageBackground
      source={require("@/assets/images/dash.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.avatarCircle}>
            <MaterialIcons name="person" size={scale(26)} color="#fff" />
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.userName}>Emma Phillips</Text>
            <Text style={styles.subtitle}>AI Model</Text>
          </View>
        </View>

        <View style={styles.previewWrap}>
          <Image
            source={require("@/assets/images/upload.jpg")}
            style={styles.preview}
            resizeMode="cover"
          />
        </View>

        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={handleFakeUpload}>
          <View style={styles.btnContentRow}>
            <FontAwesome name="video-camera" size={scale(24)} color="#fff" style={{ marginRight: scale(8) }} />
            <Text style={styles.primaryBtnText}>Upload Video File</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.filenameBox}>
          <Text style={[styles.filenameText, !fileName && { color: "#b5b5b5" }]}>
            {fileName || "Your File Name"}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, { marginTop: scale(16) }]}
          activeOpacity={0.9}
          onPress={handleProcess}
        >
          <View style={styles.btnContentRow}>
            <MaterialIcons name="play-circle-fill" size={scale(24)} color="#fff" style={{ marginRight: scale(8) }} />
            <Text style={styles.primaryBtnText}>Let's Process It</Text>
          </View>
        </TouchableOpacity>

        {(processing || progress > 0) && (
          <View style={styles.progressWrap}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            >
              <Text style={styles.progressText}>{`${Math.floor(progress)} %`}</Text>
            </Animated.View>
          </View>
        )}

        <TouchableOpacity style={[styles.secondaryBtn]} activeOpacity={0.9} onPress={async () => {
          if (!jobId) return;
          const report = await mockFetchReport(jobId);
          await WebBrowser.openBrowserAsync(report.url);
        }}>
          <View style={styles.btnContentRow}>
            <AntDesign name="filetext1" size={scale(24)} color="#fff" style={{ marginRight: scale(8) }} />
            <Text style={styles.secondaryBtnText}>View Report</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
    paddingTop: scale(60),
    justifyContent: "flex-start",
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: scale(12) },
  avatarCircle: { width: scale(40), height: scale(40), borderRadius: scale(20), backgroundColor: '#FF2628', alignItems: 'center', justifyContent: 'center', marginRight: scale(10) },
  headerTextWrap: {},
  userName: {
    fontFamily: "PoppinsExtraBold",
    fontSize: scale(20),
    color: "#000",
  },
  subtitle: { fontFamily: "PoppinsMedium", fontSize: scale(15), color: "#666" },

  previewWrap: {
    marginTop: scale(8),
    marginBottom: scale(16),
    borderRadius: scale(12),
    borderWidth: 3,
    borderColor: "#111",
    overflow: "hidden",
    alignSelf: "center",
  },
  preview: { width: scale(300), height: scale(300) },

  primaryBtn: {
    backgroundColor: "#FF2628",
    height: scale(48),
    borderRadius: scale(24),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: scale(8),
    marginTop: scale(6),
  },
  primaryBtnText: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: scale(16),
  },

  filenameBox: { height: scale(46), borderRadius: scale(12), borderWidth: 1, borderColor: '#e5e5e5', paddingHorizontal: scale(14), backgroundColor: '#ffffff', marginTop: scale(12), justifyContent: 'center', marginHorizontal: scale(8), alignSelf: 'stretch' },
  filenameText: { color: '#111', fontFamily: 'PoppinsMedium' },

  progressWrap: {
    height: scale(28),
    borderRadius: scale(18),
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#111",
    overflow: "hidden",
    marginTop: scale(16),
  },
  progressFill: {
    width: "0%",
    height: "100%",
    backgroundColor: "#FF2628",
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: { color: "#fff", fontFamily: "PoppinsMedium" },
  btnContentRow: { flexDirection: 'row', alignItems: 'center' },

  secondaryBtn: {
    backgroundColor: "#FF2628",
    height: scale(48),
    borderRadius: scale(24),
    alignItems: "center",
    justifyContent: "center",
    marginTop: scale(20),
    marginHorizontal: scale(8),
    width: scale(200),
    alignSelf: 'center',
  },
  secondaryBtnText: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: scale(16),
  },
});
