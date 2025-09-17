import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import AppLayout from "./layouts/AppLayout"

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
  )
}

export default App
