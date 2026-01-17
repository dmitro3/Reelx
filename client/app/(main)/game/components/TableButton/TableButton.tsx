'use client'
import cls from './TableButton.module.scss';

interface TableButtonProps {
    onClick?: () => void;
}

const TableButton = ({ onClick }: TableButtonProps) => {
    return (
        <button className={cls.tableButton} onClick={onClick}>
            Создать стол
        </button>
    );
};

export { TableButton };

