import { Package } from "lucide-react"
import { Link } from "react-router-dom"

const Header = () => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-800">
                        <Package className="h-6 w-6 text-blue-600" />
                        <span>Пятёрочка</span>
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Header
