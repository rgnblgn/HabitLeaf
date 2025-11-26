import { StyleSheet, ScrollView, TouchableOpacity, View, Switch } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('tr');

  const languages = [
    { code: 'tr', label: 'Türkçe' },
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title">Ayarlar</ThemedText>
        </ThemedView>

        {/* Tema Ayarları */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Görünüm</ThemedText>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>🌙</ThemedText>
              <View>
                <ThemedText style={styles.settingLabel}>Karanlık Mod</ThemedText>
                <ThemedText style={styles.settingDescription}>Gece temasını aktif et</ThemedText>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#d0d0d0', true: '#3B82F6' }}
            />
          </View>
        </ThemedView>

        {/* Dil Ayarları */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Dil</ThemedText>

          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.settingRow}
              onPress={() => setSelectedLanguage(lang.code)}
            >
              <View style={styles.settingLeft}>
                <ThemedText style={styles.settingIcon}>🌍</ThemedText>
                <ThemedText style={styles.settingLabel}>{lang.label}</ThemedText>
              </View>
              {selectedLanguage === lang.code && (
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              )}
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Bildirim Ayarları */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Bildirimler</ThemedText>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>🔔</ThemedText>
              <View>
                <ThemedText style={styles.settingLabel}>Bildirimler</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Günlük hatırlatmalar al
                </ThemedText>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#d0d0d0', true: '#3B82F6' }}
            />
          </View>
        </ThemedView>

        {/* Hesap */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Hesap</ThemedText>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push('/premium' as any)}
          >
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>👑</ThemedText>
              <View>
                <ThemedText style={styles.settingLabel}>Premium'a Geç</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Tüm özelliklerin kilidini aç
                </ThemedText>
              </View>
            </View>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>📊</ThemedText>
              <ThemedText style={styles.settingLabel}>Verilerimi Dışa Aktar</ThemedText>
            </View>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Diğer */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Diğer</ThemedText>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>❓</ThemedText>
              <ThemedText style={styles.settingLabel}>Yardım & Destek</ThemedText>
            </View>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>⭐</ThemedText>
              <ThemedText style={styles.settingLabel}>Uygulamayı Oyla</ThemedText>
            </View>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>📄</ThemedText>
              <ThemedText style={styles.settingLabel}>Gizlilik Politikası</ThemedText>
            </View>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>ℹ️</ThemedText>
              <ThemedText style={styles.settingLabel}>Hakkında</ThemedText>
            </View>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Versiyon */}
        <ThemedView style={styles.versionContainer}>
          <ThemedText style={styles.versionText}>HabitLeaf v1.0.0</ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 20,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  arrow: {
    fontSize: 24,
    color: '#d0d0d0',
    fontWeight: '300',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  versionText: {
    fontSize: 14,
    opacity: 0.4,
  },
});
