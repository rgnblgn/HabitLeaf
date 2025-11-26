import { StyleSheet, ScrollView, TouchableOpacity, View, Text, Animated } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Örnek alışkanlık verisi
const mockHabits = [
  { id: '1', name: 'Su İç', color: '#3B82F6', icon: '💧', completed: false },
  { id: '2', name: 'Spor Yap', color: '#10B981', icon: '🏃', completed: true },
  { id: '3', name: 'Kitap Oku', color: '#8B5CF6', icon: '📚', completed: false },
];

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [habits, setHabits] = useState(mockHabits);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const completedCount = habits.filter(h => h.completed).length;
  const progressPercentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: progressPercentage,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  }, [progressPercentage]);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️ Günaydın';
    if (hour < 18) return '🌤️ İyi Günler';
    return '🌙 İyi Akşamlar';
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={[theme.gradientStart, theme.gradientMiddle, theme.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.headerTitle}>Bugün</Text>
              <Text style={styles.date}>26 Kasım 2025</Text>
            </View>
            <TouchableOpacity style={styles.streakBadge}>
              <Text style={styles.streakIcon}>🔥</Text>
              <Text style={styles.streakText}>12</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Günlük İlerleme Kartı */}
        <View style={[styles.progressCard, Shadows.medium]}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={[styles.progressTitle, { color: theme.text }]}>
                Günlük İlerleme
              </Text>
              <Text style={[styles.progressSubtitle, { color: theme.textSecondary }]}>
                {completedCount === habits.length && habits.length > 0
                  ? '🎉 Tebrikler! Hepsini tamamladın'
                  : `${habits.length - completedCount} alışkanlık kaldı`}
              </Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercentage}>
                {Math.round(progressPercentage)}%
              </Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            >
              <LinearGradient
                colors={[theme.primary, theme.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressGradient}
              />
            </Animated.View>
          </View>

          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedCount}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Tamamlandı</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{habits.length}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Toplam</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Seri</Text>
            </View>
          </View>
        </View>

        {/* Alışkanlıklar Listesi */}
        <View style={styles.habitsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Bugünün Alışkanlıkları
            </Text>
            <Text style={[styles.habitCount, { color: theme.textSecondary }]}>
              {habits.length}
            </Text>
          </View>

          {habits.map((habit, index) => (
            <TouchableOpacity
              key={habit.id}
              style={[
                styles.habitCard,
                Shadows.small,
                { backgroundColor: theme.cardBackground },
              ]}
              onPress={() => router.push(`/habit-detail?id=${habit.id}`)}
              activeOpacity={0.7}
            >
              <View style={[styles.habitIconContainer, { backgroundColor: habit.color + '20' }]}>
                <Text style={styles.habitIcon}>{habit.icon}</Text>
              </View>

              <View style={styles.habitContent}>
                <Text style={[styles.habitName, { color: theme.text }]}>{habit.name}</Text>
                <Text style={[styles.habitFrequency, { color: theme.textSecondary }]}>
                  Her gün
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.checkbox,
                  habit.completed && { backgroundColor: habit.color, borderColor: habit.color },
                  !habit.completed && { borderColor: theme.border },
                ]}
                onPress={(e) => {
                  e.stopPropagation();
                  toggleHabit(habit.id);
                }}
              >
                {habit.completed && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          {habits.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🌱</Text>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                Henüz alışkanlık yok
              </Text>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                İlk alışkanlığını ekleyerek başla!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.addButton, Shadows.large]}
        onPress={() => router.push('/add-habit')}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.addButtonGradient}
        >
          <Text style={styles.addButtonIcon}>+</Text>
          <Text style={styles.addButtonText}>Yeni Alışkanlık</Text>
        </LinearGradient>
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
  headerGradient: {
    paddingTop: 60,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
    letterSpacing: -1,
  },
  date: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  streakIcon: {
    fontSize: 20,
  },
  streakText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  progressCard: {
    marginHorizontal: Spacing.lg,
    marginTop: -Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  progressSubtitle: {
    fontSize: 13,
  },
  progressCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366F1',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: '100%',
    borderRadius: BorderRadius.md,
  },
  progressGradient: {
    flex: 1,
    borderRadius: BorderRadius.md,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
  },
  habitsSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  habitCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  habitIconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitIcon: {
    fontSize: 28,
  },
  habitContent: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  habitFrequency: {
    fontSize: 13,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 2,
    gap: Spacing.sm,
  },
  addButtonIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
