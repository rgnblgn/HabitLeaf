import { generateColorsForPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppSelector } from '@/store/hooks';

export function useThemedColors() {
    const theme = useColorScheme() ?? 'light';
    const selectedPalette = useAppSelector((state) => state.theme.selectedPalette);
    const Colors = generateColorsForPalette(selectedPalette);

    return Colors[theme];
}
