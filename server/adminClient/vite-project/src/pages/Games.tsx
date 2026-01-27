import { useState, useEffect } from 'react';
import { gamesService, type GameStats } from '../services/gamesService';
import './Games.css';

export default function Games() {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadStats();
  }, [filters]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await gamesService.getStats(filters);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="games-page">
      <div className="page-header">
        <h1>Статистика игр</h1>
      </div>

      <div className="filters-section">
        <input
          type="date"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          className="date-input"
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          className="date-input"
        />
      </div>

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-info">
              <div className="stat-label">Всего игр</div>
              <div className="stat-value">{stats.totalGames}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <div className="stat-label">Solo игры</div>
              <div className="stat-value">{stats.soloGames}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-label">PVP игры</div>
              <div className="stat-value">{stats.pvpGames}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⬆️</div>
            <div className="stat-info">
              <div className="stat-label">Upgrade игры</div>
              <div className="stat-value">{stats.upgradeGames}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <div className="stat-label">Заработано (Rake + RTP)</div>
              <div className="stat-value">
                {(stats.totalRake + stats.totalRTP).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-label">Оборот (сумма ставок)</div>
              <div className="stat-value">{stats.totalTurnover.toFixed(2)}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-data">Нет данных</div>
      )}
    </div>
  );
}
