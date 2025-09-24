
import pandas as pd
import ast
import re
from collections import Counter

class DataPreprocessor:
    def __init__(self):
        self.stats = {
            'removed_o_only': 0,
            'removed_short': 0,
            'normalized_text': 0,
            'fixed_annotations': 0
        }

    def clean_text(self, text):
        """Базовая очистка текста"""
        if not isinstance(text, str):
            return ""

        # Удаляем лишние пробелы
        text = re.sub(r'\s+', ' ', text.strip())

        # Приводим к нижнему регистру (осторожно с брендами!)
        # text = text.lower()  # Раскомментируйте если нужно

        return text

    def validate_bio_tags(self, entities):
        """Валидация BIO-разметки"""
        valid_entities = []
        prev_label = 'O'

        for start, end, label in entities:
            # Пропускаем O и 0 метки
            if label in ['O', '0']:
                prev_label = 'O'
                continue

            # Проверяем корректность I-меток
            if label.startswith('I-'):
                expected_b_label = 'B-' + label[2:]
                if prev_label != expected_b_label and not prev_label.startswith('I-' + label[2:]):
                    # I-метка без соответствующей B-метки, конвертируем в B-метку
                    label = expected_b_label
                    self.stats['fixed_annotations'] += 1

            valid_entities.append((start, end, label))
            prev_label = label

        return valid_entities

    def should_remove_sample(self, text, entities):
        """Определяет, нужно ли удалить образец"""
        # Удаляем очень короткие тексты (менее 2 символов)
        if len(text.strip()) < 2:
            self.stats['removed_short'] += 1
            return True

        # Удаляем образцы только с O-метками
        valid_entities = [e for e in entities if e[2] not in ['O', '0']]
        if not valid_entities:
            self.stats['removed_o_only'] += 1
            return True

        return False

    def preprocess_dataset(self, df):
        """Основная функция предобработки"""
        cleaned_data = []

        for idx, row in df.iterrows():
            try:
                text = self.clean_text(row['sample'])
                entities = ast.literal_eval(row['annotation'])

                # Валидируем BIO-метки
                entities = self.validate_bio_tags(entities)

                # Проверяем, нужно ли удалить образец
                if self.should_remove_sample(text, entities):
                    continue

                # Добавляем обратно O-метки для полного покрытия
                if not any(e[2] in ['O', '0'] for e in entities):
                    # Если нет O-меток, добавим их для непокрытых областей
                    entities = self.add_o_tags(text, entities)

                cleaned_data.append({
                    'sample': text,
                    'annotation': str(entities)
                })

                if text != row['sample']:
                    self.stats['normalized_text'] += 1

            except Exception as e:
                print(f"Ошибка в строке {idx}: {e}")
                continue

        return pd.DataFrame(cleaned_data)

    def add_o_tags(self, text, entities):
        """Добавляет O-теги для непокрытых областей"""
        # Сортируем сущности по позиции
        entities = sorted([e for e in entities if e[2] not in ['O', '0']], key=lambda x: x[0])

        result = []
        pos = 0

        for start, end, label in entities:
            # Добавляем O-теги перед текущей сущностью
            if pos < start:
                result.append((pos, start, 'O'))
            result.append((start, end, label))
            pos = end

        # Добавляем O-тег в конце, если нужно
        if pos < len(text):
            result.append((pos, len(text), 'O'))

        return result

    def print_stats(self):
        """Выводит статистику предобработки"""
        print("=== Статистика предобработки ===")
        for key, value in self.stats.items():
            print(f"{key}: {value}")

# Пример использования
if __name__ == "__main__":
    # Загружаем данные
    df = pd.read_csv('data/train.csv', delimiter=';')
    print(f"Исходное количество примеров: {len(df)}")

    # Предобрабатываем
    preprocessor = DataPreprocessor()
    cleaned_df = preprocessor.preprocess_dataset(df)

    print(f"После предобработки: {len(cleaned_df)}")
    preprocessor.print_stats()

    # Сохраняем очищенные данные
    cleaned_df.to_csv('data/train_cleaned.csv', index=False, sep=';')
    print("Очищенные данные сохранены в data/train_cleaned.csv")
