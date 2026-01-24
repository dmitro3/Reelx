'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import cls from './GameDataModal.module.scss';
import tonIcon from '@/assets/ton.svg';
import starsIcon from '@/assets/star.svg';

export interface GamePlayer {
    id: string;
    name: string;
    avatar?: string;
    avatarColor?: string;
    status: string;
    result: number;
    isCurrentUser?: boolean;
}

export interface GameDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameId: string;
    gameType: string;
    date: string;
    time: string;
    bet: number;
    betCurrency: 'TON' | 'STARS';
    chance: string;
    winner: string;
    winAmount?: number;
    winTitle?: string;
    players?: GamePlayer[];
    hash?: string;
}

const formatDateTime = (date: string, time: string) => {
    return { date, time };
};

const getAvatarLetter = (name: string) => {
    return name.charAt(0).toUpperCase();
};

const avatarColors = ['#1775CD', '#8B51E8', '#0D7042', '#199CB3', '#E85151'];

export const GameDataModal = ({
    isOpen,
    onClose,
    gameId,
    gameType,
    date,
    time,
    bet,
    betCurrency,
    chance,
    winner,
    winAmount,
    winTitle,
    players = [],
    hash,
}: GameDataModalProps) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    }, [onClose]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const copyHash = () => {
        if (hash) {
            navigator.clipboard.writeText(hash);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const currencyIcon = betCurrency === 'TON' ? tonIcon : starsIcon;
    const { date: formattedDate, time: formattedTime } = formatDateTime(date, time);

    return (
        <>
            <div 
                className={`${cls.overlay} ${isClosing ? cls.closing : ''}`}
                onClick={handleOverlayClick}
            />
            <div className={`${cls.modal} ${isClosing ? cls.closing : ''}`}>
                <div className={cls.header}>
                    <span className={cls.title}>Игра #{gameId}</span>
                    <button className={cls.closeButton} onClick={handleClose} />
                </div>

                <div className={cls.content}>
                    {/* Game Data */}
                    <div className={cls.gameData}>
                        <div className={cls.dataItem}>
                            <span className={cls.dataLabel}>Игра</span>
                            <span className={cls.dataValue}>#{gameId}</span>
                        </div>
                        <div className={cls.dataItem}>
                            <span className={cls.dataLabel}>Тип</span>
                            <span className={cls.dataValue}>{gameType}</span>
                        </div>
                        <div className={cls.dataItem}>
                            <span className={cls.dataLabel}>Дата</span>
                            <span className={cls.dataValue}>{formattedDate} • {formattedTime}</span>
                        </div>
                        <div className={cls.dataItem}>
                            <span className={cls.dataLabel}>Ставка</span>
                            <span className={cls.dataValue}>{bet} {betCurrency}</span>
                        </div>
                        <div className={cls.dataItem}>
                            <span className={cls.dataLabel}>Шанс</span>
                            <span className={cls.dataValue}>{chance}</span>
                        </div>
                        <div className={cls.dataItem}>
                            <span className={cls.dataLabel}>Победитель</span>
                            <span className={cls.dataValue}>{winner}</span>
                        </div>
                    </div>

                    {/* Win Block */}
                    {winAmount !== undefined && (
                        <div className={cls.winBlock}>
                            <div className={cls.winImage}>
                                {/* Placeholder for gift image */}
                            </div>
                            <div className={cls.winInfo}>
                                <span className={cls.winLabel}>Выигрыш</span>
                                <span className={cls.winTitle}>{winTitle || 'Gift Name'}</span>
                                <div className={cls.winAmount}>
                                    <Image src={currencyIcon} alt={betCurrency} width={17} height={17} />
                                    <span>{winAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={cls.divider} />

                    {/* Players List */}
                    {players.length > 0 && (
                        <>
                            <div className={cls.playersList}>
                                {players.map((player, index) => (
                                    <div key={player.id} className={cls.playerItem}>
                                        <div className={cls.playerInfo}>
                                            <div 
                                                className={cls.playerAvatar}
                                                style={{ 
                                                    backgroundColor: player.avatarColor || avatarColors[index % avatarColors.length] 
                                                }}
                                            >
                                                {player.avatar ? (
                                                    <Image src={player.avatar} alt={player.name} width={30} height={30} />
                                                ) : (
                                                    getAvatarLetter(player.name)
                                                )}
                                            </div>
                                            <div className={cls.playerDetails}>
                                                <span className={cls.playerName}>
                                                    {player.isCurrentUser ? 'Вы' : player.name}
                                                </span>
                                                <span className={cls.playerStatus}>{player.status}</span>
                                            </div>
                                        </div>
                                        <div className={`${cls.playerResult} ${player.result >= 0 ? cls.positive : cls.negative}`}>
                                            <span>{player.result >= 0 ? '+' : ''}{player.result.toFixed(2)}</span>
                                            <Image src={currencyIcon} alt={betCurrency} width={8} height={8} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={cls.divider} />
                        </>
                    )}

                    {/* Actions */}
                    <div className={cls.actions}>
                        {hash && (
                            <button className={`${cls.actionButton} ${cls.secondary}`} onClick={copyHash}>
                                <span className={cls.hashText}>Hash:</span>
                                <span className={cls.hashValue}>{hash.slice(0, 5)}...{hash.slice(-5)}</span>
                                <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                                    <rect x="0.5" y="2.5" width="6" height="9" rx="1" stroke="white" strokeOpacity="0.5"/>
                                    <rect x="3" y="0.5" width="6" height="9" rx="1" fill="#35314B" stroke="white"/>
                                </svg>
                            </button>
                        )}
                        <button className={`${cls.actionButton} ${cls.secondary}`}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M6 1V11M6 11L11 6M6 11L1 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Скачать информацию</span>
                        </button>
                        <button className={`${cls.actionButton} ${cls.primary}`}>
                            Проверить игру
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
