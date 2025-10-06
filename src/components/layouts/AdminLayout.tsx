import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return router.pathname.startsWith(path) ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white h-screen w-64 fixed left-0 top-0 overflow-y-auto">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        
        <nav className="mt-6">
          <div className="px-2 space-y-1">
            <Link href="/admin" passHref>
              <div className={`flex items-center px-4 py-3 text-sm font-medium rounded-md cursor-pointer ${isActive('/admin') && 'bg-gray-900'}`}>
                <span className="ml-3">Dashboard</span>
              </div>
            </Link>
            
            <Link href="/admin/users" passHref>
              <div className={`flex items-center px-4 py-3 text-sm font-medium rounded-md cursor-pointer ${isActive('/admin/users') && 'bg-gray-900'}`}>
                <span className="ml-3">Users</span>
              </div>
            </Link>
            
            <Link href="/admin/products" passHref>
              <div className={`flex items-center px-4 py-3 text-sm font-medium rounded-md cursor-pointer ${isActive('/admin/products') && 'bg-gray-900'}`}>
                <span className="ml-3">Products</span>
              </div>
            </Link>
            
            <Link href="/admin/orders" passHref>
              <div className={`flex items-center px-4 py-3 text-sm font-medium rounded-md cursor-pointer ${isActive('/admin/orders') && 'bg-gray-900'}`}>
                <span className="ml-3">Orders</span>
              </div>
            </Link>
            
            <div className="border-t border-gray-700 my-4"></div>
            
            <Link href="/" passHref>
              <div className="flex items-center px-4 py-3 text-sm font-medium rounded-md cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white">
                <span className="ml-3">Back Home</span>
              </div>
            </Link>
            
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
            >
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="ml-64 min-h-screen">
        {/* Top navigation */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {router.pathname.split('/').pop()?.charAt(0).toUpperCase() + 
               router.pathname.split('/').pop()?.slice(1) || 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
