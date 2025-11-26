import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Mock veri - gerçekte state management'tan gelecek
const mockHabitDetails = {
    '1': {
        id: '1',
        name: 'Su İç',
        color: '#3B82F6',
        icon: '💧',
        frequency: 'Her Gün',
        streak: 12,
        totalCompleted: 45,
        createdDate: '14 Kasım 2025',
        history: [
            { date: '26 Kas', completed: false },
            { date: '25 Kas', completed: true },
            { date: '24 Kas', completed: true },
            { date: '23 Kas', completed: true },
            { date: '22 Kas', completed: false },
            { date: '21 Kas', completed: true },
            { date: '20 Kas', completed: true },
        ],
    },
    '2': {
        id: '2',
        name: 'Spor Yap',
        color: '#10B981',
        icon: '🏃',
        frequency: 'Her Gün',
        streak: 7,
        totalCompleted: 28,
        createdDate: '19 Kasım 2025',
        history: [],
    },
    '3': {
        id: '3',
        name: 'Kitap Oku',
        color: '#8B5CF6',
        icon: '📚',
        frequency: 'Her Gün',
        streak: 3,
        totalCompleted: 15,
        createdDate: '23 Kasım 2025',
        history: [],
    },
};

export default function HabitDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const habitId = (id as string) || '1';
    const habit = mockHabitDetails[habitId as keyof typeof mockHabitDetails] || mockHabitDetails['1'];

    return (
        <ThemedView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <ThemedView style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <ThemedText style={styles.backButton}>← Geri</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <ThemedText style={styles.editButton}>Düzenle</ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                {/* Alışkanlık Başlık */}
                <ThemedView style={[styles.habitHeader, { backgroundColor: habit.color }]}>
                    <ThemedText style={styles.habitIcon}>{habit.icon}</ThemedText>
                    <ThemedText style={styles.habitName}>{habit.name}</ThemedText>
                    <ThemedText style={styles.habitFrequency}>{habit.frequency}</ThemedText>
                </ThemedView>

                {/* İstatistikler */}
                <ThemedView style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <ThemedText style={styles.statNumber}>{habit.streak}</ThemedText>
                        <ThemedText style={styles.statLabel}>Gün Serisi</ThemedText>
                    </View>
                    <View style={styles.statCard}>
                        <ThemedText style={styles.statNumber}>{habit.totalCompleted}</ThemedText>
                        <ThemedText style={styles.statLabel}>Toplam</ThemedText>
                    </View>
                    <View style={styles.statCard}>
                        <ThemedText style={styles.statNumber}>
                            {habit.totalCompleted > 0 ? Math.round((habit.totalCompleted / 50) * 100) : 0}%
                        </ThemedText>
                        <ThemedText style={styles.statLabel}>Başarı</ThemedText>
                    </View>
                </ThemedView>

                {/* Detaylar */}
                <ThemedView style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>Detaylar</ThemedText>
                    <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Oluşturulma Tarihi:</ThemedText>
                        <ThemedText style={styles.detailValue}>{habit.createdDate}</ThemedText>
                    </View>
                    <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Sıklık:</ThemedText>
                        <ThemedText style={styles.detailValue}>{habit.frequency}</ThemedText>
                    </View>
                    <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Renk:</ThemedText>
                        <View style={[styles.colorBadge, { backgroundColor: habit.color }]} />
                    </View>
                </ThemedView>

                {/* Son 7 Gün */}
                {habit.history.length > 0 && (
                    <ThemedView style={styles.section}>
                        <ThemedText type="subtitle" style={styles.sectionTitle}>Son 7 Gün</ThemedText>
                        <View style={styles.historyContainer}>
                            {habit.history.map((day: any, index: number) => (
                                <View key={index} style={styles.historyDay}>
                                    <ThemedText style={styles.historyDate}>{day.date}</ThemedText>
                                    <View
                                        style={[
                                            styles.historyIndicator,
                                            day.completed ? styles.historyCompleted : styles.historyIncomplete,
                                        ]}
                                    >
                                        {day.completed && <ThemedText style={styles.historyCheck}>✓</ThemedText>}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ThemedView>
                )}

                {/* Notlar Bölümü */}
                <ThemedView style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>Notlar</ThemedText>
                    <ThemedText style={styles.notesPlaceholder}>
                        Henüz not eklenmedi. Premium özellikler ile notlarınızı ekleyebilirsiniz.
                    </ThemedText>
                </ThemedView>
            </ScrollView>

            {/* Sil Butonu */}
            <TouchableOpacity style={styles.deleteButton}>
                <ThemedText style={styles.deleteButtonText}>Alışkanlığı Sil</ThemedText>
            </TouchableOpacity>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
    },
    backButton: {
        fontSize: 16,
        color: '#3B82F6',
    },
    editButton: {
        fontSize: 16,
        color: '#3B82F6',
    },
    habitHeader: {
        alignItems: 'center',
        padding: 40,
        margin: 20,
        borderRadius: 20,
    },
    habitIcon: {
        fontSize: 64,
        marginBottom: 12,
    },
    habitName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    habitFrequency: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        opacity: 0.6,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    detailLabel: {
        fontSize: 16,
        opacity: 0.6,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    colorBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    historyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    historyDay: {
        alignItems: 'center',
        gap: 8,
    },
    historyDate: {
        fontSize: 12,
        opacity: 0.6,
    },
    historyIndicator: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyCompleted: {
        backgroundColor: '#10B981',
    },
    historyIncomplete: {
        backgroundColor: '#e0e0e0',
    },
    historyCheck: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    notesPlaceholder: {
        fontSize: 14,
        opacity: 0.5,
        fontStyle: 'italic',
    },
    deleteButton: {
        margin: 20,
        padding: 16,
        backgroundColor: '#EF4444',
        borderRadius: 12,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
