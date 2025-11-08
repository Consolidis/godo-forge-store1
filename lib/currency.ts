import { Shop } from '@/types';

export const convertPrice = (priceInUSD: number, shop: Shop | null): { value: number; currencyCode: string } => {
  if (!shop) {
    // Fallback if shop data is not available
    return { value: priceInUSD, currencyCode: 'USD' };
  }

  const displayCurrency = shop.displayCurrencyCode;
  const exchangeRates = shop.exchangeRates || {};

  if (displayCurrency === 'USD') {
    return { value: priceInUSD, currencyCode: 'USD' };
  }

  let priceInXAF = priceInUSD;
  // Always convert from USD to XAF first, as USD is the base and TaraMoney needs XAF
  const usdToXafRate = exchangeRates['USD_to_XAF'] || 600; // Default fallback
  priceInXAF = priceInUSD * usdToXafRate;

  if (displayCurrency === 'XAF') {
    return { value: priceInXAF, currencyCode: 'XAF' };
  }

  if (displayCurrency === 'EUR') {
    const eurToXafRate = exchangeRates['EUR_to_XAF'];
    if (eurToXafRate && eurToXafRate > 0) {
      const priceInEUR = priceInXAF / eurToXafRate;
      return { value: priceInEUR, currencyCode: 'EUR' };
    } else {
      console.warn(`No EUR_to_XAF exchange rate found. Displaying in XAF.`);
      return { value: priceInXAF, currencyCode: 'XAF' }; // Fallback to XAF
    }
  }

  // Fallback for any other unexpected display currency
  console.warn(`Unsupported display currency: ${displayCurrency}. Displaying in USD.`);
  return { value: priceInUSD, currencyCode: 'USD' };
};

export const formatPrice = (price: number, currencyCode: string): string => {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(price);
};
