const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface LoginResponse {
  accessToken: string;
}

interface PaymentRequest {
  amount: number;
  type: 'stars';
}

interface PaymentResponse {
  invoiceLink: string;
  amount: number;
  type: string;
}

export const userApi = {
  /**
   * Авторизация через Telegram initData
   * @param initData - Telegram WebApp initData строка
   * @returns accessToken
   */
  async login(initData: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData }),
      credentials: 'include', // Для получения cookies с refreshToken
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  /**
   * Получение ссылки на оплату
   * @param paymentData - Данные для оплаты (amount, type)
   * @param accessToken - JWT токен для авторизации
   * @returns invoiceLink и данные платежа
   */
  async payment(paymentData: PaymentRequest, accessToken: string): Promise<PaymentResponse> {
    const response = await fetch(`${API_URL}/users/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Payment request failed' }));
      throw new Error(error.message || 'Payment request failed');
    }

    return response.json();
  },
};

