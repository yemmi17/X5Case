import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ProductCategoriesDropdown, type SelectedCategory } from "@/components/ProductCategoriesDropdown"
import { useState } from "react"

const HomePage = () => {
    
    const [selectedCategories, setSelectedCategories] = useState<SelectedCategory[]>([]);

    return (
        <div className="flex flex-col">
            
            <div className="flex items-center gap-4 h-full">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Поиск продуктов..." 
                        className="w-100 pl-10 pr-4 py-5 rounded-md bg-slate-100 border-slate-200"
                    />
                </div>
                <ProductCategoriesDropdown
                    selectedCategories={selectedCategories}
                    onCategoriesChange={setSelectedCategories}
                    maxSelected={5}
                    placeholder="Выберите категории продуктов"
                />    
            </div>
        </div>
    )
}

export default HomePage
