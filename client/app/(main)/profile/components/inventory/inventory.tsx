'use client';

import cls from './inventory.module.scss';
import { useInventory } from './hooks/useInventory';
import { useGameDataModal } from '../../hooks/useGameDataModal';
import { prepareGameModalData } from '../../helpers/gameDataHelper';
import { GiftItem } from './components/GiftItem';
import { GameHistoryItem } from './components/GameHistoryItem';
import { GameDataModal } from '../GameDataModal/GameDataModal';

export const Inventory = () => {
    const { activeTab, setActiveTab, historyGames, inventoryGifts, isLoading } = useInventory();
    const { isOpen, selectedGame, openModal, closeModal } = useGameDataModal();

    const modalData = selectedGame ? prepareGameModalData(selectedGame) : null;

    return (
        <div className={cls.inventory}>
            <div className={cls.tabBar}>
                <button
                    className={`${cls.tab} ${activeTab === 'inventory' ? cls.tabActive : ''}`}
                    onClick={() => setActiveTab('inventory')}
                >
                    Инвентарь
                </button>
                <button
                    className={`${cls.tab} ${activeTab === 'history' ? cls.tabActive : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    История
                </button>
            </div>

            {activeTab === 'history' && (
                <div className={cls.historyList}>
                    {isLoading ? (
                        <div className={cls.emptyState}>Загрузка...</div>
                    ) : historyGames.length === 0 ? (
                        <div className={cls.emptyState}>История пуста</div>
                    ) : (
                        historyGames.map((game) => (
                            <GameHistoryItem 
                                key={game.id} 
                                game={game} 
                                onClick={openModal}
                            />
                        ))
                    )}
                </div>
            )}

            {activeTab === 'inventory' && (
                <div className={cls.inventoryList}>
                    {isLoading ? (
                        <div className={cls.emptyState}>Загрузка...</div>
                    ) : inventoryGifts.length === 0 ? (
                        <div className={cls.emptyState}>Инвентарь пуст</div>
                    ) : (
                        inventoryGifts.map((gift) => (
                            <GiftItem key={gift.id} gift={gift} />
                        ))
                    )}
                </div>
            )}

            {modalData && (
                <GameDataModal
                    isOpen={isOpen}
                    onClose={closeModal}
                    gameId={modalData.gameId}
                    gameType={modalData.gameType}
                    date={modalData.date}
                    time={modalData.time}
                    bet={modalData.bet}
                    betCurrency={modalData.betCurrency}
                    chance={modalData.chance}
                    winner={modalData.winner}
                />
            )}
        </div>
    );
};
