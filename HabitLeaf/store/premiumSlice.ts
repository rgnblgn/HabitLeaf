import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PremiumState {
    isPremium: boolean;
}

const initialState: PremiumState = {
    isPremium: false,
};

export const premiumSlice = createSlice({
    name: 'premium',
    initialState,
    reducers: {
        setPremium: (state, action: PayloadAction<boolean>) => {
            state.isPremium = action.payload;
        },
    },
});

export const { setPremium } = premiumSlice.actions;
export default premiumSlice.reducer;
