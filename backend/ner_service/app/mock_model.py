# имитация работы модели, синхронная, чтобы имитировать CPU-bound операции

import time

# Имитируем, что модель "думает" 100 мс
# Это важно для тестирования асинхронной обработки
INFERENCE_DELAY_SECONDS = 0.1 

def extract_entities_mock(text: str) -> list:
    """
    Синхронная функция, имитирующая работу ML-модели.
    """
    # Здесь могла бы быть сложная логика на регулярных выражениях
    # или поиске по словарю.

    time.sleep(INFERENCE_DELAY_SECONDS) # Искусственная задержка

    if "сгущенное молоко" in text:
        return [
            {"start_index": 0, "end_index": 8, "entity": "B-TYPE"},
            {"start_index": 9, "end_index": 15, "entity": "I-TYPE"}
        ]
    if "кола 2л" in text:
         return [
            {"start_index": 0, "end_index": 3, "entity": "B-BRAND"},
            {"start_index": 5, "end_index": 6, "entity": "B-VOLUME"}
        ]
    return []