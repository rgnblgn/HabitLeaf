import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "./habitsSlice";
import languageReducer from "./languageSlice";
import themeReducer from "./themeSlice";
import premiumReducer from "./premiumSlice";

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    language: languageReducer,
    theme: themeReducer,
    premium: premiumReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
