import { Star, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/product"

const CardProduct = (product: Product) => {
    return (
        <Card className="group hover:shadow-lg transition-shadow duration-300 border-slate-200">
            <CardHeader className=" ">
                {/* Изображение товара */}
                <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                                
                    {/* Бейдж скидки */}
                    {product.old_price && (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            -{Math.round((1 - product.price / product.old_price) * 100)}%
                        </Badge>
                    )}
                                
                    {/* Кнопка избранного */}
                    {/* <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white ${
                            product. ? 'text-red-500' : 'text-slate-400'
                        }`}
                        onClick={() => toggleFavorite(product.id)}
                    >
                        <Heart 
                            className={`h-4 w-4 ${product.isFavorite ? 'fill-current' : ''}`} 
                        />
                    </Button> */}
                    {/* Бейдж отсутствия в наличии */}
                    {!product.in_stock && (
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
                        ({product.reviews_count} отзывов)
                    </span>
                </div>

                {/* Цены */}
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-slate-900">
                        {product.price} ₽
                    </span>
                    {product.old_price && (
                        <span className="text-sm text-slate-400 line-through">
                            {product.old_price} ₽
                        </span>
                    )}
                </div>
            </CardContent>

            <CardFooter className=" pt-0">
                <Button 
                    className="w-full gap-2" 
                    size="lg"
                    disabled={!product.in_stock}
                    // onClick={() => addToCart(product.id)}
                >
                    <ShoppingCart className="h-4 w-4" />
                    В корзину
                </Button>
            </CardFooter>
        </Card>
    )
}

export default CardProduct
