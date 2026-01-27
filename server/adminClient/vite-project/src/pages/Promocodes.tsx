import { useState, useEffect } from 'react';
import { promocodesService, type Promocode, type CreatePromocodeDto } from '../services/promocodesService';
import './Promocodes.css';

export default function Promocodes() {
  const [promocodes, setPromocodes] = useState<Promocode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<CreatePromocodeDto>({
    promocode: '',
    currency: 'TON',
    amount: 0,
    type: 'balance',
  });

  useEffect(() => {
    loadPromocodes();
  }, []);

  const loadPromocodes = async () => {
    setLoading(true);
    try {
      const data = await promocodesService.getPromocodes();
      setPromocodes(data);
    } catch (error) {
      console.error('Error loading promocodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await promocodesService.createPromocode(formData);
      setShowCreateModal(false);
      setFormData({ promocode: '', currency: 'TON', amount: 0, type: 'balance' });
      loadPromocodes();
    } catch (error) {
      alert('Ошибка при создании промокода');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Удалить промокод?')) {
      try {
        await promocodesService.deletePromocode(id);
        loadPromocodes();
      } catch (error) {
        alert('Ошибка при удалении промокода');
      }
    }
  };

  return (
    <div className="promocodes-page">
      <div className="page-header">
        <h1>Управление промокодами</h1>
        <button onClick={() => setShowCreateModal(true)} className="create-btn">
          Создать промокод
        </button>
      </div>

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : (
        <div className="table-container">
          <table className="promocodes-table">
            <thead>
              <tr>
                <th>Промокод</th>
                <th>Валюта</th>
                <th>Сумма</th>
                <th>Использований</th>
                <th>Дата создания</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {promocodes.map((promo) => (
                <tr key={promo.id}>
                  <td>
                    <code className="promocode-code">{promo.promocode}</code>
                  </td>
                  <td>{promo.currency}</td>
                  <td>{promo.amount.toFixed(2)}</td>
                  <td>{promo.usageCount || 0}</td>
                  <td>{new Date(promo.createdAt).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="btn btn-danger"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Создать промокод</h2>
            <div className="form-group">
              <label>Промокод</label>
              <input
                type="text"
                value={formData.promocode}
                onChange={(e) => setFormData({ ...formData, promocode: e.target.value })}
                placeholder="PROMO123"
              />
            </div>
            <div className="form-group">
              <label>Тип</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as 'balance' | 'deposit' })
                }
              >
                <option value="balance">Бонус к балансу</option>
                <option value="deposit">Бонус при пополнении</option>
              </select>
            </div>
            <div className="form-group">
              <label>Валюта</label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value as 'TON' | 'STARS' })
                }
              >
                <option value="TON">TON</option>
                <option value="STARS">STARS</option>
              </select>
            </div>
            <div className="form-group">
              <label>Сумма</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleCreate} className="btn btn-primary">
                Создать
              </button>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
