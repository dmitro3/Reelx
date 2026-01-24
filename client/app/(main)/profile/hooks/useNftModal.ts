import { useState, useCallback } from 'react';
import { UserGift } from '@/entites/user/api/api';

export const useNftModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedNft, setSelectedNft] = useState<UserGift | null>(null);

    const openModal = useCallback((nft: UserGift) => {
        setSelectedNft(nft);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setTimeout(() => {
            setSelectedNft(null);
        }, 300);
    }, []);

    return {
        isOpen,
        selectedNft,
        openModal,
        closeModal,
    };
};
