import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Bildirim davranışını yapılandır
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export interface NotificationConfig {
    habitId: string;
    habitName: string;
    habitIcon: string;
    time: string; // Format: "HH:mm"
}

class NotificationService {
    private isAvailable: boolean = true;

    constructor() {
        // Expo Go'da çalışıp çalışmadığını kontrol et
        this.checkAvailability();
    }

    private async checkAvailability() {
        try {
            // Expo Go'da expo-notifications kullanılamaz
            if (!Device.isDevice) {
                console.log('Notifications not available on emulator/Expo Go');
                this.isAvailable = false;
                return;
            }
            this.isAvailable = true;
        } catch (error) {
            console.error('Error checking notification availability:', error);
            this.isAvailable = false;
        }
    }

    async requestPermissions(): Promise<boolean> {
        if (!this.isAvailable) {
            console.log('Notifications not available');
            return false;
        }

        try {
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Notification permission denied');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error requesting notification permissions:', error);
            return false;
        }
    }

    async scheduleHabitNotification(config: NotificationConfig): Promise<string | null> {
        if (!this.isAvailable) {
            console.log('Notifications not available, skipping schedule');
            return null;
        }

        try {
            // İzin kontrolü
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) {
                return null;
            }

            // Saat bilgisini parse et
            const [hours, minutes] = config.time.split(':').map(Number);

            // Her gün tekrarlanan bildirim ayarla
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: `${config.habitIcon} ${config.habitName}`,
                    body: 'Alışkanlığını tamamlama zamanı! 🌱',
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                    data: {
                        habitId: config.habitId,
                        type: 'habit_reminder',
                    },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DAILY,
                    hour: hours,
                    minute: minutes,
                },
            });

            // Bildirim ID'sini kaydet
            await this.saveNotificationId(config.habitId, notificationId);

            console.log(`Notification scheduled for ${config.habitName} at ${config.time}`);
            return notificationId;
        } catch (error) {
            console.error('Error scheduling notification:', error);
            return null;
        }
    }

    async cancelHabitNotification(habitId: string): Promise<void> {
        if (!this.isAvailable) {
            return;
        }

        try {
            const notificationId = await this.getNotificationId(habitId);
            if (notificationId) {
                await Notifications.cancelScheduledNotificationAsync(notificationId);
                await this.removeNotificationId(habitId);
                console.log(`Notification cancelled for habit ${habitId}`);
            }
        } catch (error) {
            console.error('Error cancelling notification:', error);
        }
    }

    async updateHabitNotification(config: NotificationConfig): Promise<void> {
        if (!this.isAvailable) {
            return;
        }

        // Önce mevcut bildirimi iptal et
        await this.cancelHabitNotification(config.habitId);
        // Sonra yeni bildirimi ayarla
        await this.scheduleHabitNotification(config);
    }

    async cancelAllNotifications(): Promise<void> {
        if (!this.isAvailable) {
            return;
        }

        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
            await AsyncStorage.removeItem('notification_ids');
            console.log('All notifications cancelled');
        } catch (error) {
            console.error('Error cancelling all notifications:', error);
        }
    }

    async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
        if (!this.isAvailable) {
            return [];
        }

        try {
            return await Notifications.getAllScheduledNotificationsAsync();
        } catch (error) {
            console.error('Error getting scheduled notifications:', error);
            return [];
        }
    }

    // Bildirim ID'lerini kaydetmek için yardımcı fonksiyonlar
    private async saveNotificationId(habitId: string, notificationId: string): Promise<void> {
        try {
            const stored = await AsyncStorage.getItem('notification_ids');
            const ids = stored ? JSON.parse(stored) : {};
            ids[habitId] = notificationId;
            await AsyncStorage.setItem('notification_ids', JSON.stringify(ids));
        } catch (error) {
            console.error('Error saving notification ID:', error);
        }
    }

    private async getNotificationId(habitId: string): Promise<string | null> {
        try {
            const stored = await AsyncStorage.getItem('notification_ids');
            if (stored) {
                const ids = JSON.parse(stored);
                return ids[habitId] || null;
            }
            return null;
        } catch (error) {
            console.error('Error getting notification ID:', error);
            return null;
        }
    }

    private async removeNotificationId(habitId: string): Promise<void> {
        try {
            const stored = await AsyncStorage.getItem('notification_ids');
            if (stored) {
                const ids = JSON.parse(stored);
                delete ids[habitId];
                await AsyncStorage.setItem('notification_ids', JSON.stringify(ids));
            }
        } catch (error) {
            console.error('Error removing notification ID:', error);
        }
    }

    // Günlük bildirim için (tüm alışkanlıklar için)
    async scheduleDailyReminder(time: string): Promise<string | null> {
        if (!this.isAvailable) {
            return null;
        }

        try {
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) {
                return null;
            }

            const [hours, minutes] = time.split(':').map(Number);

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '🍃 HabitLeaf',
                    body: 'Bugünkü alışkanlıklarını kontrol etme zamanı!',
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                    data: {
                        type: 'daily_reminder',
                    },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DAILY,
                    hour: hours,
                    minute: minutes,
                },
            });

            await AsyncStorage.setItem('daily_reminder_id', notificationId);
            console.log(`Daily reminder scheduled at ${time}`);
            return notificationId;
        } catch (error) {
            console.error('Error scheduling daily reminder:', error);
            return null;
        }
    }

    async cancelDailyReminder(): Promise<void> {
        if (!this.isAvailable) {
            return;
        }

        try {
            const notificationId = await AsyncStorage.getItem('daily_reminder_id');
            if (notificationId) {
                await Notifications.cancelScheduledNotificationAsync(notificationId);
                await AsyncStorage.removeItem('daily_reminder_id');
                console.log('Daily reminder cancelled');
            }
        } catch (error) {
            console.error('Error cancelling daily reminder:', error);
        }
    }
}

export const notificationService = new NotificationService();
