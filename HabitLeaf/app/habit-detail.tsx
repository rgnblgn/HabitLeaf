import { StyleSheet, ScrollView, TouchableOpacity, View, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { deleteHabit } from '@/store/habitsSlice';

export default function HabitDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const dispatch = useAppDispatch();

    const habitId = (id as string) || '1';

    // Redux'tan alışkanlığı al
    const habit = useAppSelector((state) =>
        state.habits.habits.find((h) => h.id === habitId)
    );

    if (!habit) {
        return (
            <ThemedView style={styles.container}>
                <ThemedView style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <ThemedText style={styles.backButton}>← Geri</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
                <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ThemedText>Alışkanlık bulunamadı</ThemedText>
                </ThemedView>
            </ThemedView>
        );
    }

    const handleDelete = () => {
        Alert.alert(
            'Alışkanlığı Sil',
            'Bu alışkanlığı silmek istediğinize emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(deleteHabit(habitId));
                        router.back();
                    },
                },
            ]
        );
    };

    const getFrequencyLabel = (frequency: string) => {
        switch (frequency) {
            case 'daily':
                return 'Her Gün';
            case 'weekly':
                return 'Haftalık';
            case 'monthly':
                return 'Aylık';
            default:
                return frequency;
        }
    };

    const getLast30Days = () => {
        const days = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            const dateString = `${date.getDate()}/${date.getMonth() + 1}`;
            const isToday = i === 0;
            const isFuture = false;

            days.push({
                day: date.getDate(),
                dateString,
                isToday,
                isFuture,
                fullDate: date,
            });
        }

        return days;
    };

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
                    <ThemedText style={styles.habitFrequency}>{getFrequencyLabel(habit.frequency)}</ThemedText>
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
                        <ThemedText style={styles.detailValue}>{getFrequencyLabel(habit.frequency)}</ThemedText>
                    </View>
                    <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Renk:</ThemedText>
                        <View style={[styles.colorBadge, { backgroundColor: habit.color }]} />
                    </View>
                </ThemedView>

                {/* Son 30 Gün Takvimi */}
                <ThemedView style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>Son 30 Gün</ThemedText>
                    <View style={styles.calendarContainer}>
                        {/* Gün başlıkları */}
                        <View style={styles.weekDaysRow}>
                            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, index) => (
                                <View key={index} style={styles.weekDayCell}>
                                    <ThemedText style={styles.weekDayText}>{day}</ThemedText>
                                </View>
                            ))}
                        </View>

                        {/* Takvim günleri */}
                        <View style={styles.calendarGrid}>
                            {getLast30Days().map((day, index) => {
                                const historyEntry = habit.history.find((h: any) => h.date === day.dateString);
                                const isCompleted = historyEntry?.completed;
                                const isFuture = day.isFuture;
                                const isToday = day.isToday;

                                return (
                                    <View key={index} style={styles.calendarDayContainer}>
                                        <View
                                            style={[
                                                styles.calendarDay,
                                                isCompleted && styles.calendarDayCompleted,
                                                !isCompleted && !isFuture && historyEntry && styles.calendarDayMissed,
                                                isFuture && styles.calendarDayFuture,
                                                isToday && styles.calendarDayToday,
                                            ]}
                                        >
                                            <ThemedText
                                                style={[
                                                    styles.calendarDayText,
                                                    isCompleted && styles.calendarDayTextCompleted,
                                                    isFuture && styles.calendarDayTextFuture,
                                                ]}
                                            >
                                                {day.day}
                                            </ThemedText>
                                        </View>
                                        {isCompleted && (
                                            <View style={styles.checkmarkContainer}>
                                                <ThemedText style={styles.checkmark}>✓</ThemedText>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>

                        {/* Açıklama */}
                        <View style={styles.legendContainer}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendIndicator, styles.calendarDayCompleted]} />
                                <ThemedText style={styles.legendText}>Tamamlandı</ThemedText>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendIndicator, styles.calendarDayMissed]} />
                                <ThemedText style={styles.legendText}>Kaçırıldı</ThemedText>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendIndicator, styles.calendarDayFuture]} />
                                <ThemedText style={styles.legendText}>Gelecek</ThemedText>
                            </View>
                        </View>
                    </View>
                </ThemedView>

                {/* Notlar Bölümü */}
                <ThemedView style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>Notlar</ThemedText>
                    <ThemedText style={styles.notesPlaceholder}>
                        Henüz not eklenmedi. Premium özellikler ile notlarınızı ekleyebilirsiniz.
                    </ThemedText>
                </ThemedView>
            </ScrollView>

            {/* Sil Butonu */}
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
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
    // Calendar styles
    calendarContainer: {
        gap: 16,
    },
    weekDaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    weekDayCell: {
        width: 40,
        alignItems: 'center',
    },
    weekDayText: {
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.6,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    calendarDayContainer: {
        width: '13.28%', // 7 days per week with gaps
        aspectRatio: 1,
        position: 'relative',
    },
    calendarDay: {
        flex: 1,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    calendarDayCompleted: {
        backgroundColor: '#10B981',
        borderColor: '#059669',
    },
    calendarDayMissed: {
        backgroundColor: '#FEE2E2',
        borderColor: '#EF4444',
    },
    calendarDayFuture: {
        backgroundColor: '#fafafa',
        borderColor: '#f0f0f0',
    },
    calendarDayToday: {
        borderWidth: 2,
        borderColor: '#3B82F6',
    },
    calendarDayText: {
        fontSize: 14,
        fontWeight: '500',
    },
    calendarDayTextCompleted: {
        color: '#fff',
        fontWeight: 'bold',
    },
    calendarDayTextFuture: {
        opacity: 0.3,
    },
    checkmarkContainer: {
        position: 'absolute',
        top: 2,
        right: 2,
    },
    checkmark: {
        fontSize: 10,
        color: '#fff',
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendIndicator: {
        width: 16,
        height: 16,
        borderRadius: 4,
        borderWidth: 1,
    },
    legendText: {
        fontSize: 12,
        opacity: 0.7,
    },
});
