import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useEffect, useState, lazy, Suspense } from "react";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

// Layouts
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));

// Pages
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Callback = lazy(() => import("./pages/auth/Callback"));
const Cart = lazy(() => import("./pages/Cart"));
const Payment = lazy(() => import("./pages/Payment"));
const TestConnection = lazy(() => import("./pages/TestConnection"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CheckoutPage = lazy(() => import("@/pages/checkout/CheckoutPage"));
const OrderConfirmation = lazy(() => import("@/pages/OrderConfirmation"));

// Admin Pages
const AdminDashboard = lazy(() => import("@/pages/admin/DashboardPage"));
const UsersPage = lazy(() => import("@/pages/admin/UsersPage"));
const ProductsPage = lazy(() => import("@/pages/admin/ProductsPage"));
const OrdersPage = lazy(() => import("@/pages/admin/OrdersPage"));

const queryClient = new QueryClient();

const App = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <AuthProvider>
                    <CartProvider>
                        <Toaster />
                        <Sonner />
                        <BrowserRouter>
                            <Suspense fallback={<LoadingSpinner />}>
                                <Routes>
                                    <Route path="/" element={<Index />} />
                                    <Route path="/payment" element={<Payment />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/signup" element={
                                        <Suspense fallback={<LoadingSpinner />}>
                                            <Signup />
                                        </Suspense>
                                    } />
                                    <Route path="/auth/callback" element={
                                        <Suspense fallback={<LoadingSpinner />}>
                                            <Callback />
                                        </Suspense>
                                    } />
                                    <Route path="/test-connection" element={<TestConnection />} />
                                    <Route path="/cart" element={<Cart />} />
                                    <Route path="/checkout" element={<CheckoutPage />} />
                                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                                    <Route path="/payment" element={<Payment />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/forgot-password" element={<ForgotPassword />} />
                                    <Route path="/reset-password" element={<ResetPassword />} />
                                    
                                    {/* Admin Routes */}
                                    <Route 
                                        path="/admin" 
                                        element={
                                            <ProtectedRoute adminOnly>
                                                <AdminLayout />
                                            </ProtectedRoute>
                                        }
                                    >
                                        <Route index element={<Navigate to="dashboard" replace />} />
                                        <Route path="dashboard" element={<AdminDashboard />} />
                                        <Route path="users" element={<UsersPage />} />
                                        <Route path="products" element={<ProductsPage />} />
                                        <Route path="orders" element={<OrdersPage />} />
                                    </Route>
                                    
                                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </Suspense>
                        </BrowserRouter>
                    </CartProvider>
                </AuthProvider>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;
