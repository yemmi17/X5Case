## Начало работы
0) установить uv
1) `cd ml`
2) `uv sync --group dev`
3) для входа в venv команда `.venv\Scripts\activate` или выбрать в vscode при запуске

## Training
### configs
Для Quickstart обучения spacy нужны конфиг файлы.
Пока только обучение с нуля.
- config_cpu.cfg - базовая модель для CPU
- config_gpu.cfg - трансформер для GPU

### Запуск
Для запуска обучения:
- на gpu команда `uv run spacy train configs/config_gpu.cfg --gpu-id 0 --output ./models`
- на cpu `uv run spacy train configs/config_cpu.cfg --output ./models`
Остальное [тут](https://spacy.io/usage/training)

## Preprocessing
Обеспечивается командой `uv run scripts\preprocessing.py` и `uv run scripts\data_augmentation.py`

---

## Описание API
тут -> `ml\docs\API.md`