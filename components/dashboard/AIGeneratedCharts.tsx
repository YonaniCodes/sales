"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, AlertCircle, Lightbulb, BarChart3 } from "lucide-react";
import { SalesData } from "@/types/sales";
import { DataDebugger } from "./DataDebugger";
import { useEffect, useState } from "react";

interface AIAnalysis {
  insights: {
    summary: string;
    key_metrics: {
      total_revenue?: number | null;
      total_records: number;
      best_category?: string | null;
      best_region?: string | null;
      date_range?: string;
    };
    recommendations: string[];
  };
  charts: Array<{
    type: "bar" | "line" | "pie";
    title: string;
    description: string;
    xField: string;
    yField: string;
    aggregation: "sum" | "count" | "average";
  }>;
}

interface AIGeneratedChartsProps {
  salesData: SalesData[];
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export function AIGeneratedCharts({ salesData }: AIGeneratedChartsProps) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (salesData.length > 0) {
      analyzeData();
    }
  }, [salesData]);

  const analyzeData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salesData }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze data");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (chart: AIAnalysis["charts"][0]) => {
    const { xField, yField, aggregation } = chart;
    
    // Group data by xField
    const grouped = salesData.reduce((acc: Record<string, { name: string; values: number[] }>, item: Record<string, any>) => {
      const key = String(item[xField] || "Unknown");
      if (!acc[key]) {
        acc[key] = { name: key, values: [] };
      }
      
      // Get the value for yField
      let value = 0;
      if (yField === "revenue" || yField === "quantity") {
        value = parseFloat(item[yField]) || 0;
      } else {
        value = parseFloat(item[yField]) || 1; // For counts, use 1
      }
      
      acc[key].values.push(value);
      return acc;
    }, {});

    // Apply aggregation and sort by value
    const chartData = Object.values(grouped).map((group) => {
      let value = 0;
      if (aggregation === "sum") {
        value = group.values.reduce((a, b) => a + b, 0);
      } else if (aggregation === "average") {
        value = group.values.reduce((a, b) => a + b, 0) / group.values.length;
      } else if (aggregation === "count") {
        value = group.values.length;
      }
      return { name: group.name, value: Math.round(value) };
    });

    // Sort by value descending and take top 10 for better visualization
    return chartData
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .filter(item => item.value > 0); // Filter out zero values
  };

  const renderChart = (chart: AIAnalysis["charts"][0], index: number) => {
    const data = prepareChartData(chart);

    if (data.length === 0) {
      return (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-base">{chart.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No data available for this chart</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={index}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">{chart.title}</CardTitle>
          </div>
          <CardDescription className="text-xs">{chart.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            {chart.type === "bar" && (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
            {chart.type === "line" && (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
              </LineChart>
            )}
            {chart.type === "pie" && (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8b5cf6"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  if (salesData.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Debug Info - Shows actual column structure */}
      <DataDebugger salesData={salesData} />

      {/* AI Insights Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <CardTitle>AI-Generated Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{analysis.insights.summary}</p>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {analysis.insights.key_metrics.total_revenue && (
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-lg font-bold">${analysis.insights.key_metrics.total_revenue.toLocaleString()}</p>
              </div>
            )}
            <div className="bg-background/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Records</p>
              <p className="text-lg font-bold">{analysis.insights.key_metrics.total_records}</p>
            </div>
            {analysis.insights.key_metrics.best_category && (
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Top Category</p>
                <p className="text-sm font-semibold truncate">{analysis.insights.key_metrics.best_category}</p>
              </div>
            )}
            {analysis.insights.key_metrics.best_region && (
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Top Region</p>
                <p className="text-sm font-semibold truncate">{analysis.insights.key_metrics.best_region}</p>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold">Recommendations</p>
            </div>
            <div className="space-y-2">
              {analysis.insights.recommendations.map((rec, idx) => (
                <Badge key={idx} variant="secondary" className="mr-2">
                  {rec}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI-Generated Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysis.charts.map((chart, idx) => renderChart(chart, idx))}
      </div>
    </div>
  );
}

