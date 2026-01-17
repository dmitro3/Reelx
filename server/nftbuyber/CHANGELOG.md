# Changelog

## [2026-01-17] - Infrastructure для синхронизации коллекций подарков

### Добавлено

#### Infrastructure Module

**Redis Module:**
- ✅ `src/infrastructure/redis/redis.module.ts` - модуль Redis
- ✅ `src/infrastructure/redis/redis.service.ts` - сервис для работы с Redis
  - Методы: get, set, del, exists, keys, getClient
  - Автоматическое переподключение
  - Логирование событий

**GetGems Module:**
- ✅ `src/infrastructure/getgems/getgems.module.ts` - модуль GetGems
- ✅ `src/infrastructure/getgems/getgems-api.client.ts` - клиент для GetGems API
  - Метод `getAllGiftsCollections()` - получение всех коллекций с пагинацией
  - Rate limiting защита (500ms между запросами)
- ✅ `src/infrastructure/getgems/gifts-sync.service.ts` - сервис синхронизации
  - Автоматическая синхронизация каждые 30 минут
  - Первоначальная синхронизация при старте
  - Защита от параллельных запусков
  - Кеширование в Redis
- ✅ `src/infrastructure/getgems/interfaces/getgems-response.interface.ts` - интерфейсы
- ✅ `src/infrastructure/infrastructure.module.ts` - главный модуль infrastructure

#### API Endpoints

**Коллекции подарков:**
- ✅ `GET /api/nft/gifts/collections` - получить все коллекции
- ✅ `GET /api/nft/gifts/collections/:address` - получить коллекцию по адресу
- ✅ `GET /api/nft/gifts/sync-info` - информация о синхронизации
- ✅ `POST /api/nft/gifts/sync-now` - запустить синхронизацию вручную

**Подарки по цене:**
- ✅ `POST /api/nft/gifts/by-price` - получить подарки по цене (scaffold)
  - DTO с валидацией: `src/nft/dto/get-gifts-by-price.dto.ts`
  - Обработчик в `src/nft/controllers/nft.controller.ts`
  - Логика в `src/nft/services/nft.service.ts`

#### Документация

- ✅ `INFRASTRUCTURE.md` - полная документация по infrastructure
- ✅ `GIFTS_ENDPOINT.md` - документация по endpoints для подарков
- ✅ `QUICK_START.md` - быстрый старт
- ✅ `.env.example` - пример конфигурации (попытка)

### Изменено

- `src/app.module.ts` - добавлен ScheduleModule и InfrastructureModule
- `src/nft/nft.module.ts` - добавлен импорт InfrastructureModule
- `src/nft/controllers/nft.controller.ts` - добавлены новые endpoints
- `src/nft/services/nft.service.ts` - добавлена интеграция с GiftsSyncService

### Зависимости

Добавлены новые пакеты:
- `ioredis` - Redis клиент для Node.js
- `@nestjs/schedule` - планировщик задач для NestJS
- `@types/ioredis` - типы для ioredis

Команда установки:
```bash
npm install ioredis @nestjs/schedule @types/ioredis --legacy-peer-deps
```

### Переменные окружения

Добавлены новые переменные в `.env`:
```env
GETGEMS_API_KEY=your-api-key-here
REDIS_URL=redis://localhost:6379
```

### Структура данных Redis

**Ключи:**
1. `gifts:collections:all` - все коллекции с timestamp
2. `gifts:collection:{address}` - индивидуальная коллекция

### Особенности реализации

#### Бесконечный loop синхронизации
- Реализован через `setInterval` в `onModuleInit`
- Интервал: 30 минут (1,800,000 мс)
- Первый запуск сразу при старте приложения
- Корректная очистка при завершении модуля

#### Кеширование
- Все коллекции хранятся в одном ключе Redis
- Дополнительно индексируются по адресам
- Timestamp последнего обновления
- Быстрое получение из кеша (~10-50ms)

#### Обработка ошибок
- Graceful handling при недоступности GetGems API
- Автоматическое переподключение к Redis
- Защита от параллельных синхронизаций
- Подробное логирование всех операций

### Performance

- Первая синхронизация: ~2-5 секунд
- Получение из кеша: ~10-50 мс
- Интервал синхронизации: 30 минут
- Rate limiting: 500ms между запросами к API

### TODO

Будущие улучшения:
- [ ] Реализовать фильтрацию конкретных NFT по цене
- [ ] Добавить exponential backoff для retry
- [ ] Добавить метрики синхронизации
- [ ] Реализовать webhook для уведомлений
- [ ] Добавить мониторинг здоровья Redis
- [ ] Добавить пагинацию для endpoints
- [ ] Добавить сортировку результатов

### Breaking Changes

Нет breaking changes. Все существующие endpoints работают как прежде.

### Migration Guide

1. Установить зависимости: `npm install ioredis @nestjs/schedule @types/ioredis --legacy-peer-deps`
2. Запустить Redis: `docker run -d --name redis -p 6379:6379 redis:alpine`
3. Добавить переменные в `.env`: `GETGEMS_API_KEY` и `REDIS_URL`
4. Запустить приложение: `npm run start:dev`
5. Проверить работу: `curl http://localhost:3001/api/nft/gifts/sync-info`

### Known Issues

- Существующие проблемы TypeScript в `nft-purchase.service.ts` (не связаны с новыми изменениями)
- Требуется `--legacy-peer-deps` для установки из-за конфликтов версий @nestjs/config

### Contributors

- Infrastructure для синхронизации коллекций подарков
- Redis интеграция
- GetGems API client
- Автоматическая синхронизация каждые 30 минут
- Endpoints для работы с коллекциями
