// Admin Panel JavaScript

class AdminPanel {
    constructor() {
        this.sessionId = localStorage.getItem('adminSessionId');
        // API base path - adjust if your admin app has different prefix
        this.apiBase = '/api/admin-c7ad44cbad762a5da0a4/admin';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuth();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Sidebar menu
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.switchPage(page);
            });
        });
    }

    checkAuth() {
        if (this.sessionId) {
            this.validateSession();
        } else {
            this.showLoginScreen();
        }
    }

    async validateSession() {
        try {
            const response = await fetch(`${this.apiBase}/validate`, {
                method: 'GET',
                headers: {
                    'x-session-id': this.sessionId
                }
            });

            if (response.ok) {
                this.showAdminScreen();
            } else {
                this.clearSession();
                this.showLoginScreen();
            }
        } catch (error) {
            console.error('Session validation error:', error);
            this.clearSession();
            this.showLoginScreen();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const login = formData.get('login');
        const password = formData.get('password');

        const loginBtn = document.getElementById('login-btn');
        const errorDiv = document.getElementById('login-error');

        // Clear previous errors
        errorDiv.textContent = '';
        errorDiv.classList.remove('show');
        loginBtn.disabled = true;
        loginBtn.textContent = 'Вход...';

        try {
            const response = await fetch(`${this.apiBase}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login, password })
            });

            const data = await response.json();

            if (response.ok && data.sessionId) {
                this.sessionId = data.sessionId;
                localStorage.setItem('adminSessionId', this.sessionId);
                this.showAdminScreen();
                this.loadDashboard();
            } else {
                errorDiv.textContent = data.message || 'Неверный логин или пароль';
                errorDiv.classList.add('show');
            }
        } catch (error) {
            console.error('Login error:', error);
            errorDiv.textContent = 'Ошибка подключения к серверу';
            errorDiv.classList.add('show');
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Войти';
        }
    }

    async handleLogout() {
        if (!this.sessionId) {
            this.clearSession();
            return;
        }

        try {
            await fetch(`${this.apiBase}/logout`, {
                method: 'DELETE',
                headers: {
                    'x-session-id': this.sessionId
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearSession();
            this.showLoginScreen();
        }
    }

    clearSession() {
        this.sessionId = null;
        localStorage.removeItem('adminSessionId');
    }

    showLoginScreen() {
        document.getElementById('login-screen').classList.add('active');
        document.getElementById('admin-screen').classList.remove('active');
    }

    showAdminScreen() {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('admin-screen').classList.add('active');
    }

    switchPage(pageName) {
        // Update menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

        // Update pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`${pageName}-page`).classList.add('active');

        // Load page data
        if (pageName === 'dashboard') {
            this.loadDashboard();
        }
    }

    async loadDashboard() {
        // Placeholder for dashboard data loading
        // You can add API calls here to load real statistics
        document.getElementById('stat-users').textContent = '-';
        document.getElementById('stat-gifts').textContent = '-';
        document.getElementById('stat-games').textContent = '-';
        document.getElementById('stat-transactions').textContent = '-';
    }

    async apiCall(endpoint, options = {}) {
        const defaultHeaders = {
            'Content-Type': 'application/json'
        };

        if (this.sessionId) {
            defaultHeaders['x-session-id'] = this.sessionId;
        }

        const response = await fetch(`${this.apiBase}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        if (response.status === 401) {
            this.clearSession();
            this.showLoginScreen();
            throw new Error('Unauthorized');
        }

        return response;
    }
}

// Initialize admin panel when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.adminPanel = new AdminPanel();
    });
} else {
    window.adminPanel = new AdminPanel();
}
