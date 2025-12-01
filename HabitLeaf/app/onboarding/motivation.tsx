import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Alert, ScrollView, SafeAreaView } from 'react-native';
import { router, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/themed-text';
import { Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useThemedColors } from '@/hooks/use-themed-colors';

const timeSlots = [
    { time: '09:00', icon: '🌅', label: 'Sabah' },
    { time: '14:00', icon: '☀️', label: 'Öğle' },
    { time: '20:00', icon: '🌙', label: 'Akşam' },
];

export default function MotivationScreen() {
    const Colors = useThemedColors();
    const [selectedTime, setSelectedTime] = useState('09:00');
    const routerHook = useRouter();

    // Animasyonlar
    const fadeIn = useRef(new Animated.Value(0)).current;
    const bellAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(bellAnimation, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bellAnimation, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ),
        ]).start();
    }, []);

    const bellRotation = bellAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['-15deg', '15deg'],
    });

    const handleRequestPermission = async () => {
        try {
            // Expo Go'da bildirimler desteklenmiyor
            // Development build'de bu özellik aktif olacak
            console.log('Notification preference saved for future use');
            await AsyncStorage.setItem('notification_enabled', 'pending');
            await AsyncStorage.setItem('notification_time', selectedTime);

            Alert.alert(
                'Tercihler Kaydedildi',
                'Bildirim tercihlerin kaydedildi. Development build veya production uygulamasında bildirimler aktif olacak.',
                [{ text: 'Tamam', onPress: completeOnboarding }]
            );
        } catch (error) {
            console.error('Error saving notification preferences:', error);
            // Hata durumunda da devam et
            await completeOnboarding();
        }
    };

    const handleSkip = async () => {
        await AsyncStorage.setItem('notification_enabled', 'false');
        await completeOnboarding();
    };

    const completeOnboarding = async () => {
        try {
            console.log('Completing onboarding...');
            await AsyncStorage.setItem('onboarding_completed', 'true');
            console.log('Onboarding completed flag set to true');

            // AsyncStorage'ın yazma işleminin tamamlanması için kısa bir bekleme
            await new Promise(resolve => setTimeout(resolve, 200));

            console.log('Navigating to tabs...');
            // Birden fazla yöntem deneyerek garanti alalım
            routerHook.replace('/(tabs)');
        } catch (error) {
            console.error('Error completing onboarding:', error);
            routerHook.replace('/(tabs)');
        }
    };

    return (
        <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Başlık */}
                    <Animated.View style={[styles.header, { opacity: fadeIn }]}>
                        <Animated.View
                            style={{
                                transform: [{ rotate: bellRotation }],
                            }}
                        >
                            <ThemedText style={styles.bellIcon}>🔔</ThemedText>
                        </Animated.View>
                        <ThemedText style={styles.title}>
                            Günlük Hatırlatma
                        </ThemedText>
                        <ThemedText style={styles.subtitle}>
                            Motivasyonunu yüksek tut! Sana günlük hatırlatmalar göndereceğiz.
                        </ThemedText>
                    </Animated.View>

                    {/* Zaman Seçimi */}
                    <Animated.View style={[styles.timeContainer, { opacity: fadeIn }]}>
                        <ThemedText style={styles.timeLabel}>
                            Hatırlatma Zamanı Seç:
                        </ThemedText>
                        <View style={styles.timeSlots}>
                            {timeSlots.map((slot) => (
                                <TouchableOpacity
                                    key={slot.time}
                                    style={[
                                        styles.timeSlot,
                                        selectedTime === slot.time && styles.timeSlotSelected,
                                    ]}
                                    onPress={() => setSelectedTime(slot.time)}
                                    activeOpacity={0.7}
                                >
                                    <ThemedText style={styles.timeIcon}>{slot.icon}</ThemedText>
                                    <ThemedText
                                        style={[
                                            styles.timeSlotLabel,
                                            selectedTime === slot.time && styles.timeSlotLabelSelected,
                                        ]}
                                    >
                                        {slot.label}
                                    </ThemedText>
                                    <ThemedText
                                        style={[
                                            styles.timeSlotTime,
                                            selectedTime === slot.time && styles.timeSlotTimeSelected,
                                        ]}
                                    >
                                        {slot.time}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>

                    {/* Butonlar */}
                    <Animated.View style={[styles.buttonsContainer, { opacity: fadeIn }]}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={handleRequestPermission}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[Colors.primary, Colors.secondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <ThemedText style={styles.primaryButtonText}>
                                    İzin İste
                                </ThemedText>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={handleSkip}
                            activeOpacity={0.7}
                        >
                            <ThemedText style={styles.skipButtonText}>
                                Şimdilik Atla
                            </ThemedText>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressDot} />
                    <View style={styles.progressDot} />
                    <View style={[styles.progressDot, styles.progressDotActive]} />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        marginTop: Spacing.lg,
    },
    bellIcon: {
        fontSize: 70,
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#fff',
        opacity: 0.9,
        textAlign: 'center',
        lineHeight: 22,
    },
    timeContainer: {
        marginBottom: Spacing.xl,
    },
    timeLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    timeSlots: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    timeSlot: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    timeSlotSelected: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderColor: '#fff',
    },
    timeIcon: {
        fontSize: 28,
        marginBottom: Spacing.xs,
    },
    timeSlotLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
        opacity: 0.8,
        marginBottom: 4,
    },
    timeSlotLabelSelected: {
        opacity: 1,
    },
    timeSlotTime: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
        opacity: 0.8,
    },
    timeSlotTimeSelected: {
        opacity: 1,
    },
    buttonsContainer: {
        gap: Spacing.md,
        marginTop: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    primaryButton: {
        width: '100%',
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        ...Shadows.medium,
    },
    buttonGradient: {
        paddingVertical: Spacing.lg,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    skipButton: {
        paddingVertical: Spacing.md,
        alignItems: 'center',
    },
    skipButtonText: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.8,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: Spacing.lg,
        paddingTop: Spacing.md,
        gap: Spacing.sm,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    progressDotActive: {
        width: 24,
        backgroundColor: '#fff',
    },
});
