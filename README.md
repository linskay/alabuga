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

## Структура API

### Пользователи
- `GET /api/users` - получить всех пользователей
- `GET /api/users/{id}` - получить пользователя по ID
- `GET /api/users/username/{username}` - получить пользователя по имени
- `POST /api/users` - создать нового пользователя

## Разработка

### Добавление новых сущностей

1. Создайте Entity класс в `backend/src/main/java/com/example/alabuga/entity/`
2. Создайте Repository в `backend/src/main/java/com/example/alabuga/repository/`
3. Создайте Controller в `backend/src/main/java/com/example/alabuga/controller/`
4. Добавьте миграцию Liquibase в `backend/src/main/resources/db/changelog/`

### Лучшие практики

- Используйте Lombok для уменьшения boilerplate кода
- Всегда добавляйте тесты для новых контроллеров
- Используйте профили для разных окружений
- Документируйте API с помощью SpringDoc аннотаций
- Следуйте принципам REST API

## Troubleshooting

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
