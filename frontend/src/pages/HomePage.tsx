import { Input } from "@/components/ui/input"
import { Search, Star, ShoppingCart, Heart } from "lucide-react"
import { ProductCategoriesDropdown, type SelectedCategory } from "@/components/ProductCategoriesDropdown"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

// Интерфейс для товара
interface Product {
  id: number
  name: string
  price: number
  oldPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  isFavorite: boolean
  inStock: boolean
}

const HomePage = () => {
    const [selectedCategories, setSelectedCategories] = useState<SelectedCategory[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    // Моковые данные товаров
    const products: Product[] = [
        {
            id: 1,
            name: "Свежее молоко 3.2%",
            price: 89,
            oldPrice: 99,
            image: "/api/placeholder/300/300",
            rating: 4.8,
            reviews: 124,
            category: "Молочные продукты",
            isFavorite: false,
            inStock: true
        },
        {
            id: 2,
            name: "Органические яйца куриные",
            price: 189,
            image: "/api/placeholder/300/300",
            rating: 4.9,
            reviews: 89,
            category: "Молочные продукты",
            isFavorite: true,
            inStock: false
        },
        {
            id: 3,
            name: "Сыр Гауда",
            price: 349,
            oldPrice: 399,
            image: "/api/placeholder/300/300",
            rating: 4.7,
            reviews: 67,
            category: "Молочные продукты",
            isFavorite: false,
            inStock: true
        },
        {
            id: 4,
            name: "Свежие яблоки Гренни Смит",
            price: 129,
            image: "/api/placeholder/300/300",
            rating: 4.6,
            reviews: 156,
            category: "Овощи и фрукты",
            isFavorite: false,
            inStock: true
        },
        {
            id: 5,
            name: "Куриное филе",
            price: 289,
            image: "/api/placeholder/300/300",
            rating: 4.5,
            reviews: 203,
            category: "Мясо и птица",
            isFavorite: false,
            inStock: false
        },
        {
            id: 6,
            name: "Свежая форель",
            price: 459,
            oldPrice: 499,
            image: "/api/placeholder/300/300",
            rating: 4.8,
            reviews: 78,
            category: "Рыба и морепродукты",
            isFavorite: true,
            inStock: true
        }
    ]

    const toggleFavorite = (productId: number) => {
        // Логика добавления/удаления из избранного
        console.log("Toggle favorite:", productId)
    }

    const addToCart = (productId: number) => {
        // Логика добавления в корзину
        console.log("Add to cart:", productId)
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Поиск и фильтры */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Поиск продуктов..." 
                        className="w-full pl-10 pr-4 py-5 rounded-md bg-slate-100 border-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <ProductCategoriesDropdown
                    selectedCategories={selectedCategories}
                    onCategoriesChange={setSelectedCategories}
                    maxSelected={5}
                    placeholder="Категории"
                />    
            </div>

            {/* Информация о выбранных фильтрах */}
            {selectedCategories.length > 0 && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Выбрано категорий:</span>
                    <Badge variant="secondary">{selectedCategories.length}</Badge>
                </div>
            )}

            {/* Сетка карточек товаров */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 border-slate-200">
                        <CardHeader className=" ">
                            {/* Изображение товара */}
                            <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                                
                                {/* Бейдж скидки */}
                                {product.oldPrice && (
                                    <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                                        -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                                    </Badge>
                                )}
                                
                                {/* Кнопка избранного */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white ${
                                        product.isFavorite ? 'text-red-500' : 'text-slate-400'
                                    }`}
                                    onClick={() => toggleFavorite(product.id)}
                                >
                                    <Heart 
                                        className={`h-4 w-4 ${product.isFavorite ? 'fill-current' : ''}`} 
                                    />
                                </Button>

                                {/* Бейдж отсутствия в наличии */}
                                {!product.inStock && (
                                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                                        <Badge variant="secondary" className="bg-slate-800/90 text-white">
                                            Нет в наличии
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="">
                            {/* Категория */}
                            <div className="mb-2">
                                <Badge variant="outline" className="text-xs text-slate-500">
                                    {product.category}
                                </Badge>
                            </div>

                            {/* Название товара */}
                            <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 leading-tight">
                                {product.name}
                            </h3>

                            {/* Рейтинг и отзывы */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium text-slate-900">
                                        {product.rating}
                                    </span>
                                </div>
                                <span className="text-sm text-slate-500">
                                    ({product.reviews} отзывов)
                                </span>
                            </div>

                            {/* Цены */}
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-slate-900">
                                    {product.price} ₽
                                </span>
                                {product.oldPrice && (
                                    <span className="text-sm text-slate-400 line-through">
                                        {product.oldPrice} ₽
                                    </span>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className=" pt-0">
                            <Button 
                                className="w-full gap-2" 
                                size="lg"
                                disabled={!product.inStock}
                                onClick={() => addToCart(product.id)}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                В корзину
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Заглушка если товаров нет */}
            {products.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-slate-400 mb-4">
                        <Search className="h-16 w-16 mx-auto mb-2" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Товары не найдены
                    </h3>
                    <p className="text-slate-600">
                        Попробуйте изменить параметры поиска или выбрать другие категории
                    </p>
                </div>
            )}
        </div>
    )
}

export default HomePage