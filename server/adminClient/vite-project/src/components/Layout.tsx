import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

export default function Layout() {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/users', label: 'Пользователи', icon: '👥' },
    { path: '/games', label: 'Статистика игр', icon: '🎮' },
    { path: '/transactions', label: 'Транзакции', icon: '💰' },
    { path: '/settings', label: 'Настройки', icon: '⚙️' },
    { path: '/promocodes', label: 'Промокоды', icon: '🎫' },
  ];

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="header-content">
          <h1 className="header-title">Админ-панель</h1>
          <button onClick={logout} className="logout-btn">
            Выйти
          </button>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
