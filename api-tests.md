# API Tests - Alabuga Backend

## Базовый URL
```
http://localhost:8080
```

## 1. Пользователи (Users)

### Получить всех пользователей
```bash
curl -X GET "http://localhost:8080/api/users" \
  -H "Content-Type: application/json"
```

### Получить пользователя по ID
```bash
curl -X GET "http://localhost:8080/api/users/1" \
  -H "Content-Type: application/json"
```

### Создать пользователя
```bash
curl -X POST "http://localhost:8080/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "login": "testuser",
    "email": "test@alabuga.com",
    "password": "password123",
    "firstName": "Тест",
    "lastName": "Пользователь",
    "role": "USER",
    "experience": 0,
    "energy": 100,
    "rank": 0
  }'
```

### Обновить пользователя
```bash
curl -X PUT "http://localhost:8080/api/users/1" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Обновленное",
    "lastName": "Имя",
    "experience": 1000
  }'
```

### Удалить пользователя
```bash
curl -X DELETE "http://localhost:8080/api/users/1" \
  -H "Content-Type: application/json"
```

### Добавить Энергоны пользователю
```bash
curl -X POST "http://localhost:8080/api/users/1/energy?energy=50" \
  -H "Content-Type: application/json"
```

### Потратить Энергоны пользователя
```bash
curl -X POST "http://localhost:8080/api/users/1/energy/spend?energy=25" \
  -H "Content-Type: application/json"
```

## 2. Компетенции (Competencies)

### Получить все компетенции
```bash
curl -X GET "http://localhost:8080/api/competencies" \
  -H "Content-Type: application/json"
```

### Получить компетенцию по ID
```bash
curl -X GET "http://localhost:8080/api/competencies/1" \
  -H "Content-Type: application/json"
```

### Создать компетенцию
```bash
curl -X POST "http://localhost:8080/api/competencies" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новая Компетенция",
    "shortDescription": "Краткое описание",
    "description": "Полное описание компетенции"
  }'
```

### Обновить компетенцию
```bash
curl -X PUT "http://localhost:8080/api/competencies/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Обновленная Компетенция",
    "description": "Обновленное описание"
  }'
```

### Удалить компетенцию
```bash
curl -X DELETE "http://localhost:8080/api/competencies/1" \
  -H "Content-Type: application/json"
```

## 3. Компетенции пользователей (User Competencies)

### Получить компетенции пользователя
```bash
curl -X GET "http://localhost:8080/api/users/1/competencies" \
  -H "Content-Type: application/json"
```

### Добавить очки опыта к компетенции
```bash
curl -X POST "http://localhost:8080/api/users/1/competencies/1/experience?points=100" \
  -H "Content-Type: application/json"
```

## 4. Артефакты (Artifacts)

### Получить все артефакты
```bash
curl -X GET "http://localhost:8080/api/artifacts" \
  -H "Content-Type: application/json"
```

### Получить артефакт по ID
```bash
curl -X GET "http://localhost:8080/api/artifacts/1" \
  -H "Content-Type: application/json"
```

### Создать артефакт
```bash
curl -X POST "http://localhost:8080/api/artifacts" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новый Артефакт",
    "shortDescription": "Краткое описание",
    "rarity": "RARE",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

### Обновить артефакт
```bash
curl -X PUT "http://localhost:8080/api/artifacts/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Обновленный Артефакт",
    "rarity": "EPIC"
  }'
```

### Удалить артефакт
```bash
curl -X DELETE "http://localhost:8080/api/artifacts/1" \
  -H "Content-Type: application/json"
```

## 5. Артефакты пользователей (User Artifacts)

### Получить артефакты пользователя
```bash
curl -X GET "http://localhost:8080/api/users/1/artifacts" \
  -H "Content-Type: application/json"
```

### Назначить артефакт пользователю
```bash
curl -X POST "http://localhost:8080/api/users/1/artifacts/1" \
  -H "Content-Type: application/json"
```

### Экипировать/снять артефакт
```bash
curl -X PUT "http://localhost:8080/api/users/1/artifacts/1/equip" \
  -H "Content-Type: application/json"
```

## 6. Ветки миссий (Mission Branches)

### Получить все ветки
```bash
curl -X GET "http://localhost:8080/api/branches" \
  -H "Content-Type: application/json"
```

### Получить ветку по ID
```bash
curl -X GET "http://localhost:8080/api/branches/1" \
  -H "Content-Type: application/json"
```

### Поиск веток по названию
```bash
curl -X GET "http://localhost:8080/api/branches/search?name=Лунная" \
  -H "Content-Type: application/json"
```

## 7. Миссии (Missions)

### Получить все миссии
```bash
curl -X GET "http://localhost:8080/api/missions" \
  -H "Content-Type: application/json"
```

### Получить миссию по ID
```bash
curl -X GET "http://localhost:8080/api/missions/1" \
  -H "Content-Type: application/json"
```

### Создать миссию
```bash
curl -X POST "http://localhost:8080/api/missions" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новая Миссия",
    "description": "Описание миссии",
    "branchId": 1,
    "type": "QUEST",
    "difficulty": "EASY",
    "experienceReward": 100,
    "energyReward": 50,
    "requiredCompetencies": "navigation,engineering",
    "isActive": true,
    "requiresModeration": false
  }'
```

### Обновить миссию
```bash
curl -X PUT "http://localhost:8080/api/missions/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Обновленная Миссия",
    "difficulty": "MEDIUM"
  }'
```

### Удалить миссию
```bash
curl -X DELETE "http://localhost:8080/api/missions/1" \
  -H "Content-Type: application/json"
```

### Поиск миссий по названию
```bash
curl -X GET "http://localhost:8080/api/missions/search?name=навигация" \
  -H "Content-Type: application/json"
```

### Получить миссии по ветке
```bash
curl -X GET "http://localhost:8080/api/missions/branch/1" \
  -H "Content-Type: application/json"
```

## 8. Миссии пользователей (User Missions)

### Получить миссии пользователя
```bash
curl -X GET "http://localhost:8080/api/users/1/missions" \
  -H "Content-Type: application/json"
```

### Начать миссию
```bash
curl -X POST "http://localhost:8080/api/users/1/missions/1/start" \
  -H "Content-Type: application/json"
```

### Обновить прогресс миссии
```bash
curl -X PUT "http://localhost:8080/api/users/1/missions/1/progress?progress=50" \
  -H "Content-Type: application/json"
```

### Завершить миссию
```bash
curl -X POST "http://localhost:8080/api/users/1/missions/1/complete" \
  -H "Content-Type: application/json"
```

### Отменить миссию
```bash
curl -X POST "http://localhost:8080/api/users/1/missions/1/cancel" \
  -H "Content-Type: application/json"
```

## 9. Магазин Нексус (Shop)

### Получить все товары магазина
```bash
curl -X GET "http://localhost:8080/api/shop" \
  -H "Content-Type: application/json"
```

### Получить доступные товары
```bash
curl -X GET "http://localhost:8080/api/shop/available" \
  -H "Content-Type: application/json"
```

### Получить товар по ID
```bash
curl -X GET "http://localhost:8080/api/shop/1" \
  -H "Content-Type: application/json"
```

### Поиск товаров по названию
```bash
curl -X GET "http://localhost:8080/api/shop/search?name=Чертеж" \
  -H "Content-Type: application/json"
```

### Создать товар (только для админов)
```bash
curl -X POST "http://localhost:8080/api/shop" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новый Товар",
    "description": "Описание товара",
    "price": 500,
    "imageUrl": "https://example.com/image.jpg",
    "isActive": true,
    "stockQuantity": 10
  }'
```

### Обновить товар (только для админов)
```bash
curl -X PUT "http://localhost:8080/api/shop/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Обновленный Товар",
    "price": 600
  }'
```

### Удалить товар (только для админов)
```bash
curl -X DELETE "http://localhost:8080/api/shop/1" \
  -H "Content-Type: application/json"
```

### Переключить статус товара (только для админов)
```bash
curl -X POST "http://localhost:8080/api/shop/1/toggle-status" \
  -H "Content-Type: application/json"
```

### Купить товар в Нексусе
```bash
curl -X POST "http://localhost:8080/api/shop/purchase?userId=1&shopItemId=1" \
  -H "Content-Type: application/json"
```

## 10. Система Рангов (Ranks)

### Получить все ранги
```bash
curl -X GET "http://localhost:8080/api/ranks" \
  -H "Content-Type: application/json"
```

### Получить ранги по ветке
```bash
curl -X GET "http://localhost:8080/api/ranks/branch/ANALYTICAL_TECHNICAL" \
  -H "Content-Type: application/json"
```

### Получить ранг по уровню
```bash
curl -X GET "http://localhost:8080/api/ranks/level/1" \
  -H "Content-Type: application/json"
```

### Получить все требования рангов
```bash
curl -X GET "http://localhost:8080/api/ranks/requirements" \
  -H "Content-Type: application/json"
```

### Получить активные требования
```bash
curl -X GET "http://localhost:8080/api/ranks/requirements/active" \
  -H "Content-Type: application/json"
```

### Получить требования ранга по уровню
```bash
curl -X GET "http://localhost:8080/api/ranks/requirements/level/1" \
  -H "Content-Type: application/json"
```

### Создать требования ранга
```bash
curl -X POST "http://localhost:8080/api/ranks/requirements" \
  -H "Content-Type: application/json" \
  -d '{
    "rankLevel": 1,
    "requiredExperience": 500,
    "requiredMissionName": "Тестовая миссия",
    "requiredCompetencyPoints": 100,
    "competencyNames": "[\"navigation\", \"engineering\"]",
    "isActive": true,
    "description": "Требования для получения ранга"
  }'
```

### Обновить требования ранга
```bash
curl -X PUT "http://localhost:8080/api/ranks/requirements/1" \
  -H "Content-Type: application/json" \
  -d '{
    "requiredExperience": 600,
    "description": "Обновленные требования"
  }'
```

### Удалить требования ранга
```bash
curl -X DELETE "http://localhost:8080/api/ranks/requirements/1" \
  -H "Content-Type: application/json"
```

### Повысить пользователя до следующего ранга
```bash
curl -X POST "http://localhost:8080/api/ranks/promote?userId=1" \
  -H "Content-Type: application/json"
```

### Проверить, может ли пользователь быть повышен
```bash
curl -X GET "http://localhost:8080/api/ranks/can-promote?userId=1" \
  -H "Content-Type: application/json"
```

## 11. Swagger UI

### Открыть Swagger UI в браузере
```
http://localhost:8080/swagger-ui.html
```

## 12. Тестовые данные

### Проверить создание тестовых данных
```bash
# Пользователи
curl -X GET "http://localhost:8080/api/users" | jq '.[0]'

# Компетенции
curl -X GET "http://localhost:8080/api/competencies" | jq '.[0]'

# Артефакты
curl -X GET "http://localhost:8080/api/artifacts" | jq '.[0]'

# Миссии
curl -X GET "http://localhost:8080/api/missions" | jq '.[0]'

# Товары магазина
curl -X GET "http://localhost:8080/api/shop" | jq '.[0]'

# Ранги
curl -X GET "http://localhost:8080/api/ranks" | jq '.[0]'
```

## Примечания

1. **Аутентификация**: В текущей версии аутентификация не реализована, все endpoints доступны без токенов
2. **Роли**: Некоторые операции помечены как "только для админов", но проверка ролей не реализована
3. **Валидация**: Все DTO содержат валидацию полей
4. **Ошибки**: При ошибках возвращается JSON с описанием проблемы
5. **Формат дат**: Все даты в формате ISO 8601 (например: 2025-09-20T16:39:11.463696)

## Примеры ответов

### Успешный ответ (200 OK)
```json
{
  "id": 1,
  "login": "commander",
  "email": "commander@alabuga.com",
  "firstName": "Командир",
  "lastName": "Звёздного Флота",
  "role": "HR",
  "experience": 5000,
  "energy": 200,
  "rank": 1,
  "createdAt": "2025-09-20T16:39:11.463696",
  "updatedAt": "2025-09-20T16:39:11.463696",
  "isActive": true
}
```

### Ошибка (404 Not Found)
```json
{
  "timestamp": "2025-09-20T16:39:11.463696",
  "status": 404,
  "error": "Not Found",
  "message": "Пользователь с ID 999 не найден",
  "path": "/api/users/999"
}
```

### Ошибка валидации (400 Bad Request)
```json
{
  "timestamp": "2025-09-20T16:39:11.463696",
  "status": 400,
  "error": "Bad Request",
  "message": "Название товара не может быть пустым",
  "path": "/api/shop"
}
```
