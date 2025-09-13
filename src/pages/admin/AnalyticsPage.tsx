import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Activity,
  RefreshCw,
  Calendar as CalendarIcon,
  Download,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format, subMonths } from 'date-fns';
import { formatCurrency } from '@/lib/formatters';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const AnalyticsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subMonths(new Date(), 6),
    to: new Date(),
  });

  // Mock data for charts with date filtering
  const getFilteredData = useCallback(<T extends { date: string }>(data: T[]): T[] => {
    if (!dateRange.from || !dateRange.to) return data;

    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= dateRange.from! && itemDate <= dateRange.to!;
    });
  }, [dateRange]);

  // Simulate API call when date range changes
  useEffect(() => {
    if (!dateRange.from || !dateRange.to) return;

    const fetchData = async () => {
      setIsFiltering(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsFiltering(false);
    };

    fetchData();
  }, [dateRange]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
    } else {
      setDateRange({ from: undefined, to: undefined });
    }
  };

  // Mock data with date properties for filtering
  const monthlyRevenueData = useMemo(() => [
    { name: 'Jan', revenue: 4000, date: '2025-01-01' },
    { name: 'Feb', revenue: 3000, date: '2025-02-01' },
    { name: 'Mar', revenue: 2000, date: '2025-03-01' },
    { name: 'Apr', revenue: 2780, date: '2025-04-01' },
    { name: 'May', revenue: 1890, date: '2025-05-01' },
    { name: 'Jun', revenue: 2390, date: '2025-06-01' },
    { name: 'Jul', revenue: 3490, date: '2025-07-01' },
  ], []);

  const salesByDesignData = useMemo(() => [
    { name: 'Casual', value: 400, date: '2025-07-01' },
    { name: 'Formal', value: 300, date: '2025-07-01' },
    { name: 'Traditional', value: 200, date: '2025-07-01' },
    { name: 'Sportswear', value: 100, date: '2025-07-01' },
  ], []);

  const ordersOverTimeData = useMemo(() => [
    { name: 'Week 1', orders: 20, date: '2025-06-01' },
    { name: 'Week 2', orders: 35, date: '2025-06-08' },
    { name: 'Week 3', orders: 25, date: '2025-06-15' },
    { name: 'Week 4', orders: 40, date: '2025-06-22' },
  ], []);

  const topProductsData = useMemo(() => [
    { id: 1, name: 'Classic White Shirt', sales: 1242, revenue: 12420, date: '2025-07-01' },
    { id: 2, name: 'Slim Fit Jeans', sales: 856, revenue: 25680, date: '2025-07-01' },
    { id: 3, name: 'Leather Jacket', sales: 342, revenue: 23940, date: '2025-07-01' },
    { id: 4, name: 'Running Shoes', sales: 721, revenue: 36050, date: '2025-07-01' },
  ], []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleExport = (format: 'pdf' | 'csv') => {
    setExportLoading(true);
    // Simulate export
    setTimeout(() => {
      setExportLoading(false);
      alert(`Exporting report as ${format.toUpperCase()}...`);
    }, 1000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  // Get filtered data
  const filteredRevenueData = getFilteredData(monthlyRevenueData);
  const filteredSalesByDesign = getFilteredData(salesByDesignData);
  const filteredOrdersOverTime = getFilteredData(ordersOverTimeData);
  const filteredTopProducts = getFilteredData(topProductsData);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !dateRange && 'text-muted-foreground'
                  )}
                  disabled={isFiltering}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {isFiltering ? (
                    <span>Filtering...</span>
                  ) : dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd, y')} -{' '}
                        {format(dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDateRange({ from: undefined, to: undefined })}
              title="Reset date range"
              disabled={isFiltering}
            >
              <RefreshCw className={`h-4 w-4 ${isFiltering ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport('csv')}
              disabled={exportLoading || isFiltering}
              className="w-full sm:w-auto"
            >
              {exportLoading ? 'Exporting...' : 'Export CSV'}
            </Button>
            <Button
              variant="default"
              onClick={() => handleExport('pdf')}
              disabled={exportLoading || isFiltering}
              className="w-full sm:w-auto"
            >
              {exportLoading ? 'Exporting...' : 'Export PDF'}
            </Button>
          </div>
        </div>
      </div>

      {isFiltering ? (
        <div className="flex justify-center items-center p-12">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-8 w-8 animate-spin" />
            <p className="text-sm text-muted-foreground">Loading data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Statistics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    filteredRevenueData.reduce((sum, item) => sum + item.revenue, 0)
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+20.1%</span> from last period
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
                <div className="text-2xl font-bold">
                  {filteredOrdersOverTime.reduce((sum, item) => sum + item.orders, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+12.5%</span> from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  New Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(Math.random() * 1000).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+8.2%</span> from last period
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
                <div className="text-2xl font-bold">
                  {Math.random().toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+0.5%</span> from last period
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6">
            {/* Monthly Revenue - Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue generated over the selected period</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Sales by Design Type - Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Design Type</CardTitle>
                  <CardDescription>Distribution of sales across different design types</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={filteredSalesByDesign}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {filteredSalesByDesign.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Sales']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Orders Over Time - Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Orders Over Time</CardTitle>
                  <CardDescription>Number of orders over the selected period</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredOrdersOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Products - Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>Best performing products by revenue</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                          <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Sales</th>
                          <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {filteredTopProducts.map((product) => (
                          <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle font-medium">{product.name}</td>
                            <td className="p-4 text-right align-middle">{product.sales.toLocaleString()}</td>
                            <td className="p-4 text-right align-middle font-medium">
                              {formatCurrency(product.revenue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
