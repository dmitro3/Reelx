'use client'
import cls from './Link.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface LinkProps {
    link: string;
    image: string;
    imageActive: string;
    title: string;
}

const NavBarLink = ({link, image, imageActive, title}: LinkProps) => {
    const pathname = usePathname();
    const isActive = pathname.includes(link);
    return (
        <Link href={link}>
            <Image src={isActive ? imageActive : image} alt={title}/>
        </Link>
    )
}

export { NavBarLink };