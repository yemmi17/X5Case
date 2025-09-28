from typing import List, Dict

def parse_ner_response(ner_data: List[Dict], text: str) -> Dict[str, str]:
    """Преобразует BIO-разметку в словарь сущностей."""
    entities = {}
    current_entity_type = None
    current_entity_value = ""

    # Группируем B- и I- теги
    for item in ner_data:
        entity_type = item['entity'].split('-')[-1] # BRAND, TYPE, VOLUME, etc.
        value = text[item['start_index']:item['end_index']]

        if item['entity'].startswith('B-'):
            # Сохраняем предыдущую сущность, если она была
            if current_entity_type:
                entities[current_entity_type.lower()] = current_entity_value.strip()
            # Начинаем новую сущность
            current_entity_type = entity_type
            current_entity_value = value
        elif item['entity'].startswith('I-'):
            # Если это продолжение текущей сущности
            if current_entity_type == entity_type:
                current_entity_value += " " + value
            else:
                # Если тип изменился, сохраняем предыдущую и начинаем новую
                if current_entity_type:
                    entities[current_entity_type.lower()] = current_entity_value.strip()
                current_entity_type = entity_type
                current_entity_value = value

    # Сохраняем последнюю сущность
    if current_entity_type:
        entities[current_entity_type.lower()] = current_entity_value.strip()

    return entities