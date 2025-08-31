import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  ArrowUp, 
  ArrowDown, 
  TrendingUp,
  Plus,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  RefreshCw,
  ArrowRight,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { UserAvatar } from '@/components/UserAvatar';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/lib/utils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/formatters';
import { getRandomProductImage } from '@/lib/images';
import { 
  DashboardStatsSkeleton, 
  DashboardChartSkeleton, 
  RecentActivitySkeleton, 
  RecentOrdersSkeleton, 
  TopProductsSkeleton 
} from '@/components/admin/LoadingSkeletons';

// Mock data
const monthlySalesData = [
  { name: 'Jan', revenue: 4000, orders: 2400, users: 2400 },
  { name: 'Feb', revenue: 3000, orders: 1398, users: 2210 },
  { name: 'Mar', revenue: 2000, orders: 9800, users: 2290 },
  { name: 'Apr', revenue: 2780, orders: 3908, users: 2000 },
  { name: 'May', revenue: 1890, orders: 4800, users: 2181 },
  { name: 'Jun', revenue: 2390, orders: 3800, users: 2500 },
  { name: 'Jul', revenue: 3490, orders: 4300, users: 2100 },
];

const recentOrders = [
  { id: '#ORD-1001', customer: 'John Doe', status: 'completed', amount: 254.97, date: '2023-06-15' },
  { id: '#ORD-1002', customer: 'Jane Smith', status: 'processing', amount: 129.99, date: '2023-06-16' },
  { id: '#ORD-1003', customer: 'Robert Johnson', status: 'shipped', amount: 89.98, date: '2023-06-17' },
  { id: '#ORD-1004', customer: 'Emily Davis', status: 'pending', amount: 199.97, date: '2023-06-17' },
  { id: '#ORD-1005', customer: 'Michael Brown', status: 'completed', amount: 149.99, date: '2023-06-18' },
];

const recentActivity = [
  { id: 1, user: 'John Doe', action: 'placed an order', time: '2 min ago' },
  { id: 2, user: 'Jane Smith', action: 'created an account', time: '10 min ago' },
  { id: 3, user: 'Robert Johnson', action: 'wrote a review', time: '1 hour ago' },
  { id: 4, user: 'Emily Davis', action: 'updated profile', time: '2 hours ago' },
  { id: 5, user: 'Michael Brown', action: 'purchased a product', time: '3 hours ago' },
];

const topProducts = [
  { id: 1, name: 'Classic White Shirt', category: 'Shirts', sales: 1242, revenue: 12420 },
  { id: 2, name: 'Slim Fit Jeans', category: 'Pants', sales: 856, revenue: 25680 },
  { id: 3, name: 'Leather Jacket', category: 'Outerwear', sales: 342, revenue: 23940 },
  { id: 4, name: 'Running Shoes', category: 'Footwear', sales: 721, revenue: 36050 },
];

const stats = [
  { title: 'Total Revenue', value: '$45,231.89', change: '+20.1%', trend: 'up', icon: DollarSign },
  { title: 'Total Orders', value: '2,345', change: '+12.5%', trend: 'up', icon: ShoppingBag },
  { title: 'New Customers', value: '1,234', change: '+8.2%', trend: 'up', icon: Users },
  { title: 'Products', value: '1,234', change: '-2.3%', trend: 'down', icon: Package },
];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  change: number;
  trend: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  trend 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {Icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center mt-1">
          {trend === 'up' ? (
            <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
          ) : (
            <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
          )}
          {change}% from last month
        </p>
      </CardContent>
    </Card>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, string> = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-gray-100 text-gray-800',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    completed: <CheckCircle2 className="h-3 w-3 mr-1" />,
    processing: <RefreshCw className="h-3 w-3 mr-1 animate-spin" />,
    shipped: <Truck className="h-3 w-3 mr-1" />,
    pending: <Clock className="h-3 w-3 mr-1" />,
  };

  return (
    <Badge 
      className={`${statusMap[status] || 'bg-gray-100 text-gray-800'} text-xs font-medium capitalize`}
    >
      {statusIcons[status]}
      {status}
    </Badge>
  );
};

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <DashboardStatsSkeleton />
        
        <div className="grid gap-6 md:grid-cols-2">
          <DashboardChartSkeleton />
          <DashboardChartSkeleton />
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentOrdersSkeleton />
          </div>
          <div className="space-y-6">
            <div className="rounded-lg border p-6">
              <Skeleton className="mb-6 h-6 w-48" />
              <RecentActivitySkeleton />
            </div>
            <div className="rounded-lg border p-6">
              <Skeleton className="mb-6 h-6 w-48" />
              <TopProductsSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = stats.reduce((sum, stat) => {
    if (stat.title === 'Total Revenue') {
      return sum + parseFloat(stat.value.replace(/[^0-9.-]+/g, ''));
    }
    return sum;
  }, 0);

  const totalSales = recentOrders.length;
  const completedOrders = recentOrders.filter(order => order.status === 'completed').length;
  const conversionRate = Math.round((completedOrders / totalSales) * 100) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={<stat.icon className="h-4 w-4" />}
                change={parseFloat(stat.change.replace(/[^0-9.-]+/g, ''))}
                trend={stat.trend}
              />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={monthlySalesData}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                    />
                    <Tooltip />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made {totalSales} sales this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.id} • {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        ${order.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-sm font-medium">${order.amount.toFixed(2)}</p>
                        <StatusBadge status={order.status} />
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.action} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.id} className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.sales} sold • ${product.revenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        ${(product.revenue / product.sales).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSales}</div>
                <p className="text-xs text-muted-foreground">
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversion Rate
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{conversionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  +5.3% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Now
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlySalesData}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Bar dataKey="revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Tooltip />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best selling products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.id} className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="ml-auto font-medium">
                        {product.sales} sold
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and download reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Sales Report</h3>
                    <p className="text-sm text-muted-foreground">
                      Download a detailed sales report for the selected period
                    </p>
                  </div>
                  <Button variant="outline">
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Customer Report</h3>
                    <p className="text-sm text-muted-foreground">
                      Download a detailed customer report
                    </p>
                  </div>
                  <Button variant="outline">
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Inventory Report</h3>
                    <p className="text-sm text-muted-foreground">
                      Download a detailed inventory report
                    </p>
                  </div>
                  <Button variant="outline">
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
