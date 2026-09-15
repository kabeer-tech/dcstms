import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './hooks/useNotifications';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import TicketForm from './pages/TicketForm';
import TicketDetails from './pages/TicketDetails';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Departments from './pages/Departments';
import Analytics from './pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900 overflow-x-hidden max-w-[100vw]">
            <Routes>
              <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route
                  path="/*"
                  element={
                    <div className="flex w-full max-w-[100vw]">
                      <Sidebar />
                      <div className="flex-1 md:ml-64 flex flex-col min-h-screen pb-[72px] md:pb-0 w-full max-w-[100vw]">
                        <Navbar />
                        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[100vw] overflow-x-hidden">
                          <div className="max-w-7xl mx-auto w-full h-full">
                            <Routes>
                              <Route path="/dashboard" element={<Dashboard />} />
                              <Route path="/tickets" element={<TicketList />} />
                              <Route path="/tickets/new" element={<TicketForm />} />
                              <Route path="/tickets/:id" element={<TicketDetails />} />
                              <Route path="/notifications" element={<Notifications />} />
                              <Route path="/profile" element={<Profile />} />
                              
                              <Route path="/users" element={<Users />} />
                              <Route path="/departments" element={<Departments />} />
                              <Route path="/analytics" element={<Analytics />} />
                            </Routes>
                          </div>
                        </main>
                      </div>
                      <BottomNav />
                    </div>
                  }
                />
              </Route>
            </Routes>
          </div>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
