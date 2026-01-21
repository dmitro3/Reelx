import { useRef, useState } from 'react';
import cls from './promocodes.module.scss';

const Promocodes = () => {

    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleUsePromocode();
        }
    }

    const handleUsePromocode = () => {
        console.log(inputValue);
    }

    return (
        <div className={cls.promocodes}>
            <h4>Промокод</h4>
            
            <p className={cls.content}>Свежие промокоды в канале <a href='https://t.me/ReelXGamingDevBot'>@ReelX</a></p>
            <div className={cls.inputContainer}>
                <input type="text" placeholder="Введите промокод" value={inputValue} onChange={handleInputChange} onKeyDown={handleInputKeyDown} ref={inputRef} />
                <button className={`${inputValue.length > 0 ? cls.enableButton : cls.disableButton}`} onClick={handleUsePromocode}>Использовать</button>
            </div>
        </div>
    )
}

export { Promocodes }