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
                            <span>Молочные продукты</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuLabel>По жирности</DropdownMenuLabel>
                <DropdownMenuItem>0.5% - Обезжиренные</DropdownMenuItem>
                <DropdownMenuItem>1.5% - Нежирные</DropdownMenuItem>
                <DropdownMenuItem>2.5% - Классические</DropdownMenuItem>
                <DropdownMenuItem>3.2% - Жирные</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Вид продукции</DropdownMenuLabel>
                <DropdownMenuItem>
                  <span className="h-4 w-4 mr-2">🧀</span>
                  <span>Сыры</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="h-4 w-4 mr-2">🥛</span>
                  Молоко
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="h-4 w-4 mr-2">🍦</span>
                  Йогурты и десерты
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="h-4 w-4 mr-2">🥚</span>
                  Яйца
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
              <span>Овощи и фрукты</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <span className="h-4 w-4 mr-2">🍏</span>
                  Фрукты
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="h-4 w-4 mr-2">🥕</span>
                  Овощи
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="h-4 w-4 mr-2">🍒</span>
                  Ягоды
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="h-4 w-4 mr-2">🥬</span>
                  Зелень и салаты
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="h-4 w-4 mr-2">🌰</span>
                  Орехи и сухофрукты
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
              <span>Мясо и птица</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                    <span className="h-4 w-4 mr-2">🐄</span> 
                    Говядина
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span className="h-4 w-4 mr-2">🐖</span>
                    Свинина
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span className="h-4 w-4 mr-2">🐔</span> 
                    Курица
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span className="h-4 w-4 mr-2">🦃</span> 
                    Индейка
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span className="h-4 w-4 mr-2">🍗</span>
                    Колбасы и сосиски
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
              <span>Рыба и морепродукты</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem><span className="h-4 w-4 mr-2">🐟</span> Свежая рыба</DropdownMenuItem>
                <DropdownMenuItem><span className="h-4 w-4 mr-2">🧊</span> Замороженная рыба</DropdownMenuItem>
                <DropdownMenuItem><span className="h-4 w-4 mr-2">🦐</span> Морепродукты</DropdownMenuItem>
                <DropdownMenuItem><span className="h-4 w-4 mr-2">🥫</span> Консервы рыбные</DropdownMenuItem>
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
              <span>Бакалея</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem><span className="h-4 w-4 mr-2">🍚</span> Крупы и макароны</DropdownMenuItem>
                <DropdownMenuItem><span className="h-4 w-4 mr-2">🫘</span> Бобовые</DropdownMenuItem>
                <DropdownMenuItem><span className="h-4 w-4 mr-2">🧂</span> Специи и приправы</DropdownMenuItem>
                <DropdownMenuItem><span className="h-4 w-4 mr-2">🥫</span> Соусы и консервы</DropdownMenuItem>
                <DropdownMenuItem><span className="h-4 w-4 mr-2">🍯</span> Мёд и варенье</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Хлеб и выпечка */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center gap-2">
            <Croissant className="h-4 w-4 text-amber-800" />
            <span>Хлеб и выпечка</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Напитки */}
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-brown-600" />
              <span>Напитки</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem><span className="h-4 w-4 mr-2">💧</span> Вода</DropdownMenuItem>
                <DropdownMenuItem><span className="h-4 w-4 mr-2">🥤</span> Соки и нектары</DropdownMenuItem>
                <DropdownMenuItem><span className="h-4 w-4 mr-2">☕</span> Кофе и чай</DropdownMenuItem>
                <DropdownMenuItem><span className="h-4 w-4 mr-2">🥛</span> Газированные напитки</DropdownMenuItem>
                <DropdownMenuItem><span className="h-4 w-4 mr-2">🍷</span> Алкогольные напитки</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    {/* Замороженные продукты */}
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="flex items-center gap-2">
                            <IceCream className="h-4 w-4 text-blue-300" />
                            <span>Замороженные продукты</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    {/* Сладости и снеки */}
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-yellow-500" />
                                <span>Сладости и снеки</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default HomePage
