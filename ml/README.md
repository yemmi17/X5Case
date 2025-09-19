# Начало работы
0) установить uv
1) `uv sync`
2) для входа в venv команда `.venv\Scripts\activate` или выбрать в vscode при запуске
3) установить модель `!python -m spacy download ru_core_news_sm`

# Работа с образом
1) Сборка образа и запуск контейнера `./run.sh`
2) Пересборка образа `docker build -t ml .`

# Описание файлов
test.ipynb - тестирование модели