export const ProductCategory = {
    DAIRY: 'DAIRY',
    FRUITS_VEGETABLES: 'FRUITS_VEGETABLES',
    MEAT_POULTRY: 'MEAT_POULTRY',
    FISH_SEAFOOD: 'FISH_SEAFOOD',
    GROCERY: 'GROCERY',
    BAKERY: 'BAKERY',
    BEVERAGES: 'BEVERAGES',
    FROZEN: 'FROZEN',
    SWEETS_SNACKS: 'SWEETS_SNACKS'
} as const

export const DairySubCategory = {
    LOW_FAT: 'LOW_FAT',
    MEDIUM_FAT: 'MEDIUM_FAT',
    CLASSIC_FAT: 'CLASSIC_FAT',
    HIGH_FAT: 'HIGH_FAT',
    CHEESE: 'CHEESE',
    MILK: 'MILK',
    YOGURT_DESSERTS: 'YOGURT_DESSERTS',
    EGGS: 'EGGS'
} as const

export const FruitsVegetablesSubCategory = {
    FRUITS: 'FRUITS',
    VEGETABLES: 'VEGETABLES',
    BERRIES: 'BERRIES',
    GREENS_SALADS: 'GREENS_SALADS',
    NUTS_DRIED_FRUITS: 'NUTS_DRIED_FRUITS'
} as const

export const MeatPoultrySubCategory = {
    BEEF: 'BEEF',
    PORK: 'PORK',
    CHICKEN: 'CHICKEN',
    TURKEY: 'TURKEY',
    SAUSAGES: 'SAUSAGES'
} as const

export const FishSeafoodSubCategory = {
    FRESH_FISH: 'FRESH_FISH',
    FROZEN_FISH: 'FROZEN_FISH',
    SEAFOOD: 'SEAFOOD',
    FISH_CANNED: 'FISH_CANNED'
} as const

export const GrocerySubCategory = {
    GRAINS_PASTA: 'GRAINS_PASTA',
    LEGUMES: 'LEGUMES',
    SPICES: 'SPICES',
    SAUCES_CANNED: 'SAUCES_CANNED',
    HONEY_JAM: 'HONEY_JAM'
} as const

export const BeveragesSubCategory = {
    WATER: 'WATER',
    JUICES: 'JUICES',
    COFFEE_TEA: 'COFFEE_TEA',
    SODA: 'SODA',
    ALCOHOL: 'ALCOHOL'
} as const

export type ProductCategory = typeof ProductCategory[keyof typeof ProductCategory]
export type DairySubCategory = typeof DairySubCategory[keyof typeof DairySubCategory]
export type FruitsVegetablesSubCategory = typeof FruitsVegetablesSubCategory[keyof typeof FruitsVegetablesSubCategory]
export type MeatPoultrySubCategory = typeof MeatPoultrySubCategory[keyof typeof MeatPoultrySubCategory]
export type FishSeafoodSubCategory = typeof FishSeafoodSubCategory[keyof typeof FishSeafoodSubCategory]
export type GrocerySubCategory = typeof GrocerySubCategory[keyof typeof GrocerySubCategory]
export type BeveragesSubCategory = typeof BeveragesSubCategory[keyof typeof BeveragesSubCategory]

export const ProductCategoryLabels: Record<ProductCategory, string> = {
    [ ProductCategory.DAIRY ]: 'Молочные продукты',
    [ ProductCategory.FRUITS_VEGETABLES ]: 'Овощи и фрукты',
    [ ProductCategory.MEAT_POULTRY ]: 'Мясо и птица',
    [ ProductCategory.FISH_SEAFOOD ]: 'Рыба и морепродукты',
    [ ProductCategory.GROCERY ]: 'Бакалея',
    [ ProductCategory.BAKERY ]: 'Хлеб и выпечка',
    [ ProductCategory.BEVERAGES ]: 'Напитки',
    [ ProductCategory.FROZEN ]: 'Замороженные продукты',
    [ ProductCategory.SWEETS_SNACKS ]: 'Сладости и снеки'
}

export const DairySubCategoryLabels: Record<DairySubCategory, string> = {
    [ DairySubCategory.LOW_FAT ]: '0.5% - Обезжиренные',
    [ DairySubCategory.MEDIUM_FAT ]: '1.5% - Нежирные',
    [ DairySubCategory.CLASSIC_FAT ]: '2.5% - Классические',
    [ DairySubCategory.HIGH_FAT ]: '3.2% - Жирные',
    [ DairySubCategory.CHEESE ]: 'Сыры',
    [ DairySubCategory.MILK ]: 'Молоко',
    [ DairySubCategory.YOGURT_DESSERTS ]: 'Йогурты и десерты',
    [ DairySubCategory.EGGS ]: 'Яйца'
}

export const FruitsVegetablesSubCategoryLabels: Record<FruitsVegetablesSubCategory, string> = {
    [ FruitsVegetablesSubCategory.FRUITS ]: 'Фрукты',
    [ FruitsVegetablesSubCategory.VEGETABLES ]: 'Овощи',
    [ FruitsVegetablesSubCategory.BERRIES ]: 'Ягоды',
    [ FruitsVegetablesSubCategory.GREENS_SALADS ]: 'Зелень и салаты',
    [ FruitsVegetablesSubCategory.NUTS_DRIED_FRUITS ]: 'Орехи и сухофрукты'
}

export const MeatPoultrySubCategoryLabels: Record<MeatPoultrySubCategory, string> = {
    [ MeatPoultrySubCategory.BEEF ]: 'Говядина',
    [ MeatPoultrySubCategory.PORK ]: 'Свинина',
    [ MeatPoultrySubCategory.CHICKEN ]: 'Курица',
    [ MeatPoultrySubCategory.TURKEY ]: 'Индейка',
    [ MeatPoultrySubCategory.SAUSAGES ]: 'Колбасы и сосиски'
}

export const FishSeafoodSubCategoryLabels: Record<FishSeafoodSubCategory, string> = {
    [ FishSeafoodSubCategory.FRESH_FISH ]: 'Свежая рыба',
    [ FishSeafoodSubCategory.FROZEN_FISH ]: 'Замороженная рыба',
    [ FishSeafoodSubCategory.SEAFOOD ]: 'Морепродукты',
    [ FishSeafoodSubCategory.FISH_CANNED ]: 'Консервы рыбные'
}

export const GrocerySubCategoryLabels: Record<GrocerySubCategory, string> = {
    [ GrocerySubCategory.GRAINS_PASTA ]: 'Крупы и макароны',
    [ GrocerySubCategory.LEGUMES ]: 'Бобовые',
    [ GrocerySubCategory.SPICES ]: 'Специи и приправы',
    [ GrocerySubCategory.SAUCES_CANNED ]: 'Соусы и консервы',
    [ GrocerySubCategory.HONEY_JAM ]: 'Мёд и варенье'
}

export const BeveragesSubCategoryLabels: Record<BeveragesSubCategory, string> = {
    [ BeveragesSubCategory.WATER ]: 'Вода',
    [ BeveragesSubCategory.JUICES ]: 'Соки и нектары',
    [ BeveragesSubCategory.COFFEE_TEA ]: 'Кофе и чай',
    [ BeveragesSubCategory.SODA ]: 'Газированные напитки',
    [ BeveragesSubCategory.ALCOHOL ]: 'Алкогольные напитки'
}

export const getProductCategoryOptions = () => {
    return Object.values(ProductCategory).map(value => ({
        value,
        label: ProductCategoryLabels[value]
    }))
}

export const getDairySubCategoryOptions = () => {
    return Object.values(DairySubCategory).map(value => ({
        value,
        label: DairySubCategoryLabels[value]
    }))
}

export const getFruitsVegetablesSubCategoryOptions = () => {
    return Object.values(FruitsVegetablesSubCategory).map(value => ({
        value,
        label: FruitsVegetablesSubCategoryLabels[value]
    }))
}

export const getMeatPoultrySubCategoryOptions = () => {
    return Object.values(MeatPoultrySubCategory).map(value => ({
        value,
        label: MeatPoultrySubCategoryLabels[value]
    }))
}

export const getFishSeafoodSubCategoryOptions = () => {
    return Object.values(FishSeafoodSubCategory).map(value => ({
        value,
        label: FishSeafoodSubCategoryLabels[value]
    }))
}

export const getGrocerySubCategoryOptions = () => {
    return Object.values(GrocerySubCategory).map(value => ({
        value,
        label: GrocerySubCategoryLabels[value]
    }))
}

export const getBeveragesSubCategoryOptions = () => {
    return Object.values(BeveragesSubCategory).map(value => ({
        value,
        label: BeveragesSubCategoryLabels[value]
    }))
}

export const getProductCategoryLabel = (category: ProductCategory): string => {
    return ProductCategoryLabels[category] || category
}

export const getDairySubCategoryLabel = (subCategory: DairySubCategory): string => {
    return DairySubCategoryLabels[subCategory] || subCategory
}

export const getFruitsVegetablesSubCategoryLabel = (subCategory: FruitsVegetablesSubCategory): string => {
    return FruitsVegetablesSubCategoryLabels[subCategory] || subCategory
}

export const getMeatPoultrySubCategoryLabel = (subCategory: MeatPoultrySubCategory): string => {
    return MeatPoultrySubCategoryLabels[subCategory] || subCategory
}

export const getFishSeafoodSubCategoryLabel = (subCategory: FishSeafoodSubCategory): string => {
    return FishSeafoodSubCategoryLabels[subCategory] || subCategory
}

export const getGrocerySubCategoryLabel = (subCategory: GrocerySubCategory): string => {
    return GrocerySubCategoryLabels[subCategory] || subCategory
}

export const getBeveragesSubCategoryLabel = (subCategory: BeveragesSubCategory): string => {
    return BeveragesSubCategoryLabels[subCategory] || subCategory
}