import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingBag, 
  LogOut, 
  Settings,
  BarChart2,
  Bell,
  Plus,
  Moon,
  Sun,
  Search,
  ChevronDown,
  User,
  Menu,
  X,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { name: 'Customers', path: '/admin/users', icon: Users },
  { name: 'Consultations', path: '/admin/consultations', icon: Calendar },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check for dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                  (!('darkMode' in localStorage) && 
                   window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className={cn(
      "min-h-screen bg-background text-foreground transition-colors",
      darkMode ? "dark bg-gray-900" : "bg-gray-50"
    )}>
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div className="fixed inset-0 bg-black/20" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-background">
              <div className="h-full overflow-y-auto py-6">
                <div className="px-4">
                  <h1 className="text-xl font-bold">Admin Panel</h1>
                </div>
                <nav className="mt-6 space-y-1 px-4">
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                        location.pathname === item.path
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground/80 hover:bg-accent/50'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={async () => {
                    try {
                      await logout();
                      setMobileMenuOpen(false);
                      navigate('/login');
                    } catch (error) {
                      console.error('Logout failed:', error);
                    }
                  }}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
          <div className="flex grow flex-col overflow-y-auto border-r bg-background px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-4">
                {sidebarItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={cn(
                        'group flex items-center rounded-md px-3 py-2 text-sm font-medium',
                        location.pathname === item.path
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground/80 hover:bg-accent/50 hover:text-foreground'
                      )}
                    >
                      <item.icon 
                        className={cn(
                          'mr-3 h-5 w-5 flex-shrink-0',
                          location.pathname === item.path 
                            ? 'text-primary' 
                            : 'text-foreground/60 group-hover:text-foreground'
                        )} 
                        aria-hidden="true" 
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={async () => {
                    try {
                      await logout();
                      navigate('/login');
                    } catch (error) {
                      console.error('Logout failed:', error);
                    }
                  }}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 w-full">
          {/* Top navigation */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/95 backdrop-blur px-4 lg:px-8">
            <div className="hidden lg:block w-full max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-lg border-0 bg-muted/50 py-1.5 pl-10 pr-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            
            <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden lg:flex"
                onClick={toggleDarkMode}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
              </Button>
              
              <div className="relative">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-x-2"
                  onClick={() => navigate('/admin/settings')}
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden lg:inline-flex items-center">
                    {user?.name || 'Admin'}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <main className="py-6 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
