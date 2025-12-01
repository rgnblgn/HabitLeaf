import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '@/store/hooks';
import { setPremium } from '@/store/premiumSlice';

const premiumFeatures = [
    {
        icon: '📊',
        title: 'Gelişmiş İstatistikler',
        description: 'Detaylı grafikler ve aylık raporlar',
    },
    {
        icon: '🎨',
        title: 'Sınırsız Özelleştirme',
        description: 'Tema, renk ve ikon seçenekleri',
    },
    {
        icon: '☁️',
        title: 'Bulut Yedekleme',
        description: 'Verilerinizi tüm cihazlarda senkronize edin',
    },
    {
        icon: '🔔',
        title: 'Akıllı Hatırlatmalar',
        description: 'Kişiselleştirilmiş bildirimler',
    },
    {
        icon: '📝',
        title: 'Sınırsız Notlar',
        description: 'Her alışkanlığa not ve hedef ekleyin',
    },
    {
        icon: '🏆',
        title: 'Rozetler & Ödüller',
        description: 'Başarılarınızı kutlayın',
    },
    {
        icon: '📈',
        title: 'Alışkanlık Analizi',
        description: 'AI destekli içgörüler',
    },
    {
        icon: '🚫',
        title: 'Reklamsız Deneyim',
        description: 'Kesintisiz kullanım',
    },
];

const pricingPlans = [
    {
        id: 'monthly',
        name: 'Aylık',
        price: '49.99 TL',
        period: 'ay',
        badge: null,
    },
    {
        id: 'yearly',
        name: 'Yıllık',
        price: '399.99 TL',
        period: 'yıl',
        badge: '%33 İndirim',
        recommended: true,
    },
    {
        id: 'lifetime',
        name: 'Ömür Boyu',
        price: '999.99 TL',
        period: 'tek seferlik',
        badge: 'En İyi Değer',
    },
];

export default function PremiumScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleUpgrade = async () => {
        try {
            // Premium satın alma simülasyonu
            await AsyncStorage.setItem('premium_status', 'true');
            dispatch(setPremium(true));
            router.back();
        } catch (error) {
            console.error('Error upgrading to premium:', error);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <ThemedView style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                        <ThemedText style={styles.closeText}>✕</ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                {/* Premium Badge */}
                <ThemedView style={styles.badgeContainer}>
                    <View style={styles.crownContainer}>
                        <ThemedText style={styles.crownIcon}>👑</ThemedText>
                    </View>
                    <ThemedText type="title" style={styles.title}>HabitLeaf Premium</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        Tüm özelliklerin kilidini açın ve potansiyelinizi maksimize edin
                    </ThemedText>
                </ThemedView>

                {/* Features */}
                <ThemedView style={styles.featuresSection}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Premium Özellikleri
                    </ThemedText>
                    {premiumFeatures.map((feature, index) => (
                        <View key={index} style={styles.featureCard}>
                            <View style={styles.featureIcon}>
                                <ThemedText style={styles.featureIconText}>{feature.icon}</ThemedText>
                            </View>
                            <View style={styles.featureContent}>
                                <ThemedText style={styles.featureTitle}>{feature.title}</ThemedText>
                                <ThemedText style={styles.featureDescription}>{feature.description}</ThemedText>
                            </View>
                            <ThemedText style={styles.featureCheck}>✓</ThemedText>
                        </View>
                    ))}
                </ThemedView>

                {/* Pricing Plans */}
                <ThemedView style={styles.pricingSection}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Planınızı Seçin
                    </ThemedText>
                    {pricingPlans.map((plan) => (
                        <TouchableOpacity
                            key={plan.id}
                            style={[
                                styles.pricingCard,
                                plan.recommended && styles.recommendedCard,
                            ]}
                        >
                            {plan.badge && (
                                <View style={styles.badge}>
                                    <ThemedText style={styles.badgeText}>{plan.badge}</ThemedText>
                                </View>
                            )}
                            <View style={styles.pricingHeader}>
                                <ThemedText style={styles.planName}>{plan.name}</ThemedText>
                                {plan.recommended && (
                                    <ThemedText style={styles.recommendedBadge}>Önerilen</ThemedText>
                                )}
                            </View>
                            <View style={styles.pricingContent}>
                                <ThemedText style={styles.price}>{plan.price}</ThemedText>
                                <ThemedText style={styles.period}>/ {plan.period}</ThemedText>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ThemedView>

                {/* Testimonials */}
                <ThemedView style={styles.testimonialsSection}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Kullanıcılarımız Ne Diyor?
                    </ThemedText>
                    <View style={styles.testimonialCard}>
                        <ThemedText style={styles.testimonialStars}>⭐⭐⭐⭐⭐</ThemedText>
                        <ThemedText style={styles.testimonialText}>
                            "Premium'a geçtiğimden beri hayatım değişti. İstatistikler motivasyonumu artırıyor!"
                        </ThemedText>
                        <ThemedText style={styles.testimonialAuthor}>- Ahmet Y.</ThemedText>
                    </View>
                    <View style={styles.testimonialCard}>
                        <ThemedText style={styles.testimonialStars}>⭐⭐⭐⭐⭐</ThemedText>
                        <ThemedText style={styles.testimonialText}>
                            "Bulut yedekleme özelliği harika. Tüm cihazlarımda verilerim senkron."
                        </ThemedText>
                        <ThemedText style={styles.testimonialAuthor}>- Zeynep K.</ThemedText>
                    </View>
                </ThemedView>

                {/* Money Back Guarantee */}
                <ThemedView style={styles.guaranteeSection}>
                    <ThemedText style={styles.guaranteeIcon}>💯</ThemedText>
                    <ThemedText style={styles.guaranteeTitle}>7 Gün Para İade Garantisi</ThemedText>
                    <ThemedText style={styles.guaranteeText}>
                        Memnun kalmazsan 7 gün içinde tam iade
                    </ThemedText>
                </ThemedView>
            </ScrollView>

            {/* CTA Button */}
            <View style={styles.ctaContainer}>
                <TouchableOpacity style={styles.ctaButton} onPress={handleUpgrade}>
                    <ThemedText style={styles.ctaButtonText}>Premium'a Başla</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.termsText}>
                    Devam ederek Kullanım Şartları'nı kabul etmiş olursunuz
                </ThemedText>
            </View>
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
        alignItems: 'flex-end',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeText: {
        fontSize: 20,
        color: '#666',
    },
    badgeContainer: {
        alignItems: 'center',
        padding: 20,
        paddingTop: 0,
    },
    crownContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FEF3C7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    crownIcon: {
        fontSize: 48,
    },
    title: {
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        opacity: 0.7,
        paddingHorizontal: 20,
    },
    featuresSection: {
        padding: 20,
    },
    sectionTitle: {
        marginBottom: 16,
    },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    featureIconText: {
        fontSize: 24,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 13,
        opacity: 0.6,
    },
    featureCheck: {
        fontSize: 20,
        color: '#10B981',
        fontWeight: 'bold',
    },
    pricingSection: {
        padding: 20,
    },
    pricingCard: {
        padding: 20,
        marginBottom: 12,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    recommendedCard: {
        borderColor: '#3B82F6',
        backgroundColor: '#EFF6FF',
    },
    badge: {
        position: 'absolute',
        top: -12,
        right: 20,
        backgroundColor: '#EF4444',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    pricingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    planName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    recommendedBadge: {
        fontSize: 12,
        color: '#3B82F6',
        fontWeight: '600',
    },
    pricingContent: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    period: {
        fontSize: 16,
        opacity: 0.6,
        marginLeft: 4,
    },
    testimonialsSection: {
        padding: 20,
    },
    testimonialCard: {
        padding: 20,
        marginBottom: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
    },
    testimonialStars: {
        fontSize: 16,
        marginBottom: 8,
    },
    testimonialText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    testimonialAuthor: {
        fontSize: 13,
        opacity: 0.6,
        fontStyle: 'italic',
    },
    guaranteeSection: {
        alignItems: 'center',
        padding: 20,
        margin: 20,
        backgroundColor: '#F0FDF4',
        borderRadius: 12,
    },
    guaranteeIcon: {
        fontSize: 48,
        marginBottom: 8,
    },
    guaranteeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    guaranteeText: {
        fontSize: 14,
        opacity: 0.7,
    },
    ctaContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    ctaButton: {
        backgroundColor: '#3B82F6',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    ctaButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    termsText: {
        textAlign: 'center',
        fontSize: 12,
        opacity: 0.5,
    },
});
