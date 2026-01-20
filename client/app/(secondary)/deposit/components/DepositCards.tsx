'use client';

import Image from 'next/image';
import cls from '../deposit.module.scss';
import { DepositCard } from '../helpers/depositConfig';

interface DepositCardsProps {
  cards: DepositCard[];
  activeCard: DepositCard;
  onSelect: (card: DepositCard) => void;
}

export const DepositCards: React.FC<DepositCardsProps> = ({ cards, activeCard, onSelect }) => {
  return (
    <div className={cls.cards}>
      {cards.map((el) => (
        <div
          style={{ opacity: el.active ? 1 : 0.6 }}
          key={el.state}
          className={`${cls.card} ${el.state === activeCard.state ? cls.active : ''}`}
          onClick={() => el.active && onSelect(el)}
        >
          <Image src={el.image} alt={el.title} width={30} height={30} />
          <span>{el.title}</span>
        </div>
      ))}
    </div>
  );
};

