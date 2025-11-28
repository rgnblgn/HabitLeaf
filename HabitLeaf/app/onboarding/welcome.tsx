import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export default function WelcomeScreen() {
    // Animasyonlar
    const leafScale = useRef(new Animated.Value(0.5)).current;
    const leafRotate = useRef(new Animated.Value(0)).current;
    const fadeIn = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Yaprak animasyonu
        Animated.parallel([
            Animated.spring(leafScale, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(leafRotate, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 800,
                delay: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const rotation = leafRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['-10deg', '0deg'],
    });

    const handleStart = () => {
        router.push('/onboarding/how-it-works' as any);
    };

    return (
        <LinearGradient
            colors={[Colors.light.gradientStart, Colors.light.gradientEnd]}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    {/* Yaprak İkonu - Animasyonlu */}
                    <Animated.View
                        style={[
                            styles.leafContainer,
                            {
                                transform: [
                                    { scale: leafScale },
                                    { rotate: rotation },
                                ],
                            },
                        ]}
                    >
                        <ThemedText style={styles.leafIcon}>🍃</ThemedText>
                    </Animated.View>

                    {/* Başlık ve Açıklama */}
                    <Animated.View style={[styles.textContainer, { opacity: fadeIn }]}>
                        <ThemedText style={styles.title}>HabitLeaf</ThemedText>
                        <ThemedText style={styles.subtitle}>
                            Küçük adımlarla büyük değişimler
                        </ThemedText>
                        <ThemedText style={styles.description}>
                            Her gün biraz daha iyi olmanın en kolay yolu.
                            Alışkanlıklarını takip et, ilerlemeyi gör.
                        </ThemedText>
                    </Animated.View>

                    {/* Başla Butonu */}
                    <Animated.View style={[styles.buttonContainer, { opacity: fadeIn }]}>
                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={handleStart}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[Colors.light.primary, Colors.light.secondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <ThemedText style={styles.buttonText}>Başla</ThemedText>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressDot, styles.progressDotActive]} />
                    <View style={styles.progressDot} />
                    <View style={styles.progressDot} />
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
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    leafContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xxl,
        ...Shadows.large,
    },
    leafIcon: {
        fontSize: 80,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 20,
        color: '#fff',
        opacity: 0.95,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.85,
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 300,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 320,
    },
    startButton: {
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
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
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
