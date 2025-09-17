import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import AppLayout from "./layouts/Applayout"
function App() {
  
  const LazyHomePage = lazy(() => import('./pages/HomePage'))
  const LazyProductPage = lazy(() => import('./pages/ProductPage'))
  
  return (
    <AppLayout >
      <Suspense fallback={<>Loader...</>}>
        <Routes>
          <Route path={"/"} element={<LazyHomePage />} />
          <Route path={"/:id"} element={<LazyProductPage />} />
        </Routes>
      </Suspense>
    </AppLayout>
    
    // <div className="flex items-center gap-4">
    //   <Input />
    //   <DropdownMenu>
    //     <DropdownMenuTrigger asChild>
    //       <Button variant="outline">Категори</Button>
    //     </DropdownMenuTrigger>
    //     <DropdownMenuContent className="w-56" align="start">
    //       <DropdownMenuLabel>My Account</DropdownMenuLabel>
    //         <DropdownMenuGroup>
    //       <DropdownMenuItem>
    //         Profile
    //         <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    //       </DropdownMenuItem>
    //       <DropdownMenuItem>
    //         Billing
    //         <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
    //       </DropdownMenuItem>
    //       <DropdownMenuItem>
    //         Settings
    //         <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
    //       </DropdownMenuItem>
    //       <DropdownMenuItem>
    //         Keyboard shortcuts
    //         <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
    //       </DropdownMenuItem>
    //     </DropdownMenuGroup>
    //     <DropdownMenuSeparator />
    //     <DropdownMenuGroup>
    //       <DropdownMenuItem>Team</DropdownMenuItem>
    //       <DropdownMenuSub>
    //         <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
    //         <DropdownMenuPortal>
    //           <DropdownMenuSubContent>
    //             <DropdownMenuItem>Email</DropdownMenuItem>
    //             <DropdownMenuItem>Message</DropdownMenuItem>
    //             <DropdownMenuSeparator />
    //             <DropdownMenuItem>More...</DropdownMenuItem>
    //           </DropdownMenuSubContent>
    //         </DropdownMenuPortal>
    //       </DropdownMenuSub>
    //       <DropdownMenuItem>
    //         New Team
    //         <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
    //       </DropdownMenuItem>
    //     </DropdownMenuGroup>
    //     <DropdownMenuSeparator />
    //         <DropdownMenuItem>GitHub</DropdownMenuItem>
    //         <DropdownMenuItem>Support</DropdownMenuItem>
    //         <DropdownMenuItem disabled>API</DropdownMenuItem>
    //       <DropdownMenuSeparator />
    //         <DropdownMenuItem>
    //           Log out
    //         <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    //       </DropdownMenuItem>
    //     </DropdownMenuContent>
    //   </DropdownMenu>
    // </div>
  )
}

export default App
