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
        <ErrorBoundary fallback={<div>Something went wrong.</div>}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              {isAdmin() && <Route path="/admin" element={<AdminPage />} />}
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Main />);

class ErrorBoundary extends React.Component {
  props: { children: React.ReactNode; fallback?: React.ReactNode };
  fallback: React.ReactNode;
  children: React.ReactNode;
  state: { hasError: boolean; error: Error | null };

  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false, error: null };
    this.props = props;
    this.fallback = props.fallback;
    this.children = props.children;
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.fallback ?? <div>Something went wrong.</div>;
    }

    return this.children ?? <div>Something went wrong.</div>;
  }
}
