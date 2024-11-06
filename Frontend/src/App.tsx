import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeLanguageProvider } from './contexts/ThemeLanguageContext';
import { ReviewProvider } from './contexts/ReviewContext';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Memberships from './pages/Memberships';
import AccountSettings from './pages/AccountSettings';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BrandPage from './pages/BrandPage';
import Payment from './pages/Payment';
import Products from './pages/Products';
import Info from './pages/Info';
import Support from './pages/Support';
import { CartProvider } from './contexts/CartContext';
import ForgotPassword from './pages/ForgotPassword';
import SearchPage from './pages/SearchPage';
import PaymentProduct from './pages/PaymentProduct';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeLanguageProvider>
          <ReviewProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <Header />
                <Navbar />
                <main className="flex-1 p-4">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/info" element={<Info />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/productdetails/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/memberships" element={<Memberships />} />
                    <Route path="/accountsettings" element={<AccountSettings />} />
                    <Route path="/company-dashboard" element={<CompanyDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/brand/:brandName" element={<BrandPage />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/forgotpassword" element={<ForgotPassword />}/>
                    <Route path= "/search" element={<SearchPage />}/>
                    <Route path="/paymentproduct" element={<PaymentProduct/>}/>
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </ReviewProvider>
        </ThemeLanguageProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;