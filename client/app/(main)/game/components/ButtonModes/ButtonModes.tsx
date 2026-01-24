'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import cls from './ButtonModes.module.scss';

const ButtonModes = () => {
    const pathname = usePathname();
    const isPvP = pathname === '/game';
    const isSolo = pathname === '/game/spin';

    const pages = [
        {
            title: 'Соло',
            link: '/game/spin',
            isActive: isSolo,
        },
        {
            title: 'PvP',
            link: '/game',
            isActive: isPvP,
        },
    ]

    return (
        <div className={cls.buttonModes}>
            {
                pages.map(page => (
                    <Link key={page.link} href={page.link} className={`${cls.modeButton} ${page.isActive ? cls.active : ''}`}>
                        <span className={cls.modeText}>{page.title}</span>
                    </Link>
                ))
            }
        </div>
    );
};

export { ButtonModes };

