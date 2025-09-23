# Краткое руководство по работе с БД

## Запуск базы данных
```bash
cd /Users/sergeyshorin/Documents/development/X5Case/backend
docker-compose up -d db
```

## Заполнение тестовыми данными
```bash
cd /Users/sergeyshorin/Documents/development/X5Case/backend
docker-compose run --rm \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=ner_db \
  -e PYTHONPATH=/app \
  search_service python scripts/seed.py
```

## Подключение к базе данных
```bash
cd /Users/sergeyshorin/Documents/development/X5Case/backend
docker-compose exec db psql -U myuser -d ner_db
```

## Просмотр товаров
```bash
docker run --rm --network host -e PGPASSWORD=mypassword postgres:15-alpine psql -h localhost -p 5433 -U myuser -d ner_db -c "SELECT id, name, price, category, in_stock FROM product;"
```

## Просмотр всех таблиц
```bash
docker run --rm --network host -e PGPASSWORD=mypassword postgres:15-alpine psql -h localhost -p 5433 -U myuser -d ner_db -c "\dt"
```

## Просмотр пользователей
```bash
docker run --rm --network host -e PGPASSWORD=mypassword postgres:15-alpine psql -h localhost -p 5433 -U myuser -d ner_db -c "\du"
```

## Применение миграций
```bash
cd /Users/sergeyshorin/Documents/development/X5Case/backend
docker-compose run --rm \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=ner_db \
  search_service alembic upgrade head
```

## Создание новой миграции
```bash
cd /Users/sergeyshorin/Documents/development/X5Case/backend
docker-compose run --rm \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=ner_db \
  search_service alembic revision --autogenerate -m "Описание изменений"
```

## Параметры для DBeaver
- **Host:** `localhost`
- **Port:** `5433`
- **Database:** `ner_db`
- **Username:** `myuser`
- **Password:** `mypassword`
