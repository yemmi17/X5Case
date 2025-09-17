import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { 
    Carrot, 
    Croissant, 
    IceCream, 
    Milk, 
    Sparkles, 
    X, 
    Beef, 
    Fish, 
    Wheat, 
    Coffee 
} from 'lucide-react'

import {
    ProductCategory,
    DairySubCategory,
    FruitsVegetablesSubCategory,
    MeatPoultrySubCategory,
    FishSeafoodSubCategory,
    GrocerySubCategory,
    BeveragesSubCategory,
    ProductCategoryLabels,
    DairySubCategoryLabels,
    FruitsVegetablesSubCategoryLabels,
    MeatPoultrySubCategoryLabels,
    FishSeafoodSubCategoryLabels,
    GrocerySubCategoryLabels,
    BeveragesSubCategoryLabels,
} from '@/config/category.config'

import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'

export type SelectedCategory = {
    category: ProductCategory
    subCategory?: string
    label: string
}

interface ProductCategoriesDropdownProps {
    selectedCategories: SelectedCategory[]
    onCategoriesChange: (categories: SelectedCategory[]) => void
    maxSelected?: number
    placeholder?: string
}

export const ProductCategoriesDropdown = ({
    selectedCategories,
    onCategoriesChange,
    maxSelected = 10,
    placeholder = "Категории продуктов"
}: ProductCategoriesDropdownProps) => {
    const [open, setOpen] = useState(false)

    const handleCategorySelect = (category: ProductCategory, subCategory?: string) => {
        const label = subCategory 
        ? `${ProductCategoryLabels[category]} - ${getSubCategoryLabel(category, subCategory)}`
        : ProductCategoryLabels[category]

        const newCategory: SelectedCategory = { category, subCategory, label }

        const isAlreadySelected = selectedCategories.some(
            cat => cat.category === category && cat.subCategory === subCategory
        )

        if (!isAlreadySelected && selectedCategories.length < maxSelected) {
            onCategoriesChange([...selectedCategories, newCategory])
        }
    }

    const removeCategory = (index: number) => {
        const newCategories = selectedCategories.filter((_, i) => i !== index)
        onCategoriesChange(newCategories)
    }

    const clearAllCategories = () => {
        onCategoriesChange([])
    }

    const getSubCategoryLabel = (category: ProductCategory, subCategory: string): string => {
        switch (category) {
            case ProductCategory.DAIRY:
                return DairySubCategoryLabels[subCategory as DairySubCategory]
            case ProductCategory.FRUITS_VEGETABLES:
                return FruitsVegetablesSubCategoryLabels[subCategory as FruitsVegetablesSubCategory]
            case ProductCategory.MEAT_POULTRY:
                return MeatPoultrySubCategoryLabels[subCategory as MeatPoultrySubCategory]
            case ProductCategory.FISH_SEAFOOD:
                return FishSeafoodSubCategoryLabels[subCategory as FishSeafoodSubCategory]
            case ProductCategory.GROCERY:
                return GrocerySubCategoryLabels[subCategory as GrocerySubCategory]
            case ProductCategory.BEVERAGES:
                return BeveragesSubCategoryLabels[subCategory as BeveragesSubCategory]
            default:
                return subCategory
        }
    }

    const isCategorySelected = (category: ProductCategory, subCategory?: string) => {
        return selectedCategories.some(
            cat => cat.category === category && cat.subCategory === subCategory
        )
    }

    return (
        <div className="space-y-3">
            <HoverCard>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                        <HoverCardTrigger asChild>
                            <Button variant="outline" className="rounded-md py-5 text-base font-medium w-full">
                                {placeholder}
                                {selectedCategories.length > 0 && (
                                    <Badge variant="secondary" className="ml-2">
                                    {selectedCategories.length}
                                    </Badge>
                                )}
                            </Button>
                        </HoverCardTrigger>
                
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-64" align="start">
                    {/* Молочные продукты */}
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center gap-2">
                                <Milk className="h-4 w-4 text-blue-600" />
                                <span>{ProductCategoryLabels[ProductCategory.DAIRY]}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuLabel>По жирности</DropdownMenuLabel>
                                    {Object.values(DairySubCategory).slice(0, 4).map((subCategory) => (
                                        <DropdownMenuItem
                                        key={subCategory}
                                        onSelect={() => handleCategorySelect(ProductCategory.DAIRY, subCategory)}
                                        className={isCategorySelected(ProductCategory.DAIRY, subCategory) ? 'bg-accent' : ''}
                                        >
                                            {DairySubCategoryLabels[subCategory]}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>Вид продукции</DropdownMenuLabel>
                                    {Object.values(DairySubCategory).slice(4).map((subCategory) => (
                                        <DropdownMenuItem
                                            key={subCategory}
                                            onSelect={() => handleCategorySelect(ProductCategory.DAIRY, subCategory)}
                                            className={isCategorySelected(ProductCategory.DAIRY, subCategory) ? 'bg-accent' : ''}
                                        >
                                            <span className="h-4 w-4 mr-2">
                                                {subCategory === DairySubCategory.CHEESE && '🧀'}
                                                {subCategory === DairySubCategory.MILK && '🥛'}
                                                {subCategory === DairySubCategory.YOGURT_DESSERTS && '🍦'}
                                                {subCategory === DairySubCategory.EGGS && '🥚'}
                                            </span>
                                        {DairySubCategoryLabels[subCategory]}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    {/* Овощи и фрукты */}
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center gap-2">
                                <Carrot className="h-4 w-4 text-orange-500" />
                                <span>{ProductCategoryLabels[ProductCategory.FRUITS_VEGETABLES]}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {Object.values(FruitsVegetablesSubCategory).map((subCategory) => (
                                        <DropdownMenuItem
                                            key={subCategory}
                                            onSelect={() => handleCategorySelect(ProductCategory.FRUITS_VEGETABLES, subCategory)}
                                            className={isCategorySelected(ProductCategory.FRUITS_VEGETABLES, subCategory) ? 'bg-accent' : ''}
                                        >
                                            <span className="h-4 w-4 mr-2">
                                                {subCategory === FruitsVegetablesSubCategory.FRUITS && '🍏'}
                                                {subCategory === FruitsVegetablesSubCategory.VEGETABLES && '🥕'}
                                                {subCategory === FruitsVegetablesSubCategory.BERRIES && '🍒'}
                                                {subCategory === FruitsVegetablesSubCategory.GREENS_SALADS && '🥬'}
                                                {subCategory === FruitsVegetablesSubCategory.NUTS_DRIED_FRUITS && '🌰'}
                                            </span>
                                            {FruitsVegetablesSubCategoryLabels[subCategory]}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    {/* Мясо и птица */}
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center gap-2">
                                <Beef className="h-4 w-4 text-red-500" />
                                <span>{ProductCategoryLabels[ProductCategory.MEAT_POULTRY]}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {Object.values(MeatPoultrySubCategory).map((subCategory) => (
                                        <DropdownMenuItem
                                            key={subCategory}
                                            onSelect={() => handleCategorySelect(ProductCategory.MEAT_POULTRY, subCategory)}
                                            className={isCategorySelected(ProductCategory.MEAT_POULTRY, subCategory) ? 'bg-accent' : ''}
                                        >
                                            <span className="h-4 w-4 mr-2">
                                                {subCategory === MeatPoultrySubCategory.BEEF && '🐄'}
                                                {subCategory === MeatPoultrySubCategory.PORK && '🐖'}
                                                {subCategory === MeatPoultrySubCategory.CHICKEN && '🐔'}
                                                {subCategory === MeatPoultrySubCategory.TURKEY && '🦃'}
                                                {subCategory === MeatPoultrySubCategory.SAUSAGES && '🍗'}
                                            </span>
                                            {MeatPoultrySubCategoryLabels[subCategory]}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    {/* Рыба и морепродукты */}
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center gap-2">
                                <Fish className="h-4 w-4 text-blue-400" />
                                <span>{ProductCategoryLabels[ProductCategory.FISH_SEAFOOD]}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {Object.values(FishSeafoodSubCategory).map((subCategory) => (
                                        <DropdownMenuItem
                                            key={subCategory}
                                            onSelect={() => handleCategorySelect(ProductCategory.FISH_SEAFOOD, subCategory)}
                                            className={isCategorySelected(ProductCategory.FISH_SEAFOOD, subCategory) ? 'bg-accent' : ''}
                                        >
                                            <span className="h-4 w-4 mr-2">
                                                {subCategory === FishSeafoodSubCategory.FRESH_FISH && '🐟'}
                                                {subCategory === FishSeafoodSubCategory.FROZEN_FISH && '🧊'}
                                                {subCategory === FishSeafoodSubCategory.SEAFOOD && '🦐'}
                                                {subCategory === FishSeafoodSubCategory.FISH_CANNED && '🥫'}
                                            </span>
                                            {FishSeafoodSubCategoryLabels[subCategory]}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    {/* Бакалея */}
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center gap-2">
                                <Wheat className="h-4 w-4 text-amber-600" />
                                <span>{ProductCategoryLabels[ProductCategory.GROCERY]}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {Object.values(GrocerySubCategory).map((subCategory) => (
                                        <DropdownMenuItem
                                        key={subCategory}
                                        onSelect={() => handleCategorySelect(ProductCategory.GROCERY, subCategory)}
                                        className={isCategorySelected(ProductCategory.GROCERY, subCategory) ? 'bg-accent' : ''}
                                        >
                                        <span className="h-4 w-4 mr-2">
                                            {subCategory === GrocerySubCategory.GRAINS_PASTA && '🍚'}
                                            {subCategory === GrocerySubCategory.LEGUMES && '🫘'}
                                            {subCategory === GrocerySubCategory.SPICES && '🧂'}
                                            {subCategory === GrocerySubCategory.SAUCES_CANNED && '🥫'}
                                            {subCategory === GrocerySubCategory.HONEY_JAM && '🍯'}
                                        </span>
                                        {GrocerySubCategoryLabels[subCategory]}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    {/* Хлеб и выпечка */}
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onSelect={() => handleCategorySelect(ProductCategory.BAKERY)}
                            className={isCategorySelected(ProductCategory.BAKERY) ? 'bg-accent' : ''}
                        >
                            <Croissant className="h-4 w-4 text-amber-800 mr-2" />
                            {ProductCategoryLabels[ProductCategory.BAKERY]}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    {/* Напитки */}
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center gap-2">
                                <Coffee className="h-4 w-4 text-brown-600" />
                                <span>{ProductCategoryLabels[ProductCategory.BEVERAGES]}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            {Object.values(BeveragesSubCategory).map((subCategory) => (
                                <DropdownMenuItem
                                    key={subCategory}
                                    onSelect={() => handleCategorySelect(ProductCategory.BEVERAGES, subCategory)}
                                    className={isCategorySelected(ProductCategory.BEVERAGES, subCategory) ? 'bg-accent' : ''}
                                >
                                    <span className="h-4 w-4 mr-2">
                                        {subCategory === BeveragesSubCategory.WATER && '💧'}
                                        {subCategory === BeveragesSubCategory.JUICES && '🥤'}
                                        {subCategory === BeveragesSubCategory.COFFEE_TEA && '☕'}
                                        {subCategory === BeveragesSubCategory.SODA && '🥛'}
                                        {subCategory === BeveragesSubCategory.ALCOHOL && '🍷'}
                                    </span>
                                    {BeveragesSubCategoryLabels[subCategory]}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Замороженные продукты */}
            <DropdownMenuGroup>
                <DropdownMenuItem
                    onSelect={() => handleCategorySelect(ProductCategory.FROZEN)}
                    className={isCategorySelected(ProductCategory.FROZEN) ? 'bg-accent' : ''}
                >
                    <IceCream className="h-4 w-4 text-blue-300 mr-2" />
                    {ProductCategoryLabels[ProductCategory.FROZEN]}
                </DropdownMenuItem>
            </DropdownMenuGroup>

            {/* Сладости и снеки */}
            <DropdownMenuGroup>
                <DropdownMenuItem
                    onSelect={() => handleCategorySelect(ProductCategory.SWEETS_SNACKS)}
                    className={isCategorySelected(ProductCategory.SWEETS_SNACKS) ? 'bg-accent' : ''}
                >
                    <Sparkles className="h-4 w-4 text-yellow-500 mr-2" />
                    {ProductCategoryLabels[ProductCategory.SWEETS_SNACKS]}
                </DropdownMenuItem>
            </DropdownMenuGroup>

            </DropdownMenuContent>
        </DropdownMenu>

        {selectedCategories.length > 0 && (
            <HoverCardContent className="w-100">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Выбранные категории:</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllCategories}
                            className="h-6 px-2 text-xs"
                        >
                            Очистить все
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {selectedCategories.map((category, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="px-2 py-1 text-sm flex items-center gap-1"
                            >
                                {category.label}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0 ml-1"
                                    onClick={() => removeCategory(index)}
                                >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                </HoverCardContent>)}
            </HoverCard>      
        </div>
    )
}