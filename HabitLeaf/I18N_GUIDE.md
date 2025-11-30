# HabitLeaf - Çoklu Dil Desteği

## 🌍 Desteklenen Diller

HabitLeaf artık 3 dilde kullanılabilir:

- 🇹🇷 **Türkçe** (Varsayılan)
- 🇬🇧 **English**
- 🇩🇪 **Deutsch**

## 📦 Kurulum

Proje `i18n-js` ve `expo-localization` paketlerini kullanıyor:

```bash
npm install i18n-js expo-localization
```

## 📁 Dosya Yapısı

```
HabitLeaf/
├── locales/
│   ├── tr.json          # Türkçe çeviriler
│   ├── en.json          # İngilizce çeviriler
│   └── de.json          # Almanca çeviriler
├── services/
│   └── i18n.ts          # i18n yapılandırması
├── store/
│   ├── languageSlice.ts # Dil durumu yönetimi
│   └── store.ts         # Redux store
└── hooks/
    └── use-translation.ts # Çeviri hook'u
```

## 🚀 Kullanım

### Bileşenlerde Çeviri Kullanımı

```typescript
import { useTranslation } from "@/hooks/use-translation";

export default function MyComponent() {
  const { t } = useTranslation();

  return <Text>{t("home.title")}</Text>;
}
```

### Parametreli Çeviriler

```typescript
const { t } = useTranslation();

// Örnek: "7 gün ücretsiz, sonra $9.99/ay"
<Text>{t("premium.freeTrialDesc", { price: "$9.99" })}</Text>;
```

### Dil Değiştirme

```typescript
import { useAppDispatch } from "@/store/hooks";
import { setLanguage } from "@/store/languageSlice";

const dispatch = useAppDispatch();

// Dili değiştir
dispatch(setLanguage("en")); // 'tr' | 'en' | 'de'
```

## 🔑 Çeviri Anahtarları

### Ana Kategoriler

- `common.*` - Genel butonlar ve aksiyonlar
- `tabs.*` - Sekme başlıkları
- `home.*` - Ana sayfa metinleri
- `addHabit.*` - Alışkanlık ekleme sayfası
- `habitDetail.*` - Alışkanlık detay sayfası
- `settings.*` - Ayarlar sayfası
- `onboarding.*` - Onboarding ekranları
- `premium.*` - Premium sayfası

### Örnekler

```typescript
t("common.save"); // "Kaydet" / "Save" / "Speichern"
t("home.title"); // "Bugünkü Alışkanlıklar"
t("settings.language"); // "Dil" / "Language" / "Sprache"
t("addHabit.habitName"); // "Alışkanlık Adı"
```

## 🎨 Yeni Dil Ekleme

1. `locales/` klasörüne yeni JSON dosyası ekleyin (örn: `fr.json`)
2. `services/i18n.ts` dosyasına import edin:

   ```typescript
   import fr from "../locales/fr.json";

   const i18n = new I18n({
     tr,
     en,
     de,
     fr, // Yeni dil
   });
   ```

3. `store/languageSlice.ts` dosyasında tip tanımını güncelleyin:
   ```typescript
   currentLanguage: "tr" | "en" | "de" | "fr";
   ```
4. Ayarlar sayfasında (`app/(tabs)/explore.tsx`) dil seçeneğini ekleyin

## 💾 Dil Tercihi Saklama

Kullanıcının seçtiği dil AsyncStorage'da saklanır ve uygulama her açıldığında otomatik olarak yüklenir:

```typescript
// Dil kaydedilir
await AsyncStorage.setItem("app_language", "en");

// Dil yüklenir
const savedLanguage = await AsyncStorage.getItem("app_language");
```

## 🔄 Otomatik Dil Algılama

Uygulama ilk kez açıldığında, cihazın dil ayarlarını algılar:

```typescript
import * as Localization from "expo-localization";

i18n.locale = Localization.locale; // Örn: "tr-TR", "en-US"
```

## 📝 Çeviri İpuçları

1. **Tutarlılık**: Aynı konseptler için aynı terimleri kullanın
2. **Bağlam**: Çeviri anahtarlarını anlamlı kategorilere ayırın
3. **Parametreler**: Dinamik içerikler için `{{param}}` notasyonu kullanın
4. **Pluralization**: Gerekirse `i18n-js` pluralization özelliklerini kullanın
5. **Birim testler**: Eksik çeviriler için testler yazın

## 🐛 Hata Ayıklama

Eksik çeviri anahtarlarını görmek için:

```typescript
// services/i18n.ts
i18n.enableFallback = true; // Varsayılan dile geri dön
i18n.defaultLocale = "tr"; // Varsayılan dil
```

## 📱 Test Etme

1. Ayarlar sayfasına gidin
2. Dil seçeneğini değiştirin
3. Uygulamadaki tüm metinlerin güncellendiğini doğrulayın
4. Uygulamayı kapatıp açarak dil tercihinin saklandığını kontrol edin

## 🎯 Tamamlanan Entegrasyonlar

- ✅ Ana sayfa (Home)
- ✅ Alışkanlık ekleme sayfası
- ✅ Ayarlar sayfası
- ✅ Redux dil yönetimi
- ✅ AsyncStorage ile dil saklama
- ✅ Otomatik dil algılama

## 📚 Kaynaklar

- [i18n-js Documentation](https://github.com/fnando/i18n-js)
- [Expo Localization](https://docs.expo.dev/versions/latest/sdk/localization/)
- [React Native Internationalization](https://reactnative.dev/docs/intro-react-native-components)
