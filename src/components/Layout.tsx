import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, CreditCard, History, Bell, User, LayoutDashboard, MessageCircle, Scan } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: 'member' | 'admin';
}

export default function Layout({ children, userRole = 'member' }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'হোম', path: '/' },
    { icon: CreditCard, label: 'আইডি কার্ড', path: '/id-card' },
    { icon: History, label: 'সঞ্চয়', path: '/savings' },
    { icon: MessageCircle, label: 'বার্তা', path: '/messages' },
    { icon: User, label: 'প্রোফাইল', path: '/profile' },
  ];

  const adminNavItems = [
    { icon: LayoutDashboard, label: 'ড্যাশবোর্ড', path: '/admin' },
    { icon: Bell, label: 'নোটিশ', path: '/admin/notices' },
    { icon: Scan, label: 'যাচাই', path: '/verify' },
  ];

  const handleLogout = () => {
    import('../lib/firebase').then(({ auth }) => auth.signOut());
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20 font-sans selection:bg-green-100">
      {/* No Ads Notice (Invisible but in code/metadata) */}
      {/* This application is strictly for Kahena Youth Organization and does not permit unauthorized advertisements. */}
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="কাহেনা যুব সংগঠন" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
          <h1 className="text-blue-900 font-bold text-lg leading-tight">
            কাহেনা যুব সংগঠন
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative" id="notification-btn">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="লগ আউট"
          >
            <User size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-20 px-2 flex items-center justify-around z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 p-2 rounded-xl transition-all
              ${isActive ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-gray-600'}
            `}
          >
            <item.icon size={22} weight={location.pathname === item.path ? 'fill' : 'regular'} />
            <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
