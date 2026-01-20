'use client';

import Image from 'next/image';
import cls from '../deposit.module.scss';
import { DepositCard } from '../helpers/depositConfig';

interface DepositAmountInputProps {
  activeCard: DepositCard;
  value: number;
  onChange: (value: number) => void;
}

export const DepositAmountInput: React.FC<DepositAmountInputProps> = ({
  activeCard,
  value,
  onChange,
}) => {
  return (
    <div className={cls.inputContainer}>
      <Image className={cls.inputImage} src={activeCard.image} width={16} height={16} alt="" />
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, '');
          onChange(Number(v));
        }}
        className={cls.input}
      />
    </div>
  );
};

