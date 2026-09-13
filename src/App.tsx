import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CategoryList } from './components/CategoryList';
import { BottomNavigation } from './components/BottomNavigation';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { MenuDrawer } from './components/MenuDrawer';
import { NotificationsModal } from './components/NotificationsModal';
import { AdminModal } from './components/AdminModal';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Orders } from './pages/Orders';
import { Favorites } from './pages/Favorites';
import { Profile } from './pages/Profile';

const AppContent: React.FC = () => {
  const {
    activeTab,
    selectedProductForModal,
    setSelectedProductForModal,
  } = useApp();

  return (
    <div className="min-h-screen bg-[#f8f6fb] text-zinc-800 flex flex-col selection:bg-amber-400 selection:text-purple-950">
      {/* Toast Feedback notifications */}
      <ToastContainer />

      {/* Main Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto">
        {activeTab === 'home' && (
          <>
            <CategoryList />
            <Home />
          </>
        )}

        {activeTab === 'menu' && <Menu />}
        {activeTab === 'orders' && <Orders />}
        {activeTab === 'favorites' && <Favorites />}
        {activeTab === 'profile' && <Profile />}
      </main>

      {/* Bottom Mobile App Navigation */}
      <BottomNavigation />

      {/* Modals and Overlays */}
      <ProductModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />

      <CartDrawer />
      <CheckoutModal />
      <MenuDrawer />
      <NotificationsModal />
      <AdminModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
