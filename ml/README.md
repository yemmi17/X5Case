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