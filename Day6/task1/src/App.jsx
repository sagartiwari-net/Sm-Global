import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import RestaurantsPage from './pages/RestaurantsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import RestaurantPage from './pages/RestaurantPage'
import CollectionDetailPage from './pages/CollectionDetailPage'
import CartPage from './pages/CartPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ncr/restaurants" element={<RestaurantsPage />} />
        <Route path="/restaurants" element={<Navigate to="/ncr/restaurants" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/ncr/:slug/info" element={<RestaurantPage />} />
        <Route path="/ncr/:slug" element={<CollectionDetailPage />} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/order/:id" element={<OrderTrackingPage />} />
        <Route path="/profile" element={<Navigate to="/profile/reviews" replace />} />
        <Route path="/profile/:section" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
