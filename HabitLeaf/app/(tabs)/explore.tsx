import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Switch,
  Alert,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "@/hooks/use-translation";
import { useAppDispatch } from "@/store/hooks";
import { setLanguage } from "@/store/languageSlice";

export default function SettingsScreen() {
  const router = useRouter();
  const { t, currentLanguage } = useTranslation();
  const dispatch = useAppDispatch();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const languages = [
    { code: "tr" as const, label: "Türkçe" },
    { code: "en" as const, label: "English" },
    { code: "de" as const, label: "Deutsch" },
  ];

  // Load saved language on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("app_language");
        if (
          savedLanguage &&
          (savedLanguage === "tr" ||
            savedLanguage === "en" ||
            savedLanguage === "de")
        ) {
          dispatch(setLanguage(savedLanguage));
        }
      } catch (error) {
        console.error("Error loading language:", error);
      }
    };
    loadLanguage();
  }, [dispatch]);

  const handleLanguageChange = async (langCode: "tr" | "en" | "de") => {
    try {
      // i18n'i hemen güncelle
      const i18n = require("@/services/i18n").default;
      i18n.locale = langCode;

      // Redux'a kaydet
      dispatch(setLanguage(langCode));

      // AsyncStorage'a kaydet
      await AsyncStorage.setItem("app_language", langCode);

      // Komponenti yeniden render et (forceUpdate)
      setNotificationsEnabled((prev) => prev);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const handleResetOnboarding = async () => {
    Alert.alert(
      t("settings.resetOnboardingTitle"),
      t("settings.resetOnboardingMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.reset"),
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("onboarding_completed");
              Alert.alert(
                t("settings.resetSuccess"),
                t("settings.resetSuccessMessage")
              );
            } catch (error) {
              console.error("Error resetting onboarding:", error);
              Alert.alert(
                t("settings.resetError"),
                t("settings.resetErrorMessage")
              );
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title">{t("settings.title")}</ThemedText>
        </ThemedView>

        {/* Tema Ayarları */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t("settings.appearance")}
          </ThemedText>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>🌙</ThemedText>
              <View>
                <ThemedText style={styles.settingLabel}>
                  {t("settings.darkMode")}
                </ThemedText>
                <ThemedText style={styles.settingDescription}>
                  {t("settings.darkModeDesc")}
                </ThemedText>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: "#d0d0d0", true: "#3B82F6" }}
            />
          </View>
        </ThemedView>

        {/* Dil Ayarları */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t("settings.language")}
          </ThemedText>

          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.settingRow}
              onPress={() => handleLanguageChange(lang.code)}
            >
              <View style={styles.settingLeft}>
                <ThemedText style={styles.settingIcon}>🌍</ThemedText>
                <ThemedText style={styles.settingLabel}>
                  {lang.label}
                </ThemedText>
              </View>
              {currentLanguage === lang.code && (
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              )}
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Bildirim Ayarları */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t("settings.notifications")}
          </ThemedText>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>🔔</ThemedText>
              <View>
                <ThemedText style={styles.settingLabel}>
                  {t("settings.notifications")}
                </ThemedText>
                <ThemedText style={styles.settingDescription}>
                  {t("settings.notificationsDesc")}
                </ThemedText>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#d0d0d0", true: "#3B82F6" }}
            />
          </View>
        </ThemedView>

        {/* Hesap */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t("settings.account")}
          </ThemedText>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push("/premium" as any)}
          >
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>👑</ThemedText>
              <View>
                <ThemedText style={styles.settingLabel}>
                  {t("settings.premium")}
                </ThemedText>
                <ThemedText style={styles.settingDescription}>
                  {t("settings.premiumDesc")}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>📊</ThemedText>
              <ThemedText style={styles.settingLabel}>
                Verilerimi Dışa Aktar
              </ThemedText>
            </View>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Diğer */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t("settings.about")}
          </ThemedText>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleResetOnboarding}
          >
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>🔄</ThemedText>
              <ThemedText style={styles.settingLabel}>
                {t("settings.resetOnboarding")}
              </ThemedText>
            </View>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>❓</ThemedText>
              <ThemedText style={styles.settingLabel}>
                Yardım & Destek
              </ThemedText>
            </View>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>⭐</ThemedText>
              <ThemedText style={styles.settingLabel}>
                {t("settings.rateApp")}
              </ThemedText>
            </View>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>📄</ThemedText>
              <ThemedText style={styles.settingLabel}>
                {t("settings.privacy")}
              </ThemedText>
            </View>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>ℹ️</ThemedText>
              <ThemedText style={styles.settingLabel}>
                {t("settings.about")}
              </ThemedText>
            </View>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Versiyon */}
        <ThemedView style={styles.versionContainer}>
          <ThemedText style={styles.versionText}>
            HabitLeaf {t("settings.version")} 1.0.0
          </ThemedText>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 20,
    color: "#3B82F6",
    fontWeight: "bold",
  },
  arrow: {
    fontSize: 24,
    color: "#d0d0d0",
    fontWeight: "300",
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  versionText: {
    fontSize: 14,
    opacity: 0.4,
  },
});
