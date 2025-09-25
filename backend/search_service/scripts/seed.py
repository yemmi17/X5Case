import json
from sqlmodel import Session
from app.database import engine
from app.models import Product

# Примерные данные для наполнения
PRODUCTS_DATA = [
    {
        "name": "Молоко 'Домик в деревне' 3.2%",
        "price": 89.90,
        "image_url": "https://cdn0.youla.io/files/images/780_780/64/3c/643c448f6879290e145898cd-1.jpg",
        "rating": 4.8,
        "reviews_count": 1250,
        "category": "молочные продукты",
        "in_stock": True,
    },
    {
        "name": "Хлеб 'Бородинский'",
        "price": 45.50,
        "image_url": "https://i.pinimg.com/originals/a3/84/c5/a384c573ede31a44f13f259ab60f9b92.png",
        "rating": 4.9,
        "reviews_count": 980,
        "category": "хлебобулочные изделия",
        "in_stock": True,
    },
    {
        "name": "Сыр 'Российский' 50%",
        "price": 250.00,
        "old_price": 280.00,
        "image_url": "https://s56442.cdn.ngenix.net/img/0/0/resize/rshb/agrolife/c/h/cheese-wood.jpg",
        "rating": 4.7,
        "reviews_count": 760,
        "category": "молочные продукты",
        "in_stock": False,
    },
    {
        "name": "Яблоки 'Гренни Смит', 1кг",
        "price": 120.00,
        "image_url": "https://cdn.metro-cc.ru/ru/ru_pim_416648002001_01.png",
        "rating": 4.6,
        "reviews_count": 540,
        "category": "фрукты",
        "in_stock": True,
    }
]

def seed_data():
    print("Начинаем наполнение базы данных тестовыми товарами...")
    with Session(engine) as session:
        # Проверяем, есть ли уже товары, чтобы не создавать дубликаты
        result = session.query(Product).first()
        if result is not None:
            print("База данных уже содержит товары. Наполнение не требуется.")
            return

        for product_data in PRODUCTS_DATA:
            product = Product.model_validate(product_data)
            session.add(product)
        
        session.commit()
        print("Тестовые данные успешно добавлены!")

if __name__ == "__main__":
    seed_data()
