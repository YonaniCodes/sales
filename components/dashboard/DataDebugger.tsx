"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { SalesData } from "@/types/sales";

interface DataDebuggerProps {
  salesData: SalesData[];
}

export function DataDebugger({ salesData }: DataDebuggerProps) {
  if (salesData.length === 0) return null;

  // Get all unique column names
  const allColumns = Object.keys(salesData[0]);
  
  // Analyze each column
  const columnAnalysis = allColumns.map(col => {
    const values = salesData.slice(0, 100).map(row => row[col]);
    const nonEmptyValues = values.filter(v => v !== null && v !== undefined && v !== "");
    const numericValues = nonEmptyValues.filter(v => !isNaN(parseFloat(String(v))));
    const uniqueValues = new Set(nonEmptyValues);
    
    const isNumeric = numericValues.length > nonEmptyValues.length * 0.7;
    const sampleValues = Array.from(uniqueValues).slice(0, 5);
    
    return {
      name: col,
      type: isNumeric ? 'number' : 'text',
      sampleValues,
      uniqueCount: uniqueValues.size,
      hasData: nonEmptyValues.length > 0
    };
  });

  // Calculate totals for numeric columns
  const numericColumns = columnAnalysis.filter(c => c.type === 'number');
  const columnTotals = numericColumns.map(col => {
    const total = salesData.reduce((sum, row) => {
      const value = parseFloat(String(row[col.name])) || 0;
      return sum + value;
    }, 0);
    return {
      column: col.name,
      total,
      average: total / salesData.length
    };
  });

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <CardTitle className="text-orange-600">Data Structure Debug Info</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-semibold mb-2">📊 Columns Found in Your CSV:</p>
          <div className="flex flex-wrap gap-2">
            {columnAnalysis.map((col, idx) => (
              <Badge 
                key={idx} 
                variant={col.type === 'number' ? 'default' : 'secondary'}
                className={col.type === 'number' ? 'bg-green-600' : ''}
              >
                {col.name} ({col.type})
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">💰 Numeric Columns (Potential Revenue/Quantity):</p>
          <div className="space-y-2">
            {columnTotals.map((col, idx) => (
              <div key={idx} className="text-xs bg-white dark:bg-gray-800 p-2 rounded">
                <strong>{col.column}:</strong> Total = {col.total.toLocaleString()}, 
                Average = {col.average.toFixed(2)}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">📝 Sample Values by Column:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {columnAnalysis.slice(0, 8).map((col, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-2 rounded">
                <strong className="text-orange-600">{col.name}:</strong>
                <div className="mt-1 text-gray-600 dark:text-gray-400">
                  {col.sampleValues.slice(0, 3).join(", ")}
                  {col.sampleValues.length > 3 && "..."}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded text-xs">
          <p className="font-semibold mb-1">🔍 Share this info:</p>
          <p>Total Columns: {allColumns.length} | 
             Numeric Columns: {numericColumns.length} | 
             Total Records: {salesData.length}</p>
        </div>
      </CardContent>
    </Card>
  );
}

