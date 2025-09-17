import type { ReactNode } from "react"
import { useLocation, Link } from "react-router-dom"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage
} from "@/components/ui/breadcrumb"

import { Home } from "lucide-react"
import Header from "@/components/ui/layouts/header"
import Footer from "@/components/ui/layouts/footer"

interface IProps {
  children: ReactNode
}

const AppLayout = ({ children }: IProps) => {

    const location = useLocation()
    const paths = location.pathname.split('/').filter(Boolean)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
            <Header />
            <main className="container mx-auto px-4 py-6 flex-1">
                <div className="mb-6">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to="/" className="flex items-center gap-1 text-sm hover:text-blue-600 transition-colors">
                                        <Home className="h-4 w-4" />
                                        <span>Главная</span>
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
          
                            {paths.map((path, index) => {
                            const href = `/${paths.slice(0, index + 1).join('/')}`
                            const isLast = index === paths.length - 1
            
                                return (
                                <BreadcrumbItem key={href}>
                                    {isLast ? (
                                        <BreadcrumbPage className="text-sm capitalize">
                                            {path.replace(/-/g, ' ')}
                                        </BreadcrumbPage>
                                    ) : (
                                        <>
                                            <BreadcrumbSeparator />
                                            <BreadcrumbLink asChild>
                                                <Link 
                                                    to={href} 
                                                    className="text-sm text-slate-600 hover:text-blue-600 transition-colors capitalize"
                                                >
                                                    {path.replace(/-/g, ' ')}
                                                </Link>
                                            </BreadcrumbLink>
                                        </>
                                    )}
                                    </BreadcrumbItem>
                                )
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
                    {children}
                </div>
            </main>
            <Footer/>
        </div>
    )
}

export default AppLayout