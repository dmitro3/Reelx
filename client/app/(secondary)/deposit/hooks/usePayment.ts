
//create hook for payment and i want that we send user by link
import { paymentService } from '@/features/payment/payment';

export const usePayment = () => {
   
    async function handlePayment(amount: number, type: 'stars') {
        const response = await paymentService.handlePayment(amount, type);
        const link = response.invoiceLink;
        window.location.href = link;
    }
    return { handlePayment };
}