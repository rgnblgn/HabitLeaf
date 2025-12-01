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
import { LinearGradient } from "expo-linear-gradient";
import { ThemePalettes } from "@/constants/theme";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "@/hooks/use-translation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLanguage } from "@/store/languageSlice";
import { setThemePalette } from "@/store/themeSlice";

export default function SettingsScreen() {
  const router = useRouter();
  const { t, currentLanguage } = useTranslation();
  const dispatch = useAppDispatch();
  const isPremium = useAppSelector((state) => state.premium.isPremium);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedPalette, setSelectedPalette] = useState<string>("default");

  const languages = [
    { code: "tr" as const, label: "Türkçe" },
    { code: "en" as const, label: "English" },
    { code: "de" as const, label: "Deutsch" },
  ];

  // Load saved language and theme palette on mount
  useEffect(() => {
    const loadSettings = async () => {
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

        const savedPalette = await AsyncStorage.getItem("app_theme_palette");
        if (savedPalette && ThemePalettes[savedPalette]) {
          setSelectedPalette(savedPalette);
          dispatch(setThemePalette(savedPalette));
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    loadSettings();
  }, [dispatch]);

  const handleLanguageChange = async (langCode: "tr" | "en" | "de") => {
    try {
      const i18n = require("@/services/i18n").default;
      i18n.locale = langCode;
      dispatch(setLanguage(langCode));
      await AsyncStorage.setItem("app_language", langCode);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const handlePaletteChange = async (paletteId: string) => {
    try {
      setSelectedPalette(paletteId);
      dispatch(setThemePalette(paletteId));
      await AsyncStorage.setItem("app_theme_palette", paletteId);
    } catch (error) {
      console.error("Error saving palette:", error);
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

          <View style={[styles.settingRow, { alignItems: 'flex-start', paddingBottom: 12 }]}>
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>�</ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.settingLabel}>
                  {t("settings.changeTheme")}
                </ThemedText>
                <ThemedText style={styles.settingDescription}>
                  {t("settings.changeThemeDesc")}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Palette picker */}
          {isPremium ? (
            <>
              <View style={styles.palettesContainer}>
                {Object.values(ThemePalettes).map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.paletteButton, selectedPalette === p.id && styles.paletteButtonSelected]}
                    onPress={() => handlePaletteChange(p.id)}
                  >
                    <LinearGradient
                      colors={[p.gradientStart, p.gradientMiddle, p.gradientEnd]}
                      style={styles.paletteSwatch}
                      start={[0, 0]}
                      end={[1, 1]}
                    />
                    {selectedPalette === p.id && (
                      <View style={styles.paletteCheckmark}>
                        <ThemedText style={styles.checkmarkText}>✓</ThemedText>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.paletteLabelsRow}>
                {Object.values(ThemePalettes).map((p) => (
                  <View key={p.id} style={{ flex: 0.31 }}>
                    <ThemedText style={styles.paletteLabel}>
                      {t(`settings.palettes.${p.id}`) || p.name}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={styles.premiumLockedContainer}
              onPress={() => router.push("/premium" as any)}
            >
              <ThemedText style={styles.premiumLockedText}>
                👑 {t("settings.premiumFeature")}
              </ThemedText>
              <ThemedText style={styles.premiumLockedSubText}>
                {t("settings.upgradeToUnlock")}
              </ThemedText>
            </TouchableOpacity>
          )}
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
  palettesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
    paddingHorizontal: 4,
  },
  paletteButton: {
    flex: 0.31,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  paletteButtonSelected: {
    borderColor: "#3B82F6",
  },
  paletteSwatch: {
    flex: 1,
    borderRadius: 10,
  },
  paletteCheckmark: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3B82F6",
  },
  paletteLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  paletteLabel: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.7,
  },
  premiumLockedContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  premiumLockedText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  premiumLockedSubText: {
    fontSize: 13,
    opacity: 0.6,
  },
});
