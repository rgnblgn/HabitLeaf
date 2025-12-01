import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
    selectedPalette: string;
}

const initialState: ThemeState = {
    selectedPalette: 'default',
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setThemePalette: (state, action: PayloadAction<string>) => {
            state.selectedPalette = action.payload;
        },
    },
});

export const { setThemePalette } = themeSlice.actions;
export default themeSlice.reducer;
