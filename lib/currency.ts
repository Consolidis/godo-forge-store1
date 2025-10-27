export const USD_TO_XAF_RATE = 600;

export const convertUSDtoXAF = (priceInUSD: number): number => {
  return priceInUSD * USD_TO_XAF_RATE;
};
