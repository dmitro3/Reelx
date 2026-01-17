'use client'
import { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import cls from './Modal.module.scss';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const modalContent = (
        <div className={cls.overlay} onClick={onClose}>
            <div className={cls.modal} onClick={(e) => e.stopPropagation()}>
                <div className={cls.header}>
                    {title && <h2 className={cls.title}>{title}</h2>}
                    <button className={cls.closeButton} onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className={cls.content}>
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export { Modal };

