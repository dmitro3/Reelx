'use client'
import React from 'react';
import cls from './TablesList.module.scss';
import { TableItem } from '../TableItem/TableItem';

interface Table {
    id: string;
    glowColor: string;
    participantsCount: number;
    price: number;
    members: {
        id: string;
        name: string;
        avatar: string | null;
    }[];
}

const TablesList = () => {
    // Захардкоженный список подарков
    const tables: Table[] = [
        {
            id: '1',
            glowColor: '#00FF00', // Зеленый
            participantsCount: 2,
            price: 35,
            members: [
                {
                    id: '1',
                    name: 'John Doe',
                    avatar: null
                },
                {
                    id: '2',
                    name: 'Jane Doe',
                    avatar: null
                }
            ]
        },
        {
            id: '2',
            glowColor: '#FFA500', // Желтый/Оранжевый
            participantsCount: 3,
            price: 25,
            members: [
                {
                    id: '1',
                    name: 'John Doe',
                    avatar: null
                }
            ]
        },
        {
            id: '3',
            glowColor: '#FF00FF', // Фиолетовый/Магента
            participantsCount: 3,
            price: 15,
            members: [
                {
                    id: '1',
                    name: 'John Doe',
                    avatar: null
                }
            ]
        },
        {
            id: '4',
            glowColor: '#00BFFF', // Голубой
            participantsCount: 3,
            price: 25,
            members: [
                {
                    id: '1',
                    name: 'John Doe',
                    avatar: null
                }
            ]
        }
    ];

    const [selectedTableId, setSelectedTableId] = React.useState<string | null>(null);

    return (
        <div className={cls.tablesList}>
            {tables.map((table) => (
                <div 
                    key={table.id}
                    className={cls.tableWrapper}
                    onClick={() => setSelectedTableId(selectedTableId === table.id ? null : table.id)}
                >
                    <TableItem
                        id={table.id}
                        glowColor={table.glowColor}
                        currency={{
                            price: table.price,
                            type: 'star'
                        }}
                        members={table.members}
                        isSelected={selectedTableId === table.id}
                    />
                </div>
            ))}
        </div>
    );
};

export { TablesList };

