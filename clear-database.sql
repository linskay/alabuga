-- ====================================
-- ОЧИСТКА БАЗЫ ДАННЫХ ДЛЯ РАЗРАБОТКИ
-- ====================================
-- Этот скрипт полностью очищает базу данных для чистой миграции Liquibase
-- Используйте: docker exec -i alabuga-postgres psql -U alabuga -d alabuga_dev < clear-database.sql

-- Удаляем все таблицы, индексы, функции и т.д.
DROP SCHEMA public CASCADE;

-- Создаем чистую схему
CREATE SCHEMA public;

-- Предоставляем права пользователю alabuga
GRANT ALL ON SCHEMA public TO alabuga;
GRANT ALL ON SCHEMA public TO public;
