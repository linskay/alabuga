# API Tests Documentation

## User Mission Management

### Delete User Mission
**Endpoint:** `DELETE /api/users/{userId}/missions/{missionId}`  
**Description:** Удалить миссию у пользователя (только для админов)  
**Parameters:**
- `userId` (path) - ID пользователя
- `missionId` (path) - ID миссии

**Response:**
- `200 OK` - Миссия успешно удалена
- `404 Not Found` - Пользователь или миссия не найдены
- `403 Forbidden` - Доступ запрещен (только для админов)

**Example:**
```bash
curl -X DELETE "http://localhost:8080/api/users/1/missions/5" \
  -H "Authorization: Bearer <admin-token>"
```

**Response:**
```json
HTTP/1.1 200 OK
```

### Complete User Mission
**Endpoint:** `POST /api/missions/complete`  
**Description:** Завершить миссию пользователя  
**Parameters:**
- `userId` (query) - ID пользователя
- `missionId` (query) - ID миссии

**Response:**
- `200 OK` - Миссия успешно завершена
- `404 Not Found` - Прогресс миссии не найден
- `400 Bad Request` - Миссия уже завершена или требует модерации

**Example:**
```bash
curl -X POST "http://localhost:8080/api/missions/complete?userId=1&missionId=5" \
  -H "Authorization: Bearer <admin-token>"
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "missionId": 5,
  "missionName": "Исследование космоса",
  "status": "COMPLETED",
  "progress": 100,
  "completedAt": "2024-01-15T10:30:00"
}
```

### Get User Missions
**Endpoint:** `GET /api/missions/user/{userId}`  
**Description:** Получить миссии пользователя  
**Parameters:**
- `userId` (path) - ID пользователя

**Response:**
- `200 OK` - Список миссий пользователя

**Example:**
```bash
curl -X GET "http://localhost:8080/api/missions/user/1" \
  -H "Authorization: Bearer <admin-token>"
```

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "missionId": 5,
    "missionName": "Исследование космоса",
    "status": "IN_PROGRESS",
    "progress": 75,
    "startedAt": "2024-01-10T09:00:00",
    "completedAt": null
  }
]
```

## Mission Status Values

- `NOT_STARTED` - Миссия не начата
- `IN_PROGRESS` - Миссия в процессе выполнения
- `COMPLETED` - Миссия завершена
- `FAILED` - Миссия провалена

## Frontend Integration

### Admin Panel Features

1. **User Mission Management**
   - Просмотр всех миссий пользователя
   - Отметка миссий как выполненных
   - Удаление миссий у пользователей
   - Отображение статусов: Выполнено, Активные, Доступно

2. **Mission Status Display**
   - Зеленый бейдж для выполненных миссий
   - Желтый бейдж для активных миссий
   - Синий бейдж для доступных миссий
   - Кнопки действий в зависимости от статуса

3. **Confirmation Modals**
   - Подтверждение выполнения миссии
   - Показ названия миссии в подтверждении
   - Информация о наградах

## Security Notes

- Все операции с миссиями пользователей доступны только администраторам
- Проверка существования пользователя и миссии
- Валидация прав доступа
- Логирование всех операций