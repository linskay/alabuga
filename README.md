# Alabuga Project

Полнофункциональное веб-приложение с Spring Boot backend и React frontend.

## Структура проекта

```
alabuga/
├── backend/          # Spring Boot приложение
├── frontend/         # React TypeScript приложение
└── pom.xml          # Multi-module Maven конфигурация
```

## Технологический стек

### Backend
- **Java 17**
- **Spring Boot 3.1.0**
- **Spring Data JPA**
- **Spring Web**
- **Liquibase** - управление миграциями БД
- **H2 Database** - для разработки
- **PostgreSQL** - для продакшена
- **Lombok** - уменьшение boilerplate кода
- **SpringDoc OpenAPI** - документация API
- **Maven** - управление зависимостями

### Frontend
- **React 18.2.0**
- **TypeScript 5.3.3**
- **React Scripts 5.0.1**

## Быстрый старт

### Backend

1. **Установка зависимостей:**
   ```bash
   cd backend
   mvn clean install
   ```

2. **Запуск в режиме разработки:**
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

### Frontend

1. **Установка зависимостей:**
   ```bash
   cd frontend
   npm install
   ```

2. **Запуск в режиме разработки:**
   ```bash
   npm start
   ```

## Профили конфигурации

### Development (dev)
- H2 in-memory база данных
- H2 Console доступна на `/h2-console`
- Подробное логирование
- Liquibase включен

**Запуск:**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Production (prod)
- PostgreSQL база данных
- Валидация схемы БД
- Liquibase включен
- Оптимизированное логирование

**Запуск:**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## API Документация

После запуска приложения:
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8080/api-docs

## База данных

### H2 Console (только dev профиль)
- **URL:** http://localhost:8080/h2-console
- **JDBC URL:** `jdbc:h2:mem:devdb`
- **Username:** `sa`
- **Password:** `password`

### Миграции Liquibase
Миграции находятся в `backend/src/main/resources/db/changelog/`

## Переменные окружения (Production)

```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/alabuga
DATABASE_USERNAME=alabuga
DATABASE_PASSWORD=your_password
```

## Игровая система

### Компетенции
Реализованы 9 космических компетенций с системой прогрессии:

1. **🚀 Сила Миссии** (Вера в дело)
2. **⚡ Импульс Прорыва** (Стремление к большему)
3. **📡 Канал Связи** (Общение)
4. **🔍 Модуль Аналитики** (Аналитика)
5. **🎮 Пульт Командования** (Командование)
6. **⚖️ Кодекс Звёздного Права** (Юриспруденция)
7. **🧠 Голограммное Мышление** (Трёхмерное мышление)
8. **💰 Кредитный Поток** (Базовая экономика)
9. **✈️ Курс Аэронавигации** (Основы аэронавигации)

**Система прогрессии:**
- Каждый пользователь имеет все 9 компетенций
- Очки опыта начисляются от выполнения миссий (0-500 очков)
- Простая система без уровней - только очки опыта

### Артефакты
Система артефактов с различными уровнями редкости и силы для расширения игрового процесса.

## Структура API

### Пользователи
- `GET /api/users` - получить всех пользователей
- `GET /api/users/{id}` - получить пользователя по ID
- `POST /api/users` - создать нового пользователя
- `PUT /api/users/{id}` - обновить пользователя
- `DELETE /api/users/{id}` - удалить пользователя

### Компетенции
- `GET /api/competencies` - получить все компетенции
- `GET /api/users/{id}/competencies` - получить компетенции пользователя
- `POST /api/users/{id}/competencies/{competencyId}/experience` - добавить опыт к компетенции
- `PUT /api/users/{id}/competencies/{competencyId}` - установить очки опыта компетенции

### Артефакты
- `GET /api/artifacts` - получить все артефакты
- `GET /api/users/{id}/artifacts` - получить артефакты пользователя
- `POST /api/users/{id}/artifacts` - добавить артефакт пользователю
- `POST /api/users/{id}/artifacts/{artifactId}/equip` - экипировать артефакт

## Разработка

### Расширение системы

**CRUD операции реализованы для всех сущностей:**
- **Пользователи** - полный CRUD с ролями и статистикой
- **Компетенции** - управление компетенциями и прогрессом пользователей
- **Артефакты** - система артефактов с экипировкой
- **Связи пользователей** - компетенции и артефакты пользователей


### Проблемы с запуском

1. **Проверьте Java версию:**
   ```bash
   java -version  # Должна быть 17+
   ```

2. **Очистите Maven кэш:**
   ```bash
   mvn clean
   ```

3. **Проверьте порты:**
   - Backend: 8080
   - Frontend: 3000

### Проблемы с базой данных

1. **H2 не запускается:** Проверьте профиль (должен быть `dev`)
2. **Liquibase ошибки:** Проверьте changelog файлы
3. **PostgreSQL:** Убедитесь что сервер запущен и доступен
