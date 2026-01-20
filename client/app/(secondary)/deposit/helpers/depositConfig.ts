import starImage from '@/assets/star.svg';
import tonImage from '@/assets/ton.svg';
import cryptoImage from '@/assets/icons/crytobot.svg';
import cardImage from '@/assets/icons/card.svg';

export type DepositCurrencyType = 'stars' | 'ton';

export interface DepositCard {
  title: string;
  image: string;
  state: string;
  item: string;
  type: DepositCurrencyType;
  active: boolean;
}

export const DEPOSIT_CARDS: DepositCard[] = [
  {
    title: 'TG Stars',
    image: starImage,
    state: 'stars',
    item: 'stars',
    type: 'stars',
    active: true,
  },
  {
    title: 'TON Pay',
    image: tonImage,
    state: 'ton',
    item: 'TON',
    type: 'ton',
    active: true,
  },
  {
    title: 'CryptoBot',
    image: cryptoImage,
    state: 'stars2',
    item: 'stars',
    type: 'stars',
    active: false,
  },
  {
    title: 'Картой',
    image: cardImage,
    state: 'stars3',
    item: 'stars',
    type: 'stars',
    active: false,
  },
];

export const DEPOSIT_PRESET_AMOUNTS: number[] = [10, 25, 50, 100, 250, 500];

