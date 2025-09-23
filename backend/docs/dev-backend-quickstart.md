## Быстрый старт: запуск backend (dev) через docker-compose.dev.yml

Короткая инструкция для фронтенд‑разработчика, как поднять весь backend локально в dev‑режиме.

### Предварительные требования
- Установлены Docker и Docker Compose
- Порты не заняты локально: 8000 (api_gateway), 8001 (ner_service mock), 8002 (search_service), 5433 (PostgreSQL)

### 1) Перейти в каталог backend
```bash
cd /Users/sergeyshorin/Documents/development/X5Case/backend
```

### 2) Создать .env (один раз)
Создайте файл `backend/.env` со значениями ниже. Эти переменные нужны контейнерам.
```bash
cat > .env << 'EOF'
# PostgreSQL Config
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=ner_db
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}"

# Service URLs (для API Gateway)
SEARCH_SERVICE_URL="http://search_service:8002"
NER_SERVICE_URL="http://ner_service:8001"
EOF
```

Примечание: некоторые окружения не подставляют переменные внутри значений из `env_file`. Если в контейнере `DATABASE_URL` не разворачивается, пропишите его явно:
```bash
DATABASE_URL=postgresql://myuser:mypassword@db:5432/ner_db
```

### 3) Запустить контейнеры (dev)
```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Сервисы:
- api_gateway: http://localhost:8000 (Swagger: `/docs`)
- ner_service (mock): http://localhost:8001
- search_service: http://localhost:8002
- PostgreSQL: localhost:5433 (внутри сети — `db:5432`)

### 4) Заполнение тестовыми данными
```bash
cd /Users/sergeyshorin/Documents/development/X5Case/backend
docker compose -f docker-compose.dev.yml exec search_service \
  poetry run python -m scripts.seed
```
Альтернатива (если требуется прямой запуск файла):
```bash
docker compose -f docker-compose.dev.yml exec -e PYTHONPATH=/app search_service \
  poetry run python scripts/seed.py
```

### 5) Проверка, логи и остановка
- Проверить gateway: `http://localhost:8000/api/v1/search?q=молоко`
- Логи сервиса: `docker compose -f docker-compose.dev.yml logs -f api_gateway`
- Остановить: `docker compose -f docker-compose.dev.yml down`

### Примечания
- В dev используется заглушка `mock_ner_service` (эндпоинт `/extract_entities`).
- Hot-reload включён за счёт монтирования кода (`volumes`) для `api_gateway`, `search_service`, `mock_ner_service`.

