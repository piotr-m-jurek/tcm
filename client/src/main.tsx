import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from 'react-query'

import { App } from './views/App.tsx'
import { AdminPage } from './views/Admin.tsx'
import { isAdmin } from './lib.ts'
import './styles.css'

const queryClient = new QueryClient()

function Main () {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            {isAdmin() && 
              (<Route path="/admin" element={<AdminPage />} />)
            }
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  )
}


createRoot(document.getElementById('root')!).render(<Main />)
