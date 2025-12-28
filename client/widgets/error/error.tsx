import cls from './error.module.scss';
import Image from 'next/image'
import errorImage from '@/assets/NFT.png'
import { Button } from '@/shared/ui/Button/Button';

interface ErrorProps {
    errorText: string;
    errorSubText: string;
}

const Error = ({errorText, errorSubText}:ErrorProps) => {

    return (
        <div className={cls.error}>

            <div className={cls.info}>
                <Image src={errorImage} alt='error' width={100} height={100} />
                <span className={cls.header}>{errorText}</span>
                <p className={cls.content}>{errorSubText}</p>
            </div>

            <Button text='Понятно'></Button>
        </div>
    )
}

export { Error }