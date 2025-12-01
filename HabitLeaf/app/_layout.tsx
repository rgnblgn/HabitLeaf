import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setThemePalette } from '@/store/themeSlice';
import { setLanguage } from '@/store/languageSlice';
import { setPremium } from '@/store/premiumSlice';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Load persisted settings on app start
  useEffect(() => {
    const loadPersistedSettings = async () => {
      try {
        const savedPalette = await AsyncStorage.getItem('app_theme_palette');
        if (savedPalette) {
          store.dispatch(setThemePalette(savedPalette));
        }

        const savedLanguage = await AsyncStorage.getItem('app_language');
        if (savedLanguage && (savedLanguage === 'tr' || savedLanguage === 'en' || savedLanguage === 'de')) {
          store.dispatch(setLanguage(savedLanguage as any));
        }

        const savedPremium = await AsyncStorage.getItem('premium_status');
        if (savedPremium === 'true') {
          store.dispatch(setPremium(true));
        }
      } catch (error) {
        console.error('Error loading persisted settings:', error);
      }
    };

    loadPersistedSettings();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}

function RootNavigator() {
  const [isReady, setIsReady] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem('onboarding_completed');
      console.log('Onboarding status checked:', completed);
      setHasCompletedOnboarding(completed === 'true');
      setIsReady(true);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsReady(true);
    }
  };

  useEffect(() => {
    if (!isReady) return;

    const inOnboarding = segments[0] === 'onboarding';
    const inTabs = segments[0] === '(tabs)';

    console.log('Navigation guard:', { hasCompletedOnboarding, inOnboarding, inTabs, segments });

    // Sadece onboarding tamamlanmamışsa ve onboarding'de değilsek yönlendir
    if (!hasCompletedOnboarding && !inOnboarding) {
      console.log('Navigating to onboarding...');
      router.replace('/onboarding/welcome' as any);
    }
    // Diğer durumlarda müdahale etme, router'ın kendi işini yapmasına izin ver
  }, [isReady, hasCompletedOnboarding]);

  if (!isReady) {
    return null; // Splash screen burada gösterilebilir
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      <Stack.Screen name="add-habit" options={{ presentation: 'modal', title: 'Alışkanlık Ekle' }} />
      <Stack.Screen name="habit-detail" options={{ presentation: 'modal', title: 'Detay' }} />
      <Stack.Screen name="premium" options={{ presentation: 'modal', title: 'Premium' }} />
    </Stack>
  );
}
