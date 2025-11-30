import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import tr from "../locales/tr.json";
import en from "../locales/en.json";
import de from "../locales/de.json";

// I18n yapılandırması
const i18n = new I18n({
  tr,
  en,
  de,
});

// Cihazın dil tercihini al veya varsayılan dili kullan
const deviceLocale =
  Localization.locale || Localization.getLocales()[0]?.languageCode || "tr";
// Sadece dil kodunu al (tr-TR -> tr)
const languageCode = deviceLocale.split("-")[0];
// Desteklenen dilleri kontrol et
i18n.locale = ["tr", "en", "de"].includes(languageCode) ? languageCode : "tr";

// Fallback dil (varsayılan)
i18n.enableFallback = true;
i18n.defaultLocale = "tr";

export default i18n;
