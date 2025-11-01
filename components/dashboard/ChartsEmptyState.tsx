"use client";

import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, Link2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ChartsEmptyStateProps {
  onFileUpload?: (file: File) => void;
}

export function ChartsEmptyState({ onFileUpload }: ChartsEmptyStateProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleFileProcess(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleFileProcess = (file: File) => {
    const isCSV = file.name.endsWith('.csv');
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (!isCSV && !isExcel) {
      alert("Please upload a CSV or Excel file (.csv, .xlsx, .xls)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    // Call the parent's upload handler
    if (onFileUpload) {
      onFileUpload(file);
    }
  };

  const handleGoogleSheetsConnect = () => {
    alert("Google Sheets Integration Coming Soon!\n\n📋 Next Steps:\n1. Set up Google OAuth\n2. Connect to Sheets API\n3. Select your spreadsheet\n4. Import data automatically\n\nFor now, please export your sheet as CSV and upload it.");
  };

  return (
    <div 
      className="flex flex-col h-full items-center justify-center p-6 overflow-y-auto"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="w-full max-w-2xl space-y-4">
        {/* Drag and Drop Zone */}
        <Card 
          className={`border-2 border-dashed transition-all duration-300 cursor-pointer ${
            isDragging 
              ? 'border-primary bg-primary/5 scale-105 shadow-lg' 
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div 
              className={`w-14 h-14 mb-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                isDragging 
                  ? 'bg-primary text-primary-foreground scale-110' 
                  : 'bg-primary/10 text-primary'
              }`}
            >
              <Upload className="w-7 h-7" />
            </div>
            
            <h3 className="text-lg font-bold mb-2">
              {isDragging ? "Drop your file here" : "Upload Sales Data"}
            </h3>
            
            <p className="text-muted-foreground mb-3 text-sm">
              {isDragging 
                ? "Release to upload your file" 
                : "Drag and drop your CSV or Excel file here, or click to browse"
              }
            </p>

            <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                <span>CSV</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-green-700" />
                <span>Excel (.xlsx, .xls)</span>
              </div>
            </div>

            <Button 
              variant="default" 
              size="default"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>

            <p className="text-xs text-muted-foreground mt-2">
              Max: 10MB
            </p>
          </CardContent>
        </Card>

        {/* Google Sheets Connection */}
        <Card className="border-2 hover:border-primary/50 transition-all cursor-pointer hover:shadow-md">
          <CardContent className="flex items-center justify-between p-5" onClick={handleGoogleSheetsConnect}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 87.3 78"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0c9d58"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#ea4335"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#34a853"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#fbbc04"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#4285f4"/>
                </svg>
              </div>
              <div className="text-left">
                <h4 className="text-base font-semibold">Connect Google Sheets</h4>
                <p className="text-xs text-muted-foreground">
                  Import data directly from your Google Spreadsheet
                </p>
              </div>
            </div>
            <Button 
              variant="default" 
              size="default"
              onClick={(e) => {
                e.stopPropagation();
                handleGoogleSheetsConnect();
              }}
            >
              <Link2 className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

