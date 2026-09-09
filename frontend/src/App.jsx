import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import TicketForm from './pages/TicketForm';
import TicketDetails from './pages/TicketDetails';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

// Import the new Admin Pages
import Users from './pages/Users';
import Departments from './pages/Departments';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route
                path="/*"
                element={
                  <div className="flex">
                    <Sidebar />
                    <div className="flex-1 md:ml-64 flex flex-col min-h-screen pb-[72px] md:pb-0">
                      <Navbar />
                      <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <div className="max-w-7xl mx-auto w-full h-full">
                          <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/tickets" element={<TicketList />} />
                            <Route path="/tickets/new" element={<TicketForm />} />
                            <Route path="/tickets/:id" element={<TicketDetails />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/profile" element={<Profile />} />
                            
                            {/* New Admin Routes */}
                            <Route path="/users" element={<Users />} />
                            <Route path="/departments" element={<Departments />} />
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;