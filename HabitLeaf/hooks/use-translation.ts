import { useAppSelector } from "@/store/hooks";
import i18n from "@/services/i18n";
import { useEffect, useCallback } from "react";

/**
 * Custom hook to use translations with current language from Redux
 * @returns Translation function (t)
 */
export const useTranslation = () => {
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );

  useEffect(() => {
    i18n.locale = currentLanguage;
  }, [currentLanguage]);

  const t = useCallback(
    (key: string, params?: Record<string, any>) => {
      // Her çağrıda güncel locale'i kullan
      return i18n.t(key, params);
    },
    [currentLanguage]
  );

  return { t, currentLanguage };
};
