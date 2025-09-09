import { logout } from '@/lib/auth';
import { Navigate } from 'react-router';

export function Logout() {
  logout();
  return <Navigate to="/login" />;
}
