# Начало работы
0) установить uv
1) `uv sync`
2) для входа в venv команда `.venv\Scripts\activate` или выбрать в vscode при запуске
3) установить модель `python -m spacy download ru_core_news_sm`

# Работа с образом
1) Сборка образа и запуск контейнера:
    - Linux: `./run.sh`
    - Windows: `./run.ps1`
2) Запуск образа `docker run -it --gpus all --rm ml /bin/bash`
3) Пересборка образа `docker build -t ml .`

# Описание файлов
test.ipynb - тестирование модели

---

## Описание API
### Формат JSON запроса и ответа

**Входящий JSON от frontend на backend:**

```json
{
  "query": "абрикосы 500г global village"
}
```

**Ответ JSON от ML-модели на backend:**

```json
{
  "input": "абрикосы 500г global village",
  "entities": [
    {"start": 0, "end": 8, "label": "B-TYPE", "text": "абрикосы"},
    {"start": 9, "end": 13, "label": "B-VOLUME", "text": "500г"},
    {"start": 14, "end": 20, "label": "B-BRAND", "text": "global"},
    {"start": 21, "end": 28, "label": "I-BRAND", "text": "village"}
  ]
}
```


### Логика запросов и маршруты

#### Получение сущностей из строки (POST)

- **Route:** `/parse`
- **Описание:**
Принимает строку запроса пользователя. Запрос пересылается ML модели, которая отвечает разобранным массивом сущностей. Backend сразу возвращает этот ответ пользователю.
- **Тип запроса:** POST
- **Тело запроса:**

```json
{
  "query": "user input string"
}
```

- **Ответ:**

```json
{
  "input": "user input string",
  "entities": [
    {"start": 0, "end": 7, "label": "B-TYPE", "text": "авокадо"}
  ]
}
```

***

### Общая схема работы

1. Отправляется текстовый запрос на backend.
2. Backend делает POST `/parse` на ml.
3. ML модель возвращает JSON с entities.
4. Backend возвращает этот же JSON пользователю.

***

### Структура json для сущностей

Каждая сущность в entities содержит:

- **start** — индекс начала сущности в строке.
- **end** — индекс конца.
- **label** — тип сущности, например, 'B-TYPE', 'B-BRAND', 'B-VOLUME', 'B-PERCENT'.
- **text** — сам фрагмент текста, попавший под эту сущность.

***

### Пример запроса и ответа

**Запрос:**

```json
{
  "query": "сыр Hochland 100г 45%"
}
```

**Ответ:**

```json
{
  "input": "сыр Hochland 100г 45%",
  "entities": [
    {"start": 0, "end": 3, "label": "B-TYPE", "text": "сыр"},
    {"start": 4, "end": 12, "label": "B-BRAND", "text": "Hochland"},
    {"start": 13, "end": 17, "label": "B-VOLUME", "text": "100г"},
    {"start": 18, "end": 21, "label": "B-PERCENT", "text": "45%"}
  ]
}
```
