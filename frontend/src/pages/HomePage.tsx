import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ProductCategoriesDropdown, type SelectedCategory } from "@/components/ProductCategoriesDropdown"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useSearchProductsQuery } from "@/api/productsApi"
import type { Product } from "@/types/product"
import CardProduct from "@/components/common/CardProduct"

const HomePage = () => {
    const [selectedCategories, setSelectedCategories] = useState<SelectedCategory[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    const { data: searchData } = useSearchProductsQuery({ 
        q: 'coca-cola', 
        page: 1, 
        size: 10 
    })

    const products = searchData?.products.items || []

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
                {products?.map((product: Product) => (
                    <CardProduct 
                        key={product.id}
                        {...product}
                    />
                ))}
            </div>

            {/* Заглушка если товаров нет */}
            {
                products?.length === 0 && (
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
                )
            }
        </div>
    )
}

export default HomePage