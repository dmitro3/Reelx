import { useState, useEffect } from 'react';
import { transactionsService, type Transaction, type TransactionFilters } from '../services/transactionsService';
import './Transactions.css';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilters>({});

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await transactionsService.getTransactions(filters);
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1>История транзакций</h1>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="User ID"
          value={filters.userId || ''}
          onChange={(e) => setFilters({ ...filters, userId: e.target.value || undefined })}
          className="filter-input"
        />
        <select
          value={filters.type || ''}
          onChange={(e) =>
            setFilters({ ...filters, type: (e.target.value as 'stars' | 'ton') || undefined })
          }
          className="filter-select"
        >
          <option value="">Все типы</option>
          <option value="ton">TON</option>
          <option value="stars">STARS</option>
        </select>
        <input
          type="date"
          value={filters.from || ''}
          onChange={(e) => setFilters({ ...filters, from: e.target.value || undefined })}
          className="date-input"
        />
        <input
          type="date"
          value={filters.to || ''}
          onChange={(e) => setFilters({ ...filters, to: e.target.value || undefined })}
          className="date-input"
        />
        <button onClick={() => setFilters({})} className="clear-filters-btn">
          Сбросить
        </button>
      </div>

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : (
        <div className="table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Пользователь</th>
                <th>Тип</th>
                <th>Сумма</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id.slice(0, 8)}...</td>
                  <td>
                    {transaction.user?.username || transaction.userId.slice(0, 8)}...
                  </td>
                  <td>
                    <span className={`type-badge type-${transaction.type}`}>
                      {transaction.type.toUpperCase()}
                    </span>
                  </td>
                  <td className={transaction.amount >= 0 ? 'positive' : 'negative'}>
                    {transaction.amount >= 0 ? '+' : ''}
                    {transaction.amount.toFixed(2)}
                  </td>
                  <td>{new Date(transaction.createdAt).toLocaleString('ru-RU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
