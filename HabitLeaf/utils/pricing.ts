/**
 * Pricing configuration - Fetches real prices from Play Store
 * Prices are region-aware and cached locally
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export type Region = 'TR' | 'EU' | 'US';

// Play Store SKU IDs (Configure these in your Play Store Console)
export const PRODUCT_SKUS = {
    monthly: 'habitleaf_monthly_subscription',
    yearly: 'habitleaf_yearly_subscription',
    lifetime: 'habitleaf_lifetime_purchase',
};

export interface PricingPlan {
    id: string;
    name: string;
    price: string; // Display price with currency
    localizedPrice: number; // Numeric price
    currency: string; // Currency code
    period: string;
    badge: string | null;
    recommended?: boolean;
}

export interface PlayStorePriceData {
    sku: string;
    price: number;
    price_micros: number;
    price_currency_code: string;
    formatted_price: string;
    title: string;
}

// Fallback prices (used when Play Store API is unavailable)
export const FALLBACK_PRICES: Record<string, Record<Region, { price: number; currency: string }>> = {
    monthly: {
        TR: { price: 59.99, currency: 'TRY' },
        EU: { price: 2.99, currency: 'EUR' },
        US: { price: 2.99, currency: 'USD' },
    },
    yearly: {
        TR: { price: 349.99, currency: 'TRY' },
        EU: { price: 19.99, currency: 'EUR' },
        US: { price: 19.99, currency: 'USD' },
    },
    lifetime: {
        TR: { price: 599.99, currency: 'TRY' },
        EU: { price: 29.99, currency: 'EUR' },
        US: { price: 29.99, currency: 'USD' },
    },
};

// Function to detect user's region based on locale
export const detectRegion = (locale?: string): Region => {
    if (!locale) return 'US';

    if (locale.startsWith('tr')) return 'TR';
    if (
        locale.startsWith('de') ||
        locale.startsWith('fr') ||
        locale.startsWith('es') ||
        locale.startsWith('it') ||
        locale.startsWith('pl') ||
        locale.startsWith('nl') ||
        locale.startsWith('pt') ||
        locale.startsWith('sv') ||
        locale.startsWith('no') ||
        locale.startsWith('da')
    ) {
        return 'EU';
    }

    return 'US';
};

// Format price for display
function formatPriceDisplay(price: number, region: Region): string {
    switch (region) {
        case 'TR':
            return `₺${price.toLocaleString('tr-TR')}`;
        case 'EU':
            return `€${price.toLocaleString('de-DE')}`;
        case 'US':
        default:
            return `$${price.toLocaleString('en-US')}`;
    }
}

// Get pricing plans for a region (using fallback prices by default)
export const getPricingPlans = (region: Region): PricingPlan[] => {
    return [
        {
            id: 'monthly',
            name: 'Aylık',
            price: formatPriceDisplay(FALLBACK_PRICES.monthly[region].price, region),
            localizedPrice: FALLBACK_PRICES.monthly[region].price,
            currency: FALLBACK_PRICES.monthly[region].currency,
            period: 'ay',
            badge: null,
            recommended: false,
        },
        {
            id: 'yearly',
            name: 'Yıllık',
            price: formatPriceDisplay(FALLBACK_PRICES.yearly[region].price, region),
            localizedPrice: FALLBACK_PRICES.yearly[region].price,
            currency: FALLBACK_PRICES.yearly[region].currency,
            period: 'yıl',
            badge: '%33 İndirim',
            recommended: true,
        },
        {
            id: 'lifetime',
            name: 'Ömür Boyu',
            price: formatPriceDisplay(FALLBACK_PRICES.lifetime[region].price, region),
            localizedPrice: FALLBACK_PRICES.lifetime[region].price,
            currency: FALLBACK_PRICES.lifetime[region].currency,
            period: 'tek seferlik',
            badge: 'En İyi Değer',
            recommended: false,
        },
    ];
};

// Get currency symbol for region
export const getCurrencySymbol = (region: Region): string => {
    switch (region) {
        case 'TR':
            return '₺';
        case 'EU':
            return '€';
        case 'US':
        default:
            return '$';
    }
};

// Cache prices locally
export const cachePrices = async (cacheData: { region: Region; plans: PricingPlan[]; timestamp?: string }): Promise<void> => {
    try {
        await AsyncStorage.setItem('cached_prices', JSON.stringify(cacheData));
        await AsyncStorage.setItem('cached_prices_timestamp', cacheData.timestamp || new Date().toISOString());
    } catch (error) {
        console.error('Error caching prices:', error);
    }
};

// Get cached prices (expires after 24 hours)
export const getCachedPrices = async (): Promise<{ region: Region; plans: PricingPlan[] } | null> => {
    try {
        const cached = await AsyncStorage.getItem('cached_prices');
        const timestamp = await AsyncStorage.getItem('cached_prices_timestamp');

        if (!cached || !timestamp) return null;

        // Cache expires after 24 hours
        const cacheAge = Date.now() - new Date(timestamp).getTime();
        if (cacheAge > 24 * 60 * 60 * 1000) {
            await AsyncStorage.removeItem('cached_prices');
            await AsyncStorage.removeItem('cached_prices_timestamp');
            return null;
        }

        return JSON.parse(cached);
    } catch (error) {
        console.error('Error reading cached prices:', error);
        return null;
    }
};

// Clear cached prices manually (for debugging/testing)
export const clearCachedPrices = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem('cached_prices');
        await AsyncStorage.removeItem('cached_prices_timestamp');
        console.log('Cached prices cleared');
    } catch (error) {
        console.error('Error clearing cached prices:', error);
    }
};

// Update pricing plan with Play Store prices
export const updatePricingWithPlayStoreData = (
    plans: PricingPlan[],
    playStoreData: Record<string, string>,
    region: Region
): PricingPlan[] => {
    return plans.map((plan) => {
        const playStorePrice = playStoreData[PRODUCT_SKUS[plan.id as keyof typeof PRODUCT_SKUS]];
        if (playStorePrice) {
            return {
                ...plan,
                price: playStorePrice,
            };
        }
        return plan;
    });
};

/**
 * Fetch prices from Play Store API
 * This function attempts to fetch real product prices from Google Play Store
 * Falls back to FALLBACK_PRICES if API call fails
 */
export const fetchPlayStorePrices = async (region: Region): Promise<PricingPlan[]> => {
    try {
        // Check cache first
        const cached = await getCachedPrices();
        if (cached && cached.region === region) {
            console.log(`Using cached prices for region: ${region}`);
            return cached.plans;
        }

        // For Android, attempt to fetch from Play Store
        if (Platform.OS === 'android') {
            try {
                const RNIap = require('react-native-iap').default;

                // Initialize IAP
                await RNIap.initConnection();

                // Prepare SKUs
                const skus = Object.values(PRODUCT_SKUS);

                // Get products from Play Store
                const products = await RNIap.getProducts({ skus });

                console.log('Play Store products fetched:', products);

                if (products && products.length > 0) {
                    // Convert Play Store products to pricing format
                    const playStorePrices: Record<string, string> = {};
                    const planMap: Record<string, keyof typeof PRODUCT_SKUS> = {
                        [PRODUCT_SKUS.monthly]: 'monthly',
                        [PRODUCT_SKUS.yearly]: 'yearly',
                        [PRODUCT_SKUS.lifetime]: 'lifetime',
                    };

                    products.forEach((product: any) => {
                        const planKey = planMap[product.productId];
                        if (planKey) {
                            // Use localizedPrice if available, otherwise use price
                            playStorePrices[product.productId] = product.localizedPrice || product.price;
                        }
                    });

                    // Update plans with real Play Store prices
                    const updatedPlans = getPricingPlans(region).map((plan) => {
                        const sku = PRODUCT_SKUS[plan.id as keyof typeof PRODUCT_SKUS];
                        const playStorePrice = playStorePrices[sku];

                        if (playStorePrice) {
                            return {
                                ...plan,
                                price: playStorePrice,
                            };
                        }
                        return plan;
                    });

                    // Cache the results
                    await cachePrices({
                        region,
                        plans: updatedPlans,
                        timestamp: new Date().toISOString(),
                    });

                    console.log(`Fetched prices from Play Store for region: ${region}`);
                    return updatedPlans;
                }
            } catch (iapError) {
                console.warn('Failed to fetch from Play Store IAP:', iapError);
                // Fall through to fallback
            }
        }

        // Fallback to default prices (iOS, web, or API failure)
        const fallbackPlans = getPricingPlans(region);
        await cachePrices({
            region,
            plans: fallbackPlans,
            timestamp: new Date().toISOString(),
        });

        console.log(`Using fallback prices for region: ${region}`);
        return fallbackPlans;
    } catch (error) {
        console.error('Error fetching prices:', error);
        // Return fallback prices as last resort
        return getPricingPlans(region);
    }
};
