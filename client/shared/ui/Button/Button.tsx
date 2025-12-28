'use client'
import { useState } from 'react';
import cls from './Button.module.scss';

interface ButtonProps {
    text: string;
    customClass?:string
}

const Button = ({text, customClass}:ButtonProps) => {

    return(
        <button className={`${cls.button} ${customClass}`}>{text}</button>
    )
}

export { Button }