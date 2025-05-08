declare module 'i18next' {
  import { i18n } from 'i18next';
  export default i18n;
}

declare module 'react-i18next' {
  export function useTranslation(ns?: string | string[]): {
    t: (key: string, options?: any) => string;
    i18n: any;
    ready: boolean;
  };
  export const initReactI18next: any;
}

declare module 'react-native-localize' {
  export function getLocales(): Array<{
    countryCode: string;
    languageTag: string;
    languageCode: string;
    isRTL: boolean;
  }>;
  
  export function getNumberFormatSettings(): {
    decimalSeparator: string;
    groupingSeparator: string;
  };
  
  export function getCalendar(): string;
  export function getCountry(): string;
  export function getCurrencies(): string[];
  export function getTemperatureUnit(): string;
  export function getTimeZone(): string;
  export function uses24HourClock(): boolean;
  export function usesMetricSystem(): boolean;
  
  export function addEventListener(
    type: string,
    handler: Function,
  ): void;
  export function removeEventListener(
    type: string,
    handler: Function,
  ): void;
}

declare module '*.json' {
  const value: any;
  export default value;
} 