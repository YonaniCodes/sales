"use client";

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ChatSection } from "@/components/dashboard/ChatSection";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { SalesData } from "@/types/sales";
import { generateChartData } from "@/lib/salesAnalysis";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    processFile(file);
  };

  const processFile = async (file: File) => {
    const Papa = (await import("papaparse")).default;
    const XLSX = await import("xlsx");

    const isCSV = file.name.endsWith(".csv");
    const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

    if (!isCSV && !isExcel) return;

    try {
      let parsedData: SalesData[] = [];

      if (isCSV) {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            parsedData = (results.data as Record<string, string>[]).map(
              (row, index: number) => ({
                id: row.id || index.toString(),
                date: row.date || row.Date || new Date().toISOString(),
                product: row.product || row.Product || "Unknown",
                category: row.category || row.Category || "General",
                quantity: parseFloat(row.quantity || row.Quantity || "0"),
                revenue: parseFloat(
                  row.revenue || row.Revenue || row.amount || row.Amount || "0"
                ),
                region: row.region || row.Region || "Unknown",
                customer: row.customer || row.Customer || "Unknown",
              })
            );

            setSalesData(parsedData);
          },
          error: (error) => {
            console.error("CSV parsing error:", error);
            alert("Error parsing CSV file. Please check the format.");
          },
        });
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          parsedData = (jsonData as Record<string, string>[]).map(
            (row, index: number) => ({
              id: row.id || index.toString(),
              date: row.date || row.Date || new Date().toISOString(),
              product: row.product || row.Product || "Unknown",
              category: row.category || row.Category || "General",
              quantity: parseFloat(row.quantity || row.Quantity || "0"),
              revenue: parseFloat(
                row.revenue || row.Revenue || row.amount || row.Amount || "0"
              ),
              region: row.region || row.Region || "Unknown",
              customer: row.customer || row.Customer || "Unknown",
            })
          );

          setSalesData(parsedData);
        };
        reader.readAsBinaryString(file);
      }
    } catch (error) {
      console.error("File processing error:", error);
      alert("Error processing file.");
    }
  };

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
        <aside
          className={`
            fixed lg:relative inset-y-0 left-0 z-50 
            w-64 transform transition-transform duration-300 ease-in-out
            lg:transform-none lg:translate-x-0
            ${
              isMobile && isSidebarOpen
                ? "translate-x-0"
                : isMobile
                ? "-translate-x-full"
                : ""
            }
            ${isMobile ? "mt-[57px]" : ""}
          `}
        >
          <DashboardSidebar
            activeSection={activeSection}
            onSectionChange={(section) => {
              setActiveSection(section);
              if (isMobile) setIsSidebarOpen(false);
            }}
            onLogout={handleLogout}
          />
        </aside>

        {/* Overlay for mobile */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden mt-[57px]"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Middle - Chat Section */}
          <div className="w-full lg:w-2/5 xl:w-1/3 h-1/2 lg:h-full border-r">
            <ChatSection
              salesData={salesData}
              onDataUpload={handleDataUpload}
            />
          </div>

          {/* Right - Charts Section */}
          <div className="w-full lg:w-3/5 xl:w-2/3 h-1/2 lg:h-full bg-muted/30">
            <ChartsSection
              lineData={lineData}
              barData={barData}
              pieData={pieData}
              onFileUpload={handleFileUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
