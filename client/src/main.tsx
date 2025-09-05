import ReactDOM from 'react-dom/client';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

import { App } from './views/App.tsx';
import { AdminPage } from './views/Admin.tsx';
import { isAdmin } from './lib/index.ts';
import './styles.css';

const queryClient = new QueryClient();

function Main() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            {isAdmin() && <Route path="/admin" element={<AdminPage />} />}
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Main />);
