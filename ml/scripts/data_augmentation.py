
import pandas as pd
import ast
import random
import re
from collections import defaultdict

class DataAugmentor:
    def __init__(self):
        # Словари синонимов для аугментации
        self.type_synonyms = {
            'йогурт': ['йогурты', 'йогурта'],
            'сок': ['соки', 'сока'],
            'хлеб': ['хлеба', 'хлебцы'],
            'молоко': ['молока'],
            'вода': ['воды', 'водичка'],
            'чай': ['чаи', 'чая'],
            'кофе': ['кофе'],
            'печенье': ['печенья', 'печеньки'],
            'конфеты': ['конфета', 'конфетки'],
            'шоколад': ['шоколада', 'шоколадка']
        }

        # Паттерны для нормализации чисел
        self.volume_patterns = [
            (r'(\d+)л', r'\1 литр'),
            (r'(\d+)мл', r'\1 мл'),
            (r'(\d+)г', r'\1 грамм'),
            (r'(\d+)кг', r'\1 кг')
        ]

    def augment_by_synonyms(self, text, entities):
        """Аугментация через синонимы"""
        augmented_samples = []

        for synonym_group in self.type_synonyms.items():
            original_word, synonyms = synonym_group

            if original_word in text.lower():
                for synonym in synonyms:
                    new_text = text.replace(original_word, synonym)
                    # Пересчитываем позиции сущностей
                    new_entities = self.adjust_entity_positions(text, new_text, entities, original_word, synonym)
                    augmented_samples.append((new_text, new_entities))

        return augmented_samples

    def adjust_entity_positions(self, old_text, new_text, entities, old_word, new_word):
        """Корректирует позиции сущностей после замены"""
        new_entities = []
        offset_diff = len(new_word) - len(old_word)
        replacement_pos = old_text.lower().find(old_word.lower())

        for start, end, label in entities:
            new_start, new_end = start, end

            # Если сущность находится после замены
            if start > replacement_pos:
                new_start += offset_diff
                new_end += offset_diff
            # Если сущность пересекается с заменой
            elif start <= replacement_pos < end:
                # Пересчитываем более аккуратно
                if replacement_pos + len(old_word) <= end:
                    new_end += offset_diff

            new_entities.append((new_start, new_end, label))

        return new_entities

    def augment_by_spacing(self, text, entities):
        """Аугментация через изменение пробелов"""
        augmented_samples = []

        # Удаление пробелов в определенных местах
        if ' ' in text:
            # Случайно удаляем один пробел
            spaces = [i for i, char in enumerate(text) if char == ' ']
            if spaces:
                space_to_remove = random.choice(spaces)
                new_text = text[:space_to_remove] + text[space_to_remove+1:]
                new_entities = [(max(0, start-1 if start > space_to_remove else start), 
                               max(0, end-1 if end > space_to_remove else end), label) 
                               for start, end, label in entities]
                augmented_samples.append((new_text, new_entities))

        return augmented_samples

    def normalize_numbers(self, text, entities):
        """Нормализация чисел и единиц измерения"""
        normalized_text = text

        for pattern, replacement in self.volume_patterns:
            normalized_text = re.sub(pattern, replacement, normalized_text)

        # Если текст изменился, пересчитываем позиции
        if normalized_text != text:
            # Упрощенная версия - возвращаем как есть, в реальности нужен более сложный пересчет
            return [(normalized_text, entities)]

        return []

    def augment_rare_classes(self, df, target_ratio=0.1):
        """Увеличивает данные для редких классов"""
        # Подсчитываем частоту классов
        class_counts = defaultdict(int)
        for annotation in df['annotation']:
            try:
                entities = ast.literal_eval(annotation)
                for _, _, label in entities:
                    if label not in ['O', '0']:
                        class_counts[label] += 1
            except:
                continue

        # Определяем редкие классы (менее target_ratio от самого частого)
        max_count = max(class_counts.values())
        target_count = int(max_count * target_ratio)
        rare_classes = [cls for cls, count in class_counts.items() if count < target_count]

        print(f"Редкие классы для аугментации: {rare_classes}")

        augmented_data = []

        for idx, row in df.iterrows():
            try:
                entities = ast.literal_eval(row['annotation'])
                text = row['sample']

                # Проверяем, содержит ли образец редкий класс
                has_rare_class = any(label in rare_classes for _, _, label in entities)

                if has_rare_class:
                    # Применяем аугментацию
                    augmented_samples = []
                    augmented_samples.extend(self.augment_by_synonyms(text, entities))
                    augmented_samples.extend(self.augment_by_spacing(text, entities))
                    augmented_samples.extend(self.normalize_numbers(text, entities))

                    for aug_text, aug_entities in augmented_samples:
                        augmented_data.append({
                            'sample': aug_text,
                            'annotation': str(aug_entities)
                        })

            except Exception as e:
                continue

        return pd.DataFrame(augmented_data)

# Пример использования
if __name__ == "__main__":
    df = pd.read_csv('data/train_cleaned.csv', delimiter=';')

    augmentor = DataAugmentor()
    augmented_df = augmentor.augment_rare_classes(df)

    print(f"Создано {len(augmented_df)} дополнительных примеров для редких классов")

    # Объединяем с исходными данными
    combined_df = pd.concat([df, augmented_df], ignore_index=True)
    combined_df.to_csv('data/train_augmented.csv', index=False, sep=';')

    print(f"Общее количество примеров после аугментации: {len(combined_df)}")
