import ReactDOM from 'react-dom/client';
import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

import { App } from './views/App';
import { AdminPage } from './views/Admin';
import { isAdmin } from './lib/index';
import './styles.css';
import { Login } from './views/Login';
import { getUserToken } from './lib/auth';
import { Logout } from './views/Logout';

const queryClient = new QueryClient();

function Main() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<App />} />
              {isAdmin() && <Route path="/admin" element={<AdminPage />} />}
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

function ProtectedRoute() {
  const user = getUserToken();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Main />);
