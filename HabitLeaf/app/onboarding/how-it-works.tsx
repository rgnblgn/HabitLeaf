import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useThemedColors } from '@/hooks/use-themed-colors';

const features = [
    {
        icon: '✓',
        title: 'Hedef Belirle',
        description: 'Alışkanlığını ekle',
    },
    {
        icon: '📅',
        title: 'Takip Et',
        description: 'Her gün işaretle',
    },
    {
        icon: '🔥',
        title: 'Streak Kazan',
        description: 'Motivasyonunu koru',
    },
];

export default function HowItWorksScreen() {
    const Colors = useThemedColors();
    // Animasyonlar
    const iconAnimations = useRef(
        features.map(() => new Animated.Value(0))
    ).current;
    const fadeIn = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // İkonları sırayla animate et
        const animations = iconAnimations.map((anim, index) =>
            Animated.spring(anim, {
                toValue: 1,
                delay: index * 200,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            })
        );

        Animated.parallel([
            ...animations,
            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleContinue = () => {
        console.log('Devam Et clicked');
        router.push('/onboarding/motivation' as any);
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
                        <ThemedText style={styles.title}>Nasıl Çalışır?</ThemedText>
                        <ThemedText style={styles.subtitle}>
                            3 basit adımda alışkanlık kazanmaya başla
                        </ThemedText>
                    </Animated.View>

                    {/* Özellikler */}
                    <View style={styles.featuresContainer}>
                        {features.map((feature, index) => {
                            const scale = iconAnimations[index].interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.3, 1],
                            });

                            return (
                                <Animated.View
                                    key={index}
                                    style={[
                                        styles.featureCard,
                                        {
                                            transform: [{ scale }],
                                            opacity: iconAnimations[index],
                                        },
                                    ]}
                                >
                                    <View style={styles.iconContainer}>
                                        <ThemedText style={styles.featureIcon}>
                                            {feature.icon}
                                        </ThemedText>
                                    </View>
                                    <ThemedText style={styles.featureTitle}>
                                        {feature.title}
                                    </ThemedText>
                                    <ThemedText style={styles.featureDescription}>
                                        {feature.description}
                                    </ThemedText>
                                </Animated.View>
                            );
                        })}
                    </View>

                    {/* Devam Et Butonu */}
                    <Animated.View style={[styles.buttonContainer, { opacity: fadeIn }]}>
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={handleContinue}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[Colors.primary, Colors.secondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <ThemedText style={styles.buttonText}>Devam Et</ThemedText>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressDot} />
                    <View style={[styles.progressDot, styles.progressDotActive]} />
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
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        textAlign: 'center',
    },
    featuresContainer: {
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    featureCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        alignItems: 'center',
        ...Shadows.medium,
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    featureIcon: {
        fontSize: 36,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: Spacing.xs,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.85,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        marginTop: Spacing.md,
        marginBottom: Spacing.lg,
    },
    continueButton: {
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
