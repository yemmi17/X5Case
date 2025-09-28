import sys
import os
from sqlmodel import Session, select
from sqlalchemy.exc import OperationalError

# Добавляем корневую директорию проекта в sys.path
# Это нужно, чтобы скрипт мог импортировать модули из `app`
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import engine
from app.models import Product
from app.schemas import ProductCreate

# --- Список товаров для добавления в базу данных ---
PRODUCTS_TO_SEED = [
    # --- Молочные продукты ---
    ProductCreate(name="Молоко Домик в деревне 3.2%", price=99.9, category="молочные продукты", brand="Домик в деревне", percentage="3.2%", volume="950мл", in_stock=True, image_url="https://www.okeydostavka.ru/wcsstore/OKMarketCAS/cat_entries/1041483/1041483_fullimage.jpg", rating=4.8, reviews_count=120),
    ProductCreate(name="Молоко Простоквашино 2.5%", price=89.5, category="молочные продукты", brand="Простоквашино", percentage="2.5%", volume="930мл", in_stock=True, image_url="https://cdn.metro-cc.ru/ru/ru_pim_186027001001_01.png", rating=4.7, reviews_count=95),
    ProductCreate(name="Кефир Простоквашино 1%", price=79.0, category="молочные продукты", brand="Простоквашино", percentage="1%", volume="930мл", in_stock=True, image_url="https://tornado.shop/images/detailed/19/P1242428.jpg", rating=4.9, reviews_count=88),
    ProductCreate(name="Творог Савушкин 5%", price=120.0, category="молочные продукты", brand="Савушкин", percentage="5%", volume="200г", in_stock=False, image_url="https://app.willesden.by/images/4810268045097.jpg", rating=4.6, reviews_count=54),
    ProductCreate(name="Сметана Домик в деревне 20%", price=110.0, category="молочные продукты", brand="Домик в деревне", percentage="20%", volume="300г", in_stock=True, image_url="https://avatars.mds.yandex.net/i?id=23a0476fe12d386393eef9ac47a78c60_l-10311516-images-thumbs&n=13", rating=4.8, reviews_count=78),

    # --- Напитки ---
    ProductCreate(name="Coca-Cola Classic", price=150.0, category="напитки", brand="Coca-Cola", volume="2л", in_stock=True, image_url="https://vendliga.ru/upload/iblock/7fe/7fe36d6ec85b3fc3a15ddb15a3f69dc7.jpg", rating=5.0, reviews_count=250),
    ProductCreate(name="Coca-Cola Zero", price=150.0, category="напитки", brand="Coca-Cola", volume="1.5л", in_stock=True, image_url="https://dobryanka-rus.ru/storage/goods/234159_c9h2S.jpg", rating=4.9, reviews_count=180),
    ProductCreate(name="Вода Святой Источник негазированная", price=50.0, category="напитки", brand="Святой Источник", volume="5л", in_stock=True, image_url="https://vend-trade.ru/image/cache/catalog/products/1b6a02932ed80ad9c505fd465467655a_5-650x650.jpg", rating=4.5, reviews_count=300),
    ProductCreate(name="Сок J7 яблочный", price=180.0, category="напитки", brand="J7", volume="970мл", in_stock=True, image_url="https://cdn.metro-cc.ru/ru/ru_pim_562945001001_01.png", rating=4.7, reviews_count=110),

    # --- Хлебобулочные изделия ---
    ProductCreate(name="Хлеб Бородинский", price=60.0, category="хлеб", brand="Коломенское", in_stock=True, image_url="https://avatars.mds.yandex.net/get-sprav-products/9240521/2a0000018873bbe0908f8f8bf31afd2cea21/XXL", rating=4.6, reviews_count=150),
    ProductCreate(name="Батон Нарезной", price=55.0, category="хлеб", brand="Черемушки", in_stock=True, image_url="https://tsx.x5static.net/i/800x800-fit/xdelivery/files/b0/45/db931459afda7c975e5b5ec2bfc4.jpg", rating=4.5, reviews_count=130),

    # --- Снэки ---
    ProductCreate(name="Чипсы Lays с солью", price=130.0, category="снэки", brand="Lays", volume="140г", in_stock=True, image_url="https://flomaster.top/uploads/posts/2023-01/1673536958_flomaster-club-p-chipsi-leis-risunok-vkontakte-67.jpg", rating=4.8, reviews_count=220),
    ProductCreate(name="Чипсы Pringles Original", price=250.0, category="снэки", brand="Pringles", volume="165г", in_stock=False, image_url="https://avatars.mds.yandex.net/get-mpic/12351018/2a0000018d88f7b288403e9a715564608aaa/orig", rating=4.9, reviews_count=190),
]

def seed_data():
    print("Начинаем наполнение базы данных...")
    try:
        with Session(engine) as session:
            # --- Очистка старых данных ---
            print("Удаляем старые данные...")
            statement = select(Product)
            results = session.exec(statement).all()
            for product in results:
                session.delete(product)
            session.commit()
            print(f"Удалено {len(results)} товаров.")

            # --- Добавление новых данных ---
            print(f"Добавляем {len(PRODUCTS_TO_SEED)} новых товаров...")
            for product_data in PRODUCTS_TO_SEED:
                product = Product.from_orm(product_data)
                session.add(product)
            
            session.commit()
            print("Данные успешно добавлены!")

    except OperationalError:
        print("Ошибка: Не удалось подключиться к базе данных.")
        print("Пожалуйста, убедитесь, что контейнер с PostgreSQL запущен и работает.")
    except Exception as e:
        print(f"Произошла непредвиденная ошибка: {e}")

if __name__ == "__main__":
    seed_data()