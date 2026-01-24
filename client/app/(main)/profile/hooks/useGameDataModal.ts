import { useState, useCallback } from 'react';
import { Game } from '@/entites/user/interface/game.interface';

export const useGameDataModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

    const openModal = useCallback((game: Game) => {
        setSelectedGame(game);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        // Очищаем selectedGame после анимации закрытия
        setTimeout(() => {
            setSelectedGame(null);
        }, 300);
    }, []);

    return {
        isOpen,
        selectedGame,
        openModal,
        closeModal,
    };
};
