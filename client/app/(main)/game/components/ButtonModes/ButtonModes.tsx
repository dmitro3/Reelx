'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import cls from './ButtonModes.module.scss';

const ButtonModes = () => {
    const pathname = usePathname();
    const isPvP = pathname === '/game';
    const isSolo = pathname === '/game/spin';

    return (
        <div className={cls.buttonModes}>
            <Link 
                href="/game" 
                className={`${cls.modeButton} ${isPvP ? cls.active : ''}`}
            >
                <span className={cls.modeText}>PvP</span>
            </Link>
            <Link 
                href="/game/spin" 
                className={`${cls.modeButton} ${isSolo ? cls.active : ''}`}
            >
                <span className={cls.modeText}>Соло</span>
            </Link>
        </div>
    );
};

export { ButtonModes };

