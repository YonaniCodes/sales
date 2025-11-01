"use client";

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ChatSection } from "@/components/dashboard/ChatSection";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { AIGeneratedCharts } from "@/components/dashboard/AIGeneratedCharts";
import { RawCSVInspector } from "@/components/dashboard/RawCSVInspector";
import { SalesData } from "@/types/sales";
import { generateChartData } from "@/lib/salesAnalysis";
import { Menu, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function DashboardPage() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [chatUploadTrigger, setChatUploadTrigger] = useState<File | null>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDataUpload = (data: SalesData[]) => {
    setSalesData(data);
  };

  const handleFileUpload = (file: File) => {
    setUploadingFile(file.name);
    setUploadProgress(0);

    // Also trigger chat upload
    setChatUploadTrigger(file);

    processFile(file);
  };

  const processFile = async (file: File) => {
    // Simulate progress
    setUploadProgress(20);
    const Papa = (await import("papaparse")).default;
    const XLSX = await import("xlsx");
    const { parseSalesData, debugCSVStructure } = await import(
      "@/lib/dataParser"
    );

    const isCSV = file.name.endsWith(".csv");
    const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

    if (!isCSV && !isExcel) return;

    try {
      let parsedData: SalesData[] = [];

      if (isCSV) {
        setUploadProgress(40);
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setUploadProgress(70);

            // Debug: Check CSV structure
            const csvData = results.data as Array<Record<string, string>>;
            debugCSVStructure(csvData);

            // Use smart parser
            parsedData = parseSalesData(csvData);

            console.log(
              `Successfully parsed ${parsedData.length} valid records`
            );

            setUploadProgress(90);
            setSalesData(parsedData);

            // Complete the upload
            setTimeout(() => {
              setUploadProgress(100);
              setTimeout(() => {
                setUploadingFile(null);
              }, 1000);
            }, 300);
          },
          error: (error) => {
            console.error("CSV parsing error:", error);
            setUploadingFile(null);
            alert("Error parsing CSV file. Please check the format.");
          },
        });
      } else {
        setUploadProgress(40);
        const { parseDataDynamically } = await import("@/lib/smartDataParser");
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadProgress(60);
          const fileData = e.target?.result;
          const workbook = XLSX.read(fileData, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          setUploadProgress(80);

          // Use dynamic smart parser
          const parsedResult = parseDataDynamically(
            jsonData as Array<Record<string, string | number>>
          );

          console.log(
            `✅ Parsed ${parsedResult.summary.validRows} records from ${parsedResult.summary.totalRows} rows`
          );
          console.log(`📊 Columns detected:`, parsedResult.summary.columns);

          // Store the raw data
          parsedData = parsedResult.data as unknown as SalesData[];

          setUploadProgress(95);
          setSalesData(parsedData);

          // Complete the upload
          setTimeout(() => {
            setUploadProgress(100);
            setTimeout(() => {
              setUploadingFile(null);
            }, 1000);
          }, 300);
        };
        reader.readAsBinaryString(file);
      }
    } catch (error) {
      console.error("File processing error:", error);
      setUploadingFile(null);
      alert("Error processing file.");
    }
  };

  // Reset trigger after it's been used
  useEffect(() => {
    if (chatUploadTrigger) {
      const timer = setTimeout(() => {
        setChatUploadTrigger(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [chatUploadTrigger]);

  const handleLogout = () => {
    // Mock logout - integrate with better-auth later
    console.log("Logout clicked");
    // window.location.href = "/login";
  };

  const { lineData, barData, pieData } = generateChartData(salesData);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b bg-background lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-primary-foreground"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <span className="font-bold text-lg">SalesAI</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      )}

      <div className="flex h-full lg:h-screen">
        {/* Left Sidebar */}
        {!isSidebarCollapsed && !isMobile && (
          <aside className="w-64 border-r relative">
            <DashboardSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              onLogout={handleLogout}
            />
            {/* Collapse Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border bg-background shadow-md"
              onClick={() => setIsSidebarCollapsed(true)}
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </aside>
        )}

        {/* Sidebar Collapsed - Show Trigger */}
        {isSidebarCollapsed && !isMobile && (
          <div className="w-12 border-r flex items-start justify-center pt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(false)}
              className="h-10 w-10"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Mobile Sidebar */}
        {isMobile && (
          <>
            <aside
              className={`
                fixed inset-y-0 left-0 z-50 w-64 
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                mt-[57px]
              `}
            >
              <DashboardSidebar
                activeSection={activeSection}
                onSectionChange={(section) => {
                  setActiveSection(section);
                  setIsSidebarOpen(false);
                }}
                onLogout={handleLogout}
              />
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40 mt-[57px]"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
          </>
        )}

        {/* Main Content Area with Resizable Panels */}
        <div className="flex-1 overflow-hidden">
          {isMobile ? (
            // Mobile: Stacked layout
            <div className="flex flex-col h-full">
              <div className="h-1/2 border-b">
                <ChatSection
                  salesData={salesData}
                  onDataUpload={handleDataUpload}
                  externalFileUpload={chatUploadTrigger}
                />
              </div>
              <div className="h-1/2 bg-muted/30 overflow-y-auto">
                {uploadingFile ? (
                  <div className="flex items-center justify-center h-full">
                    <ChartsSection
                      lineData={lineData}
                      barData={barData}
                      pieData={pieData}
                      onFileUpload={handleFileUpload}
                      uploadingFile={uploadingFile}
                      uploadProgress={uploadProgress}
                    />
                  </div>
                ) : salesData.length > 0 ? (
                  <div className="p-6">
                    <RawCSVInspector />
                    <div className="mt-6">
                      <AIGeneratedCharts salesData={salesData} />
                    </div>
                  </div>
                ) : (
                  <ChartsSection
                    lineData={lineData}
                    barData={barData}
                    pieData={pieData}
                    onFileUpload={handleFileUpload}
                    uploadingFile={uploadingFile}
                    uploadProgress={uploadProgress}
                  />
                )}
              </div>
            </div>
          ) : (
            // Desktop: Resizable panels
            <PanelGroup direction="horizontal">
              {/* Chat Panel - Resizable */}
              <Panel defaultSize={35} minSize={25} maxSize={50}>
                <ChatSection
                  salesData={salesData}
                  onDataUpload={handleDataUpload}
                  externalFileUpload={chatUploadTrigger}
                />
              </Panel>

              {/* Resize Handle */}
              <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />

              {/* Charts Panel */}
              <Panel defaultSize={65} minSize={50}>
                <div className="h-full bg-muted/30 overflow-y-auto">
                  {uploadingFile ? (
                    <div className="flex items-center justify-center h-full">
                      <ChartsSection
                        lineData={lineData}
                        barData={barData}
                        pieData={pieData}
                        onFileUpload={handleFileUpload}
                        uploadingFile={uploadingFile}
                        uploadProgress={uploadProgress}
                      />
                    </div>
                  ) : salesData.length > 0 ? (
                    <div className="p-6">
                      <RawCSVInspector />
                      <div className="mt-6">
                        <AIGeneratedCharts salesData={salesData} />
                      </div>
                    </div>
                  ) : (
                    <ChartsSection
                      lineData={lineData}
                      barData={barData}
                      pieData={pieData}
                      onFileUpload={handleFileUpload}
                      uploadingFile={uploadingFile}
                      uploadProgress={uploadProgress}
                    />
                  )}
                </div>
              </Panel>
            </PanelGroup>
          )}
        </div>
      </div>
    </div>
  );
}
