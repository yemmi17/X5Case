
import { Link } from "react-router-dom"
import img from "/X5Case.svg"

const Header = () => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-800">
                        <img src={img} alt="" className="w-10 h-10" />
                        <span>Пятёрочка</span>
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Header
