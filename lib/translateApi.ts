// import { translate } from '@vitalets/google-translate-api';
import { translate } from 'free-translate';

export const translateToEn = async (str: string) => await translate(str, { to: 'en' });
export const translateToJa = async (str: string) => await translate(str, { to: 'ja' });
