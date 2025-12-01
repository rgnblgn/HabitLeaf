/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { generateColorsForPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppSelector } from '@/store/hooks';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ReturnType<typeof generateColorsForPalette>['light'] & keyof ReturnType<typeof generateColorsForPalette>['dark']
) {
  const theme = useColorScheme() ?? 'light';
  const selectedPalette = useAppSelector((state) => state.theme.selectedPalette);
  const Colors = generateColorsForPalette(selectedPalette);
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
