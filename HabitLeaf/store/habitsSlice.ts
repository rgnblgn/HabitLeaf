import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Habit {
    id: string;
    name: string;
    color: string;
    icon: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    completed: boolean;
    streak: number;
    totalCompleted: number;
    createdDate: string;
    history: {
        date: string;
        completed: boolean;
    }[];
}

interface HabitsState {
    habits: Habit[];
    loading: boolean;
    error: string | null;
}

const initialState: HabitsState = {
    habits: [
        {
            id: '1',
            name: 'Su İç',
            color: '#3B82F6',
            icon: '💧',
            frequency: 'daily',
            completed: false,
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
        {
            id: '2',
            name: 'Spor Yap',
            color: '#10B981',
            icon: '🏃',
            frequency: 'daily',
            completed: true,
            streak: 7,
            totalCompleted: 28,
            createdDate: '19 Kasım 2025',
            history: [],
        },
        {
            id: '3',
            name: 'Kitap Oku',
            color: '#8B5CF6',
            icon: '📚',
            frequency: 'daily',
            completed: false,
            streak: 3,
            totalCompleted: 15,
            createdDate: '23 Kasım 2025',
            history: [],
        },
    ],
    loading: false,
    error: null,
};

const habitsSlice = createSlice({
    name: 'habits',
    initialState,
    reducers: {
        addHabit: (state, action: PayloadAction<Omit<Habit, 'id' | 'completed' | 'streak' | 'totalCompleted' | 'history'>>) => {
            const newHabit: Habit = {
                ...action.payload,
                id: Date.now().toString(),
                completed: false,
                streak: 0,
                totalCompleted: 0,
                history: [],
            };
            state.habits.push(newHabit);
        },

        toggleHabit: (state, action: PayloadAction<string>) => {
            const habit = state.habits.find((h) => h.id === action.payload);
            if (habit) {
                habit.completed = !habit.completed;

                // Update history
                const today = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
                const todayHistory = habit.history.find((h) => h.date === today);

                if (todayHistory) {
                    todayHistory.completed = habit.completed;
                } else {
                    habit.history.unshift({ date: today, completed: habit.completed });
                    if (habit.history.length > 7) {
                        habit.history = habit.history.slice(0, 7);
                    }
                }

                // Update stats
                if (habit.completed) {
                    habit.totalCompleted += 1;
                    habit.streak += 1;
                } else {
                    habit.totalCompleted -= 1;
                    habit.streak = Math.max(0, habit.streak - 1);
                }
            }
        },

        updateHabit: (state, action: PayloadAction<Habit>) => {
            const index = state.habits.findIndex((h) => h.id === action.payload.id);
            if (index !== -1) {
                state.habits[index] = action.payload;
            }
        },

        deleteHabit: (state, action: PayloadAction<string>) => {
            state.habits = state.habits.filter((h) => h.id !== action.payload);
        },

        resetDailyHabits: (state) => {
            state.habits.forEach((habit) => {
                if (habit.frequency === 'daily') {
                    habit.completed = false;
                }
            });
        },
    },
});

export const {
    addHabit,
    toggleHabit,
    updateHabit,
    deleteHabit,
    resetDailyHabits,
} = habitsSlice.actions;

export default habitsSlice.reducer;
