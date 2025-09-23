# Руководство по миграциям базы данных

## Что такое миграции?

Миграции базы данных — это способ управления изменениями в структуре базы данных (схеме) в контролируемом и версионном виде. Они позволяют:

- **Отслеживать изменения** в структуре БД во времени
- **Применять изменения** на разных окружениях (dev, staging, production)
- **Откатывать изменения** при необходимости
- **Синхронизировать схему БД** между разработчиками
- **Автоматизировать** процесс обновления структуры БД

В нашем проекте используется **Alembic** — инструмент для миграций SQLAlchemy/SQLModel.

## Когда выполнять миграции?

### Обязательно выполнять миграции после:

1. **Изменения в моделях SQLModel** (`app/models.py`)
   - Добавление новых полей
   - Изменение типов полей
   - Добавление/удаление индексов
   - Изменение ограничений (constraints)

2. **Создания новых таблиц**
3. **Удаления таблиц или полей**
4. **Изменения связей между таблицами**

### Примеры изменений, требующих миграции:

```python
# Было:
class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

# Стало (добавили поле price):
class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    price: float  # ← НОВОЕ ПОЛЕ - нужна миграция!
```

## Порядок действий при работе с миграциями

### 1. Внесение изменений в код
Сначала измените модель в `app/models.py`

### 2. Создание миграции
Создайте файл миграции с автогенерацией изменений

### 3. Проверка миграции
Проверьте сгенерированный файл миграции

### 4. Применение миграции
Примените миграцию к базе данных

### 5. Проверка результата
Убедитесь, что изменения применились корректно

## Команды терминала

### Переход в директорию проекта
```bash
cd /Users/sergeyshorin/Documents/development/X5Case/backend
```

### 1. Создание новой миграции

**Команда:**
```bash
docker-compose run --rm \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=ner_db \
  search_service alembic revision --autogenerate -m "Описание изменений"
```

**Описание:**
- `--autogenerate` - автоматически определяет изменения в моделях
- `-m "Описание изменений"` - описание того, что делает миграция
- Создает новый файл в `search_service/alembic/versions/`

**Пример:**
```bash
docker-compose run --rm \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=ner_db \
  search_service alembic revision --autogenerate -m "Add price field to Product table"
```

### 2. Применение миграций

**Команда:**
```bash
docker-compose run --rm \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=ner_db \
  search_service alembic upgrade head
```

**Описание:**
- `upgrade head` - применяет все неприменённые миграции до последней версии
- Изменяет структуру базы данных согласно миграциям

### 3. Откат миграций

**Откат на одну миграцию назад:**
```bash
docker-compose run --rm \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=ner_db \
  search_service alembic downgrade -1
```

**Откат до конкретной миграции:**
```bash
docker-compose run --rm \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=ner_db \
  search_service alembic downgrade <revision_id>
```

**Полный откат всех миграций:**
```bash
docker-compose run --rm \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=ner_db \
  search_service alembic downgrade base
```

### 4. Просмотр истории миграций

**Показать все миграции:**
```bash
docker-compose run --rm \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=ner_db \
  search_service alembic history
```

**Показать текущее состояние:**
```bash
docker-compose run --rm \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=ner_db \
  search_service alembic current
```

### 5. Проверка статуса миграций

**Показать какие миграции нужно применить:**
```bash
docker-compose run --rm \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=ner_db \
  search_service alembic show head
```

## Типичный рабочий процесс

### При разработке новой функции:

1. **Измените модель** в `app/models.py`
2. **Создайте миграцию:**
   ```bash
   docker-compose run --rm \
     -e POSTGRES_USER=myuser \
     -e POSTGRES_PASSWORD=mypassword \
     -e POSTGRES_DB=ner_db \
     search_service alembic revision --autogenerate -m "Add new feature"
   ```
3. **Проверьте файл миграции** в `search_service/alembic/versions/`
4. **Примените миграцию:**
   ```bash
   docker-compose run --rm \
     -e POSTGRES_USER=myuser \
     -e POSTGRES_PASSWORD=mypassword \
     -e POSTGRES_DB=ner_db \
     search_service alembic upgrade head
   ```

### При развертывании на production:

1. **Остановите приложение**
2. **Примените миграции:**
   ```bash
   docker-compose run --rm \
     -e POSTGRES_USER=myuser \
     -e POSTGRES_PASSWORD=mypassword \
     -e POSTGRES_DB=ner_db \
     search_service alembic upgrade head
   ```
3. **Запустите приложение**

## Важные замечания

### ⚠️ Безопасность
- **Всегда делайте бэкап** базы данных перед применением миграций на production
- **Тестируйте миграции** на копии production данных

### ⚠️ Совместная работа
- **Не редактируйте** уже применённые миграции
- **Создавайте новые миграции** вместо изменения существующих
- **Синхронизируйтесь** с командой перед применением миграций

### ⚠️ Порядок выполнения
- **Всегда применяйте миграции** в том же порядке, в котором они созданы
- **Не пропускайте** миграции при применении

## Структура файлов миграций

```
search_service/
├── alembic/
│   ├── versions/
│   │   ├── 101034c2460a_create_product_table.py  # Файл миграции
│   │   └── ...
│   ├── env.py                                     # Конфигурация Alembic
│   └── script.py.mako                            # Шаблон для новых миграций
├── alembic.ini                                   # Основная конфигурация
└── app/
    └── models.py                                 # Модели SQLModel
```

## Устранение проблем

### Ошибка "password authentication failed"
Убедитесь, что используете правильные учетные данные из `.env` файла:
- `POSTGRES_USER=myuser`
- `POSTGRES_PASSWORD=mypassword`
- `POSTGRES_DB=ner_db`

### Ошибка "sqlmodel is not defined"
Добавьте импорт в файл миграции:
```python
import sqlmodel
```

### Ошибка подключения к БД
Убедитесь, что контейнер с базой данных запущен:
```bash
docker-compose up -d db
```
