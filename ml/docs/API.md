## Описание API
### Формат JSON запроса и ответа

**Входящий JSON от frontend на backend:**

```json
{
  "input": "абрикосы 500г global village"
}
```

**Ответ JSON от ML-модели на backend:**

```json
{
  "input": "абрикосы 500г global village",
  "entities": [
    {"start_index": 0, "end_index": 8, "entity": "B-TYPE"},
    {"start_index": 9, "end_index": 13, "entity": "B-VOLUME"},
    {"start_index": 14, "end_index": 20, "entity": "B-BRAND"},
    {"start_index": 21, "end_index": 28, "entity": "I-BRAND"}
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
  "input": "user input string"
}
```

- **Ответ:**

```json
{
  "input": "user input string",
  "entities": [
    {"start_index": 0, "end_index": 7, "entity": "B-TYPE"}
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

- **start_index** — индекс начала сущности в строке.
- **end_index** — индекс конца.
- **entity** — тип сущности, например, 'B-TYPE', 'B-BRAND', 'B-VOLUME', 'B-PERCENT'.

***

### Пример запроса и ответа

**Запрос:**

```json
{
  "input": "сыр Hochland 100г 45%"
}
```

**Ответ:**

```json
{
  "input": "сыр Hochland 100г 45%",
  "entities": [
    {"start_index": 0, "end_index": 3, "entity": "B-TYPE"},
    {"start_index": 4, "end_index": 12, "entity": "B-BRAND"},
    {"start_index": 13, "end_index": 17, "entity": "B-VOLUME"},
    {"start_index": 18, "end_index": 21, "entity": "B-PERCENT"}
  ]
}
```
