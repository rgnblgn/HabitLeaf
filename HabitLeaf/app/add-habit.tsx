import {
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    View,
    TextInput,
    Text,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppDispatch } from '@/store/hooks';
import { addHabit } from '@/store/habitsSlice';

const COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#F59E0B', // Orange
    '#EF4444', // Red
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316', // Dark Orange
];

const ICONS = ['💧', '🏃', '📚', '🧘', '🎯', '✍️', '🎵', '🍎', '💪', '🌟', '🔥', '⚡'];

const FREQUENCIES: Array<{
    id: string;
    label: string;
    value: 'daily' | 'weekly' | 'monthly';
    icon: string;
}> = [
        { id: 'daily', label: 'Her Gün', value: 'daily', icon: '📅' },
        { id: 'weekly', label: 'Haftalık', value: 'weekly', icon: '📆' },
        { id: 'monthly', label: 'Aylık', value: 'monthly', icon: '🗓️' },
    ];

export default function AddHabitScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const dispatch = useAppDispatch();

    const [name, setName] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
    const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');

    const handleSave = () => {
        if (!name.trim()) {
            alert('Lütfen alışkanlık adı girin');
            return;
        }

        // Redux'a yeni alışkanlık ekle
        dispatch(
            addHabit({
                name,
                color: selectedColor,
                icon: selectedIcon,
                frequency: selectedFrequency,
                createdDate: new Date().toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                }),
            })
        );

        router.back();
    };

    return (
        <ThemedView style={styles.container}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={[theme.primary, theme.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Yeni Alışkanlık</Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Preview Card */}
                <View style={[styles.previewCard, Shadows.medium]}>
                    <View style={[styles.previewIcon, { backgroundColor: selectedColor + '20' }]}>
                        <Text style={styles.previewIconText}>{selectedIcon}</Text>
                    </View>
                    <Text style={[styles.previewName, { color: theme.text }]}>
                        {name || 'Alışkanlık Adı'}
                    </Text>
                    <Text style={[styles.previewFrequency, { color: theme.textSecondary }]}>
                        {FREQUENCIES.find((f) => f.value === selectedFrequency)?.label}
                    </Text>
                </View>

                {/* İsim */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: theme.text }]}>
                        Alışkanlık Adı<Text style={{ color: theme.error }}> *</Text>
                    </Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
                        value={name}
                        onChangeText={setName}
                        placeholder="Örn: Su İç, Spor Yap..."
                        placeholderTextColor={theme.textSecondary}
                        autoFocus
                    />
                </View>

                {/* İkon Seçimi */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: theme.text }]}>
                        İkon Seç
                    </Text>
                    <View style={styles.iconGrid}>
                        {ICONS.map((icon) => (
                            <TouchableOpacity
                                key={icon}
                                style={[
                                    styles.iconOption,
                                    { backgroundColor: theme.cardBackground },
                                    selectedIcon === icon && {
                                        backgroundColor: selectedColor + '20',
                                        borderColor: selectedColor,
                                        borderWidth: 2,
                                    },
                                ]}
                                onPress={() => setSelectedIcon(icon)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.iconText}>{icon}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Renk Seçimi */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: theme.text }]}>
                        Renk Seç
                    </Text>
                    <View style={styles.colorGrid}>
                        {COLORS.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.colorOption,
                                    { backgroundColor: color },
                                    selectedColor === color && styles.selectedColor,
                                ]}
                                onPress={() => setSelectedColor(color)}
                                activeOpacity={0.8}
                            >
                                {selectedColor === color && (
                                    <View style={styles.colorCheckContainer}>
                                        <Text style={styles.colorCheck}>✓</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Sıklık Seçimi */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: theme.text }]}>
                        Sıklık
                    </Text>
                    <View style={styles.frequencyContainer}>
                        {FREQUENCIES.map((freq) => (
                            <TouchableOpacity
                                key={freq.id}
                                style={[
                                    styles.frequencyOption,
                                    {
                                        backgroundColor: theme.cardBackground,
                                        borderColor: theme.border,
                                    },
                                    selectedFrequency === freq.value && {
                                        backgroundColor: selectedColor + '10',
                                        borderColor: selectedColor,
                                    },
                                ]}
                                onPress={() => setSelectedFrequency(freq.value)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.frequencyIcon}>{freq.icon}</Text>
                                <Text
                                    style={[
                                        styles.frequencyText,
                                        { color: theme.text },
                                        selectedFrequency === freq.value && { color: selectedColor, fontWeight: '600' },
                                    ]}
                                >
                                    {freq.label}
                                </Text>
                                {selectedFrequency === freq.value && (
                                    <View style={[styles.frequencyCheck, { backgroundColor: selectedColor }]}>
                                        <Text style={styles.frequencyCheckText}>✓</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Floating Save Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.saveButton, Shadows.large]}
                    onPress={handleSave}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={[selectedColor, selectedColor + 'DD']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.saveButtonGradient}
                    >
                        <Text style={styles.saveButtonText}>✓  Kaydet</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerGradient: {
        paddingTop: 60,
        paddingBottom: Spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: Spacing.xl,
    },
    previewCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.lg,
        marginBottom: Spacing.xl,
        padding: Spacing.xl,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
    },
    previewIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    previewIconText: {
        fontSize: 48,
    },
    previewName: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: Spacing.xs,
    },
    previewFrequency: {
        fontSize: 14,
    },
    section: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.xl,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: Spacing.md,
    },
    input: {
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    iconOption: {
        width: 64,
        height: 64,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.small,
    },
    iconText: {
        fontSize: 32,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    colorOption: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.small,
    },
    selectedColor: {
        transform: [{ scale: 1.1 }],
        ...Shadows.medium,
    },
    colorCheckContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    colorCheck: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '700',
    },
    frequencyContainer: {
        gap: Spacing.md,
    },
    frequencyOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 2,
        gap: Spacing.md,
    },
    frequencyIcon: {
        fontSize: 24,
    },
    frequencyText: {
        flex: 1,
        fontSize: 16,
    },
    frequencyCheck: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    frequencyCheckText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    buttonContainer: {
        padding: Spacing.lg,
        paddingBottom: Spacing.xl,
    },
    saveButton: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
    },
    saveButtonGradient: {
        paddingVertical: Spacing.md + 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
