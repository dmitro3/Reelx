import cls from './loading.module.scss';

const Loading = () => {

    return (
        <div className={cls.container}>
            <div className={cls.loading}>
                {
                    Array.from({ length: 10 }).map((_, index) => 
                        <div key={index} className={cls.circle}></div>
                    )
                }
            </div>
        </div>
    )
}

export { Loading }