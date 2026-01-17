# Настройка NFT Buyber

## Шаг 1: Запустить Redis

Запущен новый Redis контейнер без пароля на порту **6380**:

```bash
docker run -d --name gifts-redis -p 6380:6379 redis:7-alpine
```

Проверка:
```bash
docker ps | grep gifts-redis
redis-cli -p 6380 ping  # Должен ответить: PONG
```

## Шаг 2: Создать .env файл

Создайте файл `/server/nftbuyber/.env`:

```env
PORT=3001
REDIS_URL=redis://localhost:6380
GETGEMS_API_KEY=1768653751058-mainnet-10829409-r-OUg9kDCH8CKm5uEe2ZCtxYgec6XiaVZtLwMY7exnZggWTCIn
```

## Шаг 3: Запустить приложение

```bash
cd /Users/aleksandrnosikov/программы/webapps/gifts/server/nftbuyber
npm run start:dev
```

## Ожидаемые логи

✅ **Успешный запуск:**
```
[RedisService] Connected to Redis
[GiftsSyncService] Starting initial gifts collections sync...
[NestApplication] Nest application successfully started
```

⚠️ **Если GetGems API не работает:**
```
[GetGemsApiClient] GetGems API error: 400 - ...
[GiftsSyncService] Initial sync failed: ...
[GiftsSyncService] Application will continue without initial gift collections data
```

Приложение все равно запустится и будет работать, но без данных коллекций.

## Решение проблем

### 1. Redis ошибка "NOAUTH Authentication required"

**Проблема:** Ваш текущий Redis (порт 6379) требует пароль.

**Решение:** Используем новый Redis на порту 6380 (уже запущен):
```env
REDIS_URL=redis://localhost:6380
```

### 2. GetGems API ошибка 400

**Возможные причины:**
1. API ключ недействителен
2. API изменился
3. Требуется другой формат запроса

**Проверка вручную:**
```bash
curl -X 'GET' \
  'https://api.getgems.io/public-api/v1/gifts/collections' \
  -H 'accept: application/json' \
  -H 'Authorization: 1768653751058-mainnet-10829409-r-OUg9kDCH8CKm5uEe2ZCtxYgec6XiaVZtLwMY7exnZggWTCIn'
```

Если получаете 400, нужен новый API ключ от GetGems.

**Временное решение:** Приложение запустится и будет работать, просто без синхронизации коллекций. Эндпоинты для работы с NFT будут доступны.

## Доступные endpoint'ы

После запуска доступны:

```bash
# NFT данные (работает без GetGems)
GET http://localhost:3001/api/nft/:address

# Информация о синхронизации
GET http://localhost:3001/api/nft/gifts/sync-info

# Коллекции (пусто, если GetGems API не работает)
GET http://localhost:3001/api/nft/gifts/collections
```

## Контейнеры

### Текущие контейнеры Redis:

1. **redis** (порт 6379) - ваш существующий Redis с паролем
2. **gifts-redis** (порт 6380) - новый Redis для разработки без пароля ✅

### Команды:

```bash
# Список контейнеров
docker ps | grep redis

# Остановить старый Redis (если нужно)
docker stop redis

# Остановить gifts-redis
docker stop gifts-redis

# Удалить gifts-redis
docker rm gifts-redis

# Логи
docker logs gifts-redis
```

## Альтернатива: использовать существующий Redis

Если хотите использовать существующий Redis (порт 6379), узнайте пароль:

```bash
# Найти пароль в конфиге другого проекта
grep -r "REDIS" /Users/aleksandrnosikov/программы/webapps/*/

# Обновить .env
REDIS_URL=redis://:YOUR_PASSWORD@localhost:6379
```
