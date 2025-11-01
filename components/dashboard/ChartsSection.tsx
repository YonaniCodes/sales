"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { ChartData } from "@/types/sales";
import { ChartsEmptyState } from "./ChartsEmptyState";
import { UploadingState } from "./UploadingState";

interface ChartsSectionProps {
  lineData: ChartData[];
  barData: ChartData[];
  pieData: ChartData[];
  onFileUpload?: (file: File) => void;
  uploadingFile?: string | null;
  uploadProgress?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export function ChartsSection({ 
  lineData, 
  barData, 
  pieData, 
  onFileUpload, 
  uploadingFile, 
  uploadProgress = 0 
}: ChartsSectionProps) {
  const hasData = lineData.length > 0 || barData.length > 0 || pieData.length > 0;

  // Show uploading state
  if (uploadingFile) {
    return (
      <UploadingState
        fileName={uploadingFile}
        progress={uploadProgress}
        isComplete={uploadProgress === 100}
      />
    );
  }

  if (!hasData) {
    return <ChartsEmptyState onFileUpload={onFileUpload} />;
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {/* Line Chart - Monthly Revenue Trend */}
      {lineData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Monthly Revenue Trend</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Bar Chart - Top Products */}
      {barData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Top Products by Revenue</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#82ca9d"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Pie Chart - Revenue by Category */}
      {pieData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Revenue by Category</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      {hasData && (
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${lineData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{pieData.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Product</p>
                <p className="text-lg font-semibold truncate">
                  {barData[0]?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg per Month</p>
                <p className="text-lg font-semibold">
                  ${lineData.length > 0 ? Math.round(lineData.reduce((sum, item) => sum + item.value, 0) / lineData.length).toLocaleString() : "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

