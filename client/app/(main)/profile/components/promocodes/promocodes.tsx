import cls from './promocodes.module.scss';

const Promocodes = () => {

    return (
        <div className={cls.promocodes}>
            <h4>Промокод</h4>
            
            <p className={cls.content}>Свежие промокоды в канале <a href='https://t.me/ReelXGamingDevBot'>@ReelX</a></p>
          
        </div>
    )
}

export { Promocodes }