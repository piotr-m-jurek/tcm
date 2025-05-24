import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AdminPage } from './Admin.tsx'
import { isAdmin } from './lib.ts'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          {isAdmin() && (
            <Route path="/admin" element={<AdminPage />} />
          )}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
