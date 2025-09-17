import type { ReactNode } from "react"

interface IProps {
    children: ReactNode
}

const AppLayout = ({children}:IProps) => {
    return (
        <div className="h-screen w-full">
            <header></header>
            {children}
            <footer></footer>
        </div>
    )
}

export default AppLayout