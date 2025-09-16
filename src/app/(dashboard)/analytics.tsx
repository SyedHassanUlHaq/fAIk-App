import HamburgerMenu from '@/components/layout/HamburgerMenu';
import { scale } from '@/responsive';
import { getToken } from '@/utils/api';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AnalyticScreen() {
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
  
  const [fileName, setFileName] = useState<string | null>(null);
  const [realDuration, setRealDuration] = useState<number>(0.41);
  const [fakeDuration, setFakeDuration] = useState<number>(0.19);
  const [statuses, setStatuses] = useState<Array<{ id: number; chunk: number; fake: boolean; start: number; end: number }>>([
    { id: 875694, chunk: 1, fake: true, start: 0.0, end: 0.03 },
    { id: 154856, chunk: 2, fake: false, start: 0.03, end: 0.10 },
    { id: 759856, chunk: 3, fake: true, start: 0.10, end: 0.16 },
    { id: 525243, chunk: 4, fake: true, start: 0.16, end: 0.21 },
  ]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const fileOptions = useMemo(() => ([
    {
      name: 'sample_video_A.mp4',
      real: 0.41,
      fake: 0.19,
      list: [
        { id: 875694, chunk: 1, fake: true, start: 0.0, end: 0.03 },
        { id: 154856, chunk: 2, fake: false, start: 0.03, end: 0.10 },
        { id: 759856, chunk: 3, fake: true, start: 0.10, end: 0.16 },
        { id: 525243, chunk: 4, fake: true, start: 0.16, end: 0.21 },
      ],
    },
    {
      name: 'meeting_clip_B.mov',
      real: 0.58,
      fake: 0.07,
      list: [
        { id: 845231, chunk: 1, fake: false, start: 0.0, end: 0.12 },
        { id: 991123, chunk: 2, fake: true, start: 0.12, end: 0.19 },
        { id: 223311, chunk: 3, fake: false, start: 0.19, end: 0.32 },
        { id: 552219, chunk: 4, fake: false, start: 0.32, end: 0.58 },
      ],
    },
  ]), []);

  const handlePickFile = () => setShowDropdown((s) => !s);
  const handleSelect = (name: string) => {
    const opt = fileOptions.find((o) => o.name === name);
    if (!opt) return;
    setFileName(opt.name);
    setRealDuration(opt.real);
    setFakeDuration(opt.fake);
    setStatuses(opt.list);
    setShowDropdown(false);
  };

  return (
    <ImageBackground source={require('@/assets/images/dash.png')} resizeMode="cover" style={{ flex: 1 }}>
  {/* Hamburger always on top-right */}
  <HamburgerMenu currentScreen="analytics" />

  {/* Lock Overlay when not authenticated */}
  {!isCheckingAuth && !isAuthenticated && (
    <View style={styles.lockOverlay}>
      <View style={styles.lockContent}>
        <MaterialIcons name="lock" size={scale(48)} color="#FF2628" />
        <Text style={styles.lockTitle}>Login Required</Text>
        <Text style={styles.lockDescription}>
          Please log in to access detailed analytics and reports
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

  <View style={styles.containerRoot}>
    {/* File Selector */}
    <View style={{ marginBottom: scale(16) }}>
      <TouchableOpacity style={styles.selector} activeOpacity={0.9} onPress={handlePickFile}>
        <Text style={styles.selectorText}>{fileName ? fileName : 'Select Your File'}</Text>
        <MaterialIcons name="keyboard-arrow-down" size={scale(22)} color="#fff" />
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdown}>
          <ScrollView showsVerticalScrollIndicator style={{ maxHeight: scale(180) }}>
            {fileOptions.map((opt) => (
              <TouchableOpacity key={opt.name} style={styles.dropdownItem} onPress={() => handleSelect(opt.name)}>
                <Text style={styles.dropdownText}>{opt.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>

    {/* Metric Cards */}
    <View style={styles.rowCards}>
      <View style={styles.metricCard}>
        <Text style={styles.metricValue}>
          {realDuration.toFixed(2)} <Text style={styles.metricLabel}>sec</Text>
        </Text>
        <Text style={styles.metricLabel}>Real Duration</Text>
      </View>
      <View style={styles.metricCard}>
        <Text style={styles.metricValue}>
          {fakeDuration.toFixed(2)} <Text style={styles.metricLabel}>sec</Text>
        </Text>
        <Text style={styles.metricLabel}>Fake Duration</Text>
      </View>
    </View>

    {/* Status List */}
    <ScrollView style={styles.statusScroll} contentContainerStyle={styles.statusScrollContent} showsVerticalScrollIndicator={false}>
      {statuses.map((s, idx) => (
        <View
          key={`${s.id}-${idx}`}
          style={[
            styles.statusCard,
            { backgroundColor: s.fake ? '#FFE5E6' : '#E6F4EA', borderLeftColor: s.fake ? '#FF2628' : '#28A745' },
          ]}
        >
          <Text style={[styles.statusTitle, { color: s.fake ? '#FF2628' : '#28A745' }]}>{`Chunk ${idx + 1}`}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLine}>ID: {s.id}</Text>
            <Text style={styles.statusLine}>#{String(s.chunk).padStart(2, '0')}</Text>
          </View>
          <Text style={styles.statusLine}>
            {s.start.toFixed(2)}s - {s.end.toFixed(2)}s ({s.fake ? 'Fake' : 'Real'})
          </Text>
        </View>
      ))}
    </ScrollView>
  </View>
</ImageBackground>
  );
}

const styles = StyleSheet.create({
  containerRoot: { flex: 1, paddingHorizontal: scale(20), paddingTop: scale(100), paddingBottom: scale(16) },

  // Hamburger fixed at top-right
  hamburgerWrapper: {
    position: 'absolute',
    top: scale(40),
    right: scale(20),
    zIndex: 20,
  },

  // Selector
  selector: {
    height: scale(50),
    borderRadius: scale(25),
    backgroundColor: '#FF2628',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(18),
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  selectorText: { color: '#fff', fontFamily: 'PoppinsBold', fontSize: scale(16) },

  dropdown: {
    backgroundColor: '#ffffff',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#eeeeee',
    overflow: 'hidden',
    marginTop: scale(8), // sits naturally under selector
    zIndex: 10,
    elevation: 10,
  },
  dropdownItem: { paddingVertical: scale(12), paddingHorizontal: scale(16), borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownText: { color: '#111', fontSize: scale(14) },

  // Metric Cards
  rowCards: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: scale(16) },
  metricCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(16),
    borderWidth: 2,
    borderColor: '#FF2628',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  metricValue: { color: '#FF2628', fontSize: scale(28), fontFamily: 'PoppinsSemiBold' },
  metricLabel: { color: '#333', textAlign: 'center', marginTop: scale(6) },

  // Status cards
  statusCard: {
    borderLeftWidth: 6,
    borderRadius: scale(8),
    padding: scale(14),
    marginBottom: scale(12),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statusTitle: { fontFamily: 'PoppinsSemiBold', marginBottom: scale(6), fontSize: scale(15) },
  statusLine: { color: '#333', fontSize: scale(13) },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusScroll: { flex: 1 },
  statusScrollContent: { paddingBottom: scale(36) },
  
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
