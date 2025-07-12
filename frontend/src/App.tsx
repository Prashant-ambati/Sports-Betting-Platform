import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useWebSocket } from '@/hooks/useWebSocket'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Events from '@/pages/Events'
import EventDetail from '@/pages/EventDetail'
import Profile from '@/pages/Profile'
import Bets from '@/pages/Bets'
import Admin from '@/pages/Admin'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminRoute from '@/components/AdminRoute'

function App() {
  const { user, checkAuth } = useAuthStore()
  const { connect } = useWebSocket()

  useEffect(() => {
    // Check if user is authenticated on app load
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    // Connect to WebSocket if user is authenticated
    if (user) {
      connect()
    }
  }, [user, connect])

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="bets" element={<Bets />} />
          
          {/* Admin routes */}
          <Route path="admin" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />
        </Route>
      </Routes>
    </div>
  )
}

export default App 