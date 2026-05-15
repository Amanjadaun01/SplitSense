import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Friends from './pages/Friends';
import Groups from './pages/Groups';
import GroupDetails from './pages/GroupDetails';
import Account from './pages/Account';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';

// Protected Route Component
function ProtectedRoute({ element }) {
  const user = useAuthStore((state) => state.user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return element;
}

function App() {
  const { isDarkMode } = useThemeStore();

  // This watches the global state and updates the entire website instantly
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Router>
      {/* We use standard Tailwind classes for a full-screen, clean background */}
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes - User must be logged in to access */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/friends" element={<ProtectedRoute element={<Friends />} />} />
          <Route path="/groups" element={<ProtectedRoute element={<Groups />} />} />
          <Route path="/groups/:id" element={<ProtectedRoute element={<GroupDetails />} />} />
          <Route path="/account" element={<ProtectedRoute element={<Account />} />} />
          
          {/* Catch-all: If a user visits an unknown URL, send them to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;