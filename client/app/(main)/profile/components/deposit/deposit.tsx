import cls from './deposit.module.scss';
import Image from 'next/image'

import tonImage from '@/assets/ton.svg';
import starImage from '@/assets/star.svg'
import { Button } from '@/shared/ui/Button/Button';

const Deposit = () => {

    return (
        <div className={cls.deposit}>
            <div className={cls.leftContainer}>
                <h2 className={cls.header}>Баланс</h2>
                <div className={cls.balances}>
                    <div className={cls.ton}>
                        <span>{0}</span>
                        <Image src={tonImage} alt="ton" width={20} height={20} />
                    </div>
                    <div className={cls.star}>
                        <span>{0}</span>
                        <Image src={starImage} alt="star" width={20} height={20} />
                    </div>
                </div>
            </div>
            <a href='/deposit' className={cls.rightContainer}>
                <Button text='Депозит' customClass={cls.depositButton}></Button>
            </a>
        </div>
    )
}

export { Deposit }