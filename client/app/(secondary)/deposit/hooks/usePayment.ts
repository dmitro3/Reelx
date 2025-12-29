//create hook for payment and i want that we send user by link
import { useEffect, useRef, useState, useCallback } from 'react';
import { paymentService } from '@/features/payment/payment';
import { usePaymentStore } from '@/entites/payment/model/payment';
import { useUserStore } from '@/entites/user/model/user';

export const usePayment = () => {
    const [isChecking, setIsChecking] = useState(false);
    const lastTransactionIdRef = useRef<string | null>(null);
    const isCheckingRef = useRef(false);
    const { setStarsBalance } = usePaymentStore();
    const { user, updateBalance } = useUserStore();

    const checkPayment = useCallback(async () => {
        if (isCheckingRef.current) return;
        
        try {
            isCheckingRef.current = true;
            setIsChecking(true);
            
            const [balance, latestTransaction] = await Promise.all([
                paymentService.getBalance(),
                paymentService.getLatestTransaction(),
            ]);

            setStarsBalance(balance.starsBalance);

            // Обновляем баланс в user store
            if (user) {
                const currentStarsBalance = user.starsBalance ?? 0;
                const currentTonBalance = user.tonBalance ?? 0;
                const starsDiff = balance.starsBalance - currentStarsBalance;
                const tonDiff = balance.tonBalance - currentTonBalance;

                if (starsDiff !== 0) {
                    updateBalance(starsDiff, 'stars');
                }
                if (tonDiff !== 0) {
                    updateBalance(tonDiff, 'ton');
                }
            }

            if (latestTransaction && latestTransaction.id !== lastTransactionIdRef.current) {
                if (lastTransactionIdRef.current !== null) {
                    console.log(`✅ Платеж успешно обработан! Транзакция: ${latestTransaction.amount} ${latestTransaction.type}`);
                }
                lastTransactionIdRef.current = latestTransaction.id;
            } else if (latestTransaction && !lastTransactionIdRef.current) {
                // Первая загрузка - сохраняем ID последней транзакции
                lastTransactionIdRef.current = latestTransaction.id;
            }
        } catch (error) {
            console.error('Error checking payment:', error);
        } finally {
            isCheckingRef.current = false;
            setIsChecking(false);
        }
    }, [setStarsBalance, user, updateBalance]);

    useEffect(() => {
        checkPayment();
    }, [checkPayment]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    checkPayment();
                }, 500);
            }
        };

        const handleFocus = () => {
            // Добавляем небольшую задержку, чтобы избежать частых запросов
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                checkPayment();
            }, 500);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [checkPayment]);
   
    async function handlePayment(amount: number, type: 'stars') {
        try {
            // Сохраняем текущее состояние перед платежом
            const currentBalance = await paymentService.getBalance();
            const currentTransaction = await paymentService.getLatestTransaction();
            
            setStarsBalance(currentBalance.starsBalance);

            // Обновляем баланс в user store
            if (user) {
                const currentStarsBalance = user.starsBalance ?? 0;
                const currentTonBalance = user.tonBalance ?? 0;
                const starsDiff = currentBalance.starsBalance - currentStarsBalance;
                const tonDiff = currentBalance.tonBalance - currentTonBalance;

                if (starsDiff !== 0) {
                    updateBalance(starsDiff, 'stars');
                }
                if (tonDiff !== 0) {
                    updateBalance(tonDiff, 'ton');
                }
            }

            lastTransactionIdRef.current = currentTransaction?.id || null;

            const response = await paymentService.handlePayment(amount, type);
            const link = response.invoiceLink;
            window.location.href = link;
        } catch (error) {
            console.error('Error initiating payment:', error);
            throw error;
        }
    }

    return { handlePayment, isChecking };
}