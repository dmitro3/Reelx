'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { UserGift } from '@/entites/user/api/api';
import cls from './NftModal.module.scss';

interface NftModalProps {
    isOpen: boolean;
    onClose: () => void;
    nft: UserGift | null;
    onSell?: (nft: UserGift) => void;
}

export const NftModal = ({ isOpen, onClose, nft, onSell }: NftModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSell = () => {
        if (nft && onSell) {
            onSell(nft);
        }
        onClose();
    };

    if (!nft) return null;

    const sellPrice = nft.price ? (nft.price * 0.8).toFixed(2) : '0.00';

    return (
        <div className={`${cls.nftModal} ${isOpen ? cls.open : ''}`}>
            <div className={cls.background} />

            <div className={cls.nftCard}>
                <div className={cls.nftImageWrapper}>
                    {nft.image ? (
                        <Image 
                            src={nft.image} 
                            alt={nft.giftName}
                            width={100}
                            height={100}
                            className={cls.nftImage}
                        />
                    ) : (
                        <div className={cls.nftPlaceholder}>🎁</div>
                    )}
                </div>
                <div className={cls.nftName}>{nft.giftName}</div>
            </div>

            <div className={cls.textBlock}>
                <h2 className={cls.title}>Ваш NFT</h2>
                <p className={cls.subtitle}>{nft.giftName}</p>
            </div>

            <div className={cls.actions}>
                <button className={cls.sellButton} onClick={handleSell}>
                    <span>Продать за</span>
                    <div className={cls.priceTag}>
                        <svg width="11" height="11" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="10" fill="#0098EA"/>
                            <path d="M13.2515 5.18506H6.74827C5.55257 5.18506 4.7947 6.47487 5.39626 7.51757L9.40979 14.4741C9.6717 14.9284 10.328 14.9284 10.59 14.4741L14.6043 7.51757C15.205 6.47653 14.4472 5.18506 13.2523 5.18506H13.2515ZM9.40652 12.388L8.53245 10.6963L6.42338 6.9242C6.28425 6.68277 6.4561 6.37338 6.74746 6.37338H9.40571V12.3888L9.40652 12.388ZM13.5747 6.92339L11.4665 10.6971L10.5924 12.388V6.37257H13.2507C13.542 6.37257 13.7139 6.68195 13.5747 6.92339Z" fill="white"/>
                        </svg>
                        <span>{sellPrice}</span>
                    </div>
                </button>
                
                <button className={cls.backButton} onClick={onClose}>
                    Назад
                </button>
            </div>
        </div>
    );
};
