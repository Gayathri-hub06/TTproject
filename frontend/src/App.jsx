import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AppRoutes } from './routes/AppRoutes';
import './styles/index.css';

const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isPublicRoute =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register';

  const showSidebar = isAuthenticated && !isPublicRoute;

  return (
    <div className="app-container">
      {showSidebar && <Sidebar />}
      <div className="main-content">
        <Navbar />
        <main style={{ flex: 1 }}>
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
