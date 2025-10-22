'use client';

import { useState, useEffect, useMemo } from 'react';
import GlobalNavbar from '@/components/globalNavbar';
import { transaction } from '@/type/allType';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyzePage() {
  const [viewType, setViewType] = useState<'month' | 'year'>('month');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState<{ name: string; income: number; expense: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      let query = `?year=${currentYear}`;
      if (viewType === 'month') {
        const monthString = currentMonth.toString().padStart(2, '0');
        query += `&month=${monthString}`;
      }

      const url = `/api/transactions${query}`;
      console.log('Fetching data from:', url);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const apiData = await response.json();
        const apiDataArray: transaction[] = apiData.data;

        const transformedData = apiDataArray.reduce((acc, item) => {
          const key = viewType === 'month'
            ? new Date(item.created_at).getDate() // Group by day
            : new Date(item.created_at).getMonth() + 1; // Group by month

          const existing = acc.find((entry) => entry.name === String(key));
          if (existing) {
            existing.income += item.type === 'income' ? item.amount : 0;
            existing.expense += item.type === 'expense' ? item.amount : 0;
          } else {
            acc.push({
              name: viewType === 'month' ? String(key) : new Date(0, key - 1).toLocaleString('default', { month: 'long' }),
              income: item.type === 'income' ? item.amount : 0,
              expense: item.type === 'expense' ? item.amount : 0,
            });
          }
          return acc;
        }, [] as { name: string; income: number; expense: number }[]);

        setData(transformedData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [viewType, currentYear, currentMonth]);

  const summary = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        acc.totalIncome += item.income || 0;
        acc.totalExpense += item.expense || 0;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, netProfit: 0 }
    );
  }, [data]);

  summary.netProfit = summary.totalIncome - summary.totalExpense;

  const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));

  return (
    <div>
      <GlobalNavbar />
      <main className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Analyze</h1>
          <div className="flex flex-wrap gap-2">
            <Select
              value={viewType}
              onValueChange={(val) => setViewType(val as 'month' | 'year')}
            >
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Select View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">รายเดือน</SelectItem>
                <SelectItem value="year">รายปี</SelectItem>
              </SelectContent>
            </Select>

            {viewType === 'month' && (
              <Select
                value={String(currentMonth)}
                onValueChange={(val) => setCurrentMonth(Number(val))}
              >
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((month) => (
                    <SelectItem key={month.value} value={String(month.value)}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select
              value={String(currentYear)}
              onValueChange={(val) => setCurrentYear(Number(val))}
            >
              <SelectTrigger className="w-full md:w-[120px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin" />
          </div>
        ) : (
          <>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-2/3">
                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>
                      สรุปรายรับ-รายจ่าย
                      {viewType === 'month'
                        ? ` ประจำเดือน ${monthOptions.find(m => m.value === currentMonth)?.label} ${currentYear}`
                        : ` ประจำปี ${currentYear}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px] pr-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="income" fill="#22c55e" name="รายรับ" />
                        <Bar dataKey="expense" fill="#ef4444" name="รายจ่าย" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full lg:w-1/3 flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Income</CardTitle>
                    <CardDescription>รายรับรวม</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">
                      ฿{summary.totalIncome.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Expense</CardTitle>
                    <CardDescription>รายจ่ายรวม</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-red-600">
                      ฿{summary.totalExpense.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Net Profit</CardTitle>
                    <CardDescription>คงเหลือสุทธิ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-3xl font-bold ${summary.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      ฿{summary.netProfit.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
