import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Festivals } from './pages/Festivals';
import { FestivalDetails } from './pages/FestivalDetails';
import { Competitions } from './pages/Competitions';
import { CompetitionDetails } from './pages/CompetitionDetails';
import { Announcements } from './pages/Announcements';
import { Webinars } from './pages/Webinars';
import { WebinarDetails } from './pages/WebinarDetails';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { SuperAdmin } from './pages/SuperAdmin';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/festivals" element={<Festivals />} />
                <Route path="/festivals/:id" element={<FestivalDetails />} />
                <Route path="/competitions" element={<Competitions />} />
                <Route path="/competitions/:id" element={<CompetitionDetails />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/webinars" element={<Webinars />} />
                <Route path="/webinars/:id" element={<WebinarDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Student Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Dashboard */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />

                {/* Super Admin Control Center */}
                <Route path="/super-admin" element={<SuperAdmin />} />
                <Route path="/nahz" element={<Navigate to="/super-admin" replace />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
