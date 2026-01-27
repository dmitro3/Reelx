import api from './api';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'stars' | 'ton';
  createdAt: string;
  user?: {
    id: string;
    username: string;
  };
}

export interface TransactionFilters {
  userId?: string;
  type?: 'stars' | 'ton';
  from?: string;
  to?: string;
  minAmount?: number;
  maxAmount?: number;
}

export const transactionsService = {
  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>('/transactions', { params: filters });
    return response.data;
  },
};
