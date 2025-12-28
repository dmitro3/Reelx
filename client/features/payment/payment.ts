import { paymentService as paymentServiceApi } from '@/entites/payment/api/api';

class PaymentService {
    async handlePayment(amount: number, type: 'stars') {
        try {
            const response = await paymentServiceApi.handlePayment(amount, type);
            return response;
        } catch (error) {
            console.error('Error handling payment:', error);
            throw error;
        }
    }
}

export const paymentService = new PaymentService();