import { ImageBackground, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { scale } from '@/responsive';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMemo, useState } from 'react';

export default function AnalyticScreen() {
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
      <View style={styles.containerRoot}>
        <View style={styles.containerHeader}> 
          <TouchableOpacity style={styles.selector} activeOpacity={0.9} onPress={handlePickFile}>
            <Text style={styles.selectorText}>{fileName ? fileName : 'Select Your File'}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={scale(22)} color="#fff" />
          </TouchableOpacity>
          {showDropdown && (
            <View style={styles.dropdown}>
              <ScrollView showsVerticalScrollIndicator style={{ maxHeight: scale(160) }}>
                {fileOptions.map((opt) => (
                  <TouchableOpacity key={opt.name} style={styles.dropdownItem} onPress={() => handleSelect(opt.name)}>
                    <Text style={styles.dropdownText}>{opt.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.rowCards}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{realDuration.toFixed(2)} <Text style={styles.metricUnit}>sec</Text></Text>
              <Text style={styles.metricLabel}>Real Video{"\n"}Time Duration</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{fakeDuration.toFixed(2)} <Text style={styles.metricUnit}>sec</Text></Text>
              <Text style={styles.metricLabel}>Fake Video{"\n"}Time Duration</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.statusScroll} contentContainerStyle={styles.statusScrollContent} showsVerticalScrollIndicator>
          {statuses.map((s, idx) => (
            <View key={`${s.id}-${idx}`} style={styles.statusCard}>
              <Text style={styles.statusTitle}>{`Status : ${String(idx + 1).padStart(2,'0')}`}</Text>
              <View style={styles.statusRow}>
                <Text style={[styles.statusLine, { textAlign: 'left' }]}>ID Number : {s.id}</Text>
                <Text style={[styles.statusLine, { textAlign: 'right' }]}>Chuck No  : {String(s.chunk).padStart(6,'0')}</Text>
              </View>
              <Text style={styles.statusLine}>Time : {s.start.toFixed(2)} sec - {s.end.toFixed(2)} sec  ({s.fake ? 'Fake' : 'Real'})</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  containerRoot: { flex: 1, paddingHorizontal: scale(20), paddingTop: scale(80), paddingBottom: scale(16) },
  containerHeader: { paddingBottom: scale(12), position: 'relative' },
  container: { paddingHorizontal: scale(20), paddingTop: scale(80), paddingBottom: scale(36) },
  selector: { height: scale(48), borderRadius: scale(24), backgroundColor: '#FF2628', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scale(18), marginBottom: scale(16) },
  selectorText: { color: '#fff', fontFamily: 'PoppinsBold', fontSize: scale(16) },
  dropdown: { backgroundColor: '#ffffff', borderRadius: scale(12), borderWidth: 1, borderColor: '#eeeeee', overflow: 'hidden', position: 'absolute', left: 0, right: 0, top: scale(56), zIndex: 10, elevation: 10 },
  dropdownItem: { paddingVertical: scale(10), paddingHorizontal: scale(14), borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownText: { color: '#111' },
  rowCards: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: scale(16) },
  metricCard: { width: '47%', backgroundColor: '#FF2628', borderRadius: scale(16), alignItems: 'center', justifyContent: 'center', paddingVertical: scale(16) },
  metricValue: { color: '#fff', fontSize: scale(28), fontFamily: 'PoppinsExtraBold' },
  metricUnit: { fontSize: scale(14), fontFamily: 'PoppinsMedium' },
  metricLabel: { color: '#fff', textAlign: 'center', marginTop: scale(6) },
  statusCard: { backgroundColor: '#FF2628', borderRadius: scale(8), padding: scale(14), marginBottom: scale(12) },
  statusTitle: { color: '#fff', fontFamily: 'PoppinsBold', marginBottom: scale(6) },
  statusLine: { color: '#fff', flex: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusScroll: { flex: 1 },
  statusScrollContent: { paddingBottom: scale(36) },
});

