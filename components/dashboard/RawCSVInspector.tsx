"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export function RawCSVInspector() {
  const [rawData, setRawData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInspect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isCSV = file.name.endsWith('.csv');
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isCSV) {
      Papa.parse(file, {
        header: true,
        preview: 5, // Only parse first 5 rows
        complete: (results) => {
          setRawData({
            fileName: file.name,
            columns: results.meta.fields || [],
            sampleRows: results.data,
            totalRows: results.data.length
          });
        }
      });
    } else if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        setRawData({
          fileName: file.name,
          columns: jsonData[0] || [],
          sampleRows: jsonData.slice(1, 6).map((row: any) => {
            const obj: any = {};
            (jsonData[0] as any[]).forEach((col, idx) => {
              obj[col] = row[idx];
            });
            return obj;
          }),
          totalRows: jsonData.length - 1
        });
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
      <CardHeader>
        <CardTitle className="text-blue-600">🔬 CSV Inspector Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Button onClick={() => fileInputRef.current?.click()}>
            Inspect Your CSV File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInspect}
            className="hidden"
          />
        </div>

        {rawData && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold mb-2">📁 File: {rawData.fileName}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded">
              <p className="text-sm font-semibold mb-2">📋 EXACT Column Headers:</p>
              <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto">
                {JSON.stringify(rawData.columns, null, 2)}
              </pre>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded">
              <p className="text-sm font-semibold mb-2">📊 First 5 Rows (Raw Data):</p>
              <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto max-h-96 overflow-y-auto">
                {JSON.stringify(rawData.sampleRows, null, 2)}
              </pre>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                💡 Copy the column headers above and share them so I can fix the mapping!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

