import React from 'react';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/layouts/AdminLayout';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredRole="admin">
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Admin dashboard for managing the website" />
      </Head>
      
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Cards */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Welcome back, {user?.name}!</h2>
              <p className="text-gray-600">You have administrator privileges.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
                  Manage Users
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
                  View Analytics
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
                  Site Settings
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-2">System Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Database</span>
                  <span className="text-green-500">Online</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage</span>
                  <span>45% used</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
