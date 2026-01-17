'use client'
import { TablesList } from './components/TablesList/TablesList';
import { TableButton } from './components/TableButton/TableButton';
import cls from './game.module.scss';
import starIcon from '@/assets/icons/grey-star.svg';
import Image from 'next/image';

export default function GamePage() {
    return (
        <div className={cls.gamePage}>
            <div className={cls.commingSoon}>
                <span>Coming Soon</span>
            </div>
            <div className={cls.downContainer}>
                <div className={cls.pageHeader}>
                    <div className={cls.titleContainer}>
                        <h3 className={cls.title}>Столы</h3>
                        <Image src={starIcon} alt="Star" width={16} height={16} className={cls.starIcon} />
                    </div>
                </div>

                <TablesList />
                
                <TableButton />
            </div>
        </div>
    )
}