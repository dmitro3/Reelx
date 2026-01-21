import React from 'react';
import Image from 'next/image';
import tonIcon from '@/assets/ton.svg';
import { UserGift } from '@/entites/user/api/api';
import cls from '../inventory.module.scss';

interface HistoryItemProps {
    gift: UserGift;
}

const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const HistoryItem: React.FC<HistoryItemProps> = ({ gift }) => {
    return (
        <div className={cls.historyItem}>
            <div className={cls.historyItemMain}>
                <div className={cls.historyItemInfo}>
                    <div className={cls.historyItemTitle}>{gift.giftName}</div>
                    <div className={cls.historyItemSubtitle}>{formatDateTime(gift.createdAt)}</div>
                </div>

                {gift.price !== undefined && (
                    <div className={cls.historyItemValue}>
                        <Image src={tonIcon} alt="TON" width={12} height={12} />
                        <span>{gift.price.toFixed(2)}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

