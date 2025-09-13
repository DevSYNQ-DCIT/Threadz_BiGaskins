import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, DollarSign, ArrowUp, ArrowDown, TrendingUp, User } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
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
  { id: 5, name: 'Cotton T-Shirt', category: 'Shirts', sales: 1120, revenue: 15680 },
];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  change: number;
  trend: 'up' | 'down';
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  trend 
}: StatCardProps) => {
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
        <p className="text-xs text-muted-foreground flex items-center">
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
  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    completed: { label: 'Completed', variant: 'default' },
    processing: { label: 'Processing', variant: 'secondary' },
    shipped: { label: 'Shipped', variant: 'outline' },
    pending: { label: 'Pending', variant: 'destructive' },
  };

  const statusInfo = statusMap[status.toLowerCase()] || { label: status, variant: 'outline' as const };

  return (
    <Badge variant={statusInfo.variant} className="text-xs">
      {statusInfo.label}
    </Badge>
  );
};

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid gap-4">
          <Skeleton className="h-10 w-1/3" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Skeleton className="col-span-4 h-80" />
            <Skeleton className="col-span-3 h-80" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Skeleton className="col-span-4 h-80" />
            <Skeleton className="col-span-3 h-80" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(45231.89)}
          icon={<DollarSign className="h-4 w-4" />}
          change={12.5}
          trend="up"
        />
        <StatCard
          title="Orders"
          value={"2,351"}
          icon={<ShoppingBag className="h-4 w-4" />}
          change={8.2}
          trend="up"
        />
        <StatCard
          title="Customers"
          value={"1,249"}
          icon={<Users className="h-4 w-4" />}
          change={5.7}
          trend="up"
        />
        <StatCard
          title="Products in Stock"
          value={"1,024"}
          icon={<Package className="h-4 w-4" />}
          change={-2.3}
          trend="down"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Monthly revenue and orders</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
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
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (!active || !payload || payload.length === 0) {
                        return null;
                      }
                      
                      return (
                        <div className="rounded-lg border bg-background p-4 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Revenue
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[0]?.value ? formatCurrency(Number(payload[0].value)) : 'N/A'}
                              </span>
                            </div>
                            {payload[1] && (
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Orders
                                </span>
                                <span className="font-bold">
                                  {payload[1]?.value?.toLocaleString() || 'N/A'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 5 orders from your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {order.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={order.status} />
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(order.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center">
                  <div className="mr-4 h-12 w-12 overflow-hidden rounded-md">
                    <img
                      src={getRandomProductImage()}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(product.revenue)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.sales.toLocaleString()} sold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest activities in your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
