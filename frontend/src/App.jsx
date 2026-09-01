import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import TicketForm from './pages/TicketForm';
import TicketDetails from './pages/TicketDetails';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-[#F8FAFC] pb-[72px] md:pb-0">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route
                path="/*"
                element={
                  <>
                    <Navbar />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/tickets" element={<TicketList />} />
                        <Route path="/tickets/new" element={<TicketForm />} />
                        <Route path="/tickets/:id" element={<TicketDetails />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/profile" element={<Profile />} />
                      </Routes>
                    </main>
                    <BottomNav />
                  </>
                }
              />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
