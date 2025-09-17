import { Input } from "@/components/ui/input"
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
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { 
    Milk, 
    Carrot, 
    Fish, 
    Beef, 
    Croissant,
    Coffee, 
    IceCream,
    Sparkles,
    Wheat,
    Search
} from "lucide-react"
import { 
    BeveragesSubCategory, 
    BeveragesSubCategoryLabels, 
    DairySubCategory, 
    DairySubCategoryLabels, 
    FishSeafoodSubCategory, 
    FishSeafoodSubCategoryLabels, 
    FruitsVegetablesSubCategory, 
    FruitsVegetablesSubCategoryLabels, 
    GrocerySubCategory, 
    GrocerySubCategoryLabels, 
    MeatPoultrySubCategory, 
    MeatPoultrySubCategoryLabels, 
    ProductCategory, 
    ProductCategoryLabels 
} from "@/config/category.config"

const HomePage = () => {
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
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-md py-5 text-base font-medium">
                        Категории продуктов
                    </Button>
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
                        <DropdownMenuItem>{DairySubCategoryLabels[DairySubCategory.LOW_FAT]}</DropdownMenuItem>
                        <DropdownMenuItem>{DairySubCategoryLabels[DairySubCategory.MEDIUM_FAT]}</DropdownMenuItem>
                        <DropdownMenuItem>{DairySubCategoryLabels[DairySubCategory.CLASSIC_FAT]}</DropdownMenuItem>
                        <DropdownMenuItem>{DairySubCategoryLabels[DairySubCategory.HIGH_FAT]}</DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuLabel>Вид продукции</DropdownMenuLabel>

                        <DropdownMenuItem>
                            <span className="h-4 w-4 mr-2">🧀</span>
                            <span>{DairySubCategoryLabels[DairySubCategory.CHEESE]}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span className="h-4 w-4 mr-2">🥛</span>
                            {DairySubCategoryLabels[DairySubCategory.MILK]}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span className="h-4 w-4 mr-2">🍦</span>
                            {DairySubCategoryLabels[DairySubCategory.YOGURT_DESSERTS]}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span className="h-4 w-4 mr-2">🥚</span>
                            {DairySubCategoryLabels[DairySubCategory.EGGS]}
                        </DropdownMenuItem>
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
                <DropdownMenuItem>
                    <span className="h-4 w-4 mr-2">🍏</span>
                    {FruitsVegetablesSubCategoryLabels[FruitsVegetablesSubCategory.FRUITS]}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="h-4 w-4 mr-2">🥕</span>
                  {FruitsVegetablesSubCategoryLabels[FruitsVegetablesSubCategory.VEGETABLES]}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="h-4 w-4 mr-2">🍒</span>
                  {FruitsVegetablesSubCategoryLabels[FruitsVegetablesSubCategory.BERRIES]}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="h-4 w-4 mr-2">🥬</span>
                  {FruitsVegetablesSubCategoryLabels[FruitsVegetablesSubCategory.GREENS_SALADS]}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="h-4 w-4 mr-2">🌰</span>
                  {FruitsVegetablesSubCategoryLabels[FruitsVegetablesSubCategory.NUTS_DRIED_FRUITS]}
                </DropdownMenuItem>
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
                <DropdownMenuItem>
                    <span className="h-4 w-4 mr-2">🐄</span> 
                    {MeatPoultrySubCategoryLabels[MeatPoultrySubCategory.BEEF]}
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span className="h-4 w-4 mr-2">🐖</span>
                    {MeatPoultrySubCategoryLabels[MeatPoultrySubCategory.PORK]}
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span className="h-4 w-4 mr-2">🐔</span> 
                    {MeatPoultrySubCategoryLabels[MeatPoultrySubCategory.CHICKEN]}
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span className="h-4 w-4 mr-2">🦃</span> 
                    {MeatPoultrySubCategoryLabels[MeatPoultrySubCategory.TURKEY]}
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span className="h-4 w-4 mr-2">🍗</span>
                    {MeatPoultrySubCategoryLabels[MeatPoultrySubCategory.SAUSAGES]}
                </DropdownMenuItem>
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
                <DropdownMenuItem>
                    <span className="h-4 w-4 mr-2">🐟</span> 
                    {FishSeafoodSubCategoryLabels[FishSeafoodSubCategory.FRESH_FISH]}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span className="h-4 w-4 mr-2">🧊</span> 
                        {FishSeafoodSubCategoryLabels[FishSeafoodSubCategory.FROZEN_FISH]}
                    </DropdownMenuItem>
                    <DropdownMenuItem><span className="h-4 w-4 mr-2">🦐</span>{FishSeafoodSubCategoryLabels[FishSeafoodSubCategory.SEAFOOD]}</DropdownMenuItem>
                <DropdownMenuItem><span className="h-4 w-4 mr-2">🥫</span>{FishSeafoodSubCategoryLabels[FishSeafoodSubCategory.FISH_CANNED]}</DropdownMenuItem>
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
                                        <DropdownMenuItem>
                                            <span className="h-4 w-4 mr-2">🍚</span> 
                                            {GrocerySubCategoryLabels[GrocerySubCategory.GRAINS_PASTA]}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span className="h-4 w-4 mr-2">🫘</span> 
                                            {GrocerySubCategoryLabels[GrocerySubCategory.LEGUMES]}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span className="h-4 w-4 mr-2">🧂</span> 
                                            {GrocerySubCategoryLabels[GrocerySubCategory.SPICES]}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span className="h-4 w-4 mr-2">🥫</span> 
                                            {GrocerySubCategoryLabels[GrocerySubCategory.SAUCES_CANNED]}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span className="h-4 w-4 mr-2">🍯</span> 
                                            {GrocerySubCategoryLabels[GrocerySubCategory.HONEY_JAM]}
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        {/* Хлеб и выпечка */}
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="flex items-center gap-2">
                                <Croissant className="h-4 w-4 text-amber-800" />
                                <span>{ProductCategoryLabels[ProductCategory.BAKERY]}</span>
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
                                        <DropdownMenuItem>
                                            <span className="h-4 w-4 mr-2">💧</span>
                                            {BeveragesSubCategoryLabels[BeveragesSubCategory.WATER]}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span className="h-4 w-4 mr-2">🥤</span>
                                            {BeveragesSubCategoryLabels[BeveragesSubCategory.JUICES]}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span className="h-4 w-4 mr-2">☕</span>
                                            {BeveragesSubCategoryLabels[BeveragesSubCategory.COFFEE_TEA]}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span className="h-4 w-4 mr-2">🥛</span>
                                            {BeveragesSubCategoryLabels[BeveragesSubCategory.SODA]}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span className="h-4 w-4 mr-2">🍷</span> 
                                            {BeveragesSubCategoryLabels[BeveragesSubCategory.ALCOHOL]}
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        {/* Замороженные продукты */}
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="flex items-center gap-2">
                                <IceCream className="h-4 w-4 text-blue-300" />
                                <span>{ProductCategoryLabels[ProductCategory.FROZEN]}</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        {/* Сладости и снеки */}
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-yellow-500" />
                                <span>{ProductCategoryLabels[ProductCategory.SWEETS_SNACKS]}</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default HomePage
