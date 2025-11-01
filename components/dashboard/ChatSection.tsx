"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Message, SalesData } from "@/types/sales";
import { chatWithGemini } from "@/lib/gemini";
import { parseDataDynamically } from "@/lib/smartDataParser";
import Papa from "papaparse";
import * as XLSX from "xlsx";

interface ChatSectionProps {
  salesData: SalesData[];
  onDataUpload: (data: SalesData[]) => void;
  externalFileUpload?: File | null;
}

const preloadedPrompts = [
  "Show me total revenue and key metrics",
  "What are my top performing products?",
  "Analyze revenue by region",
  "Show me monthly sales trends",
  "Break down revenue by category",
];

export function ChatSection({
  salesData,
  onDataUpload,
  externalFileUpload,
}: ChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "👋 Hello! I'm your Sales AI Assistant. Upload your sales data to get started, or try one of the suggested prompts below!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle external file upload from drag & drop
  useEffect(() => {
    if (externalFileUpload) {
      const syntheticEvent = {
        target: {
          files: [externalFileUpload],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(syntheticEvent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalFileUpload]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isCSV = file.name.endsWith(".csv");
    const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

    if (!isCSV && !isExcel) {
      alert("Please upload a CSV or Excel file");
      return;
    }

    // Add user message about file upload
    const uploadMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `📎 Uploaded: ${file.name}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, uploadMessage]);
    setIsTyping(true);

    try {
      let parsedData: SalesData[] = [];

      if (isCSV) {
        // Parse CSV
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (results) => {
            // Use smart dynamic parser
            const parsedResult = parseDataDynamically(
              results.data as Array<Record<string, string | number>>
            );
            parsedData = parsedResult.data as unknown as SalesData[];

            console.log("CSV parsing complete:", parsedResult.summary);

            onDataUpload(parsedData);

            setTimeout(() => {
              setIsTyping(false);
              setMessages((prev) => [
                ...prev,
                {
                  id: (Date.now() + 1).toString(),
                  role: "assistant",
                  content: `✅ Successfully loaded ${parsedData.length} sales records! I'm ready to analyze your data. Try asking me about revenue trends, top products, or regional performance.`,
                  timestamp: new Date(),
                },
              ]);
            }, 1000);
          },
          error: (error) => {
            console.error("CSV parsing error:", error);
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content:
                  "❌ Sorry, there was an error parsing your CSV file. Please make sure it has the correct format.",
                timestamp: new Date(),
              },
            ]);
          },
        });
      } else {
        // Parse Excel
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileData = e.target?.result;
          const workbook = XLSX.read(fileData, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          // Use smart dynamic parser
          const parsedResult = parseDataDynamically(
            jsonData as Array<Record<string, string | number>>
          );
          parsedData = parsedResult.data as unknown as SalesData[];

          console.log("Excel parsing complete:", parsedResult.summary);

          onDataUpload(parsedData);

          setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: `✅ Successfully loaded ${parsedData.length} sales records! I'm ready to analyze your data. Try asking me about revenue trends, top products, or regional performance.`,
                timestamp: new Date(),
              },
            ]);
          }, 1000);
        };
        reader.readAsBinaryString(file);
      }
    } catch (error) {
      console.error("File upload error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "❌ Sorry, there was an error processing your file.",
          timestamp: new Date(),
        },
      ]);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Get AI response from Gemini
      const response = await chatWithGemini(text, salesData);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const err = error as Error;
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `❌ Sorry, I encountered an error: ${
          err.message || "Unknown error"
        }. ${
          err.message?.includes("API key")
            ? "\n\nPlease make sure you've added your Gemini API key to the .env.local file."
            : ""
        }`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Sales AI Assistant</h2>
            <p className="text-xs text-muted-foreground">
              {salesData.length > 0
                ? `Analyzing ${salesData.length} records`
                : "Ready to analyze your data"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preloaded Prompts */}
      {messages.length <= 2 && (
        <div className="p-4 border-t bg-muted/50 shrink-0">
          <p className="text-xs font-medium mb-2 text-muted-foreground">
            Suggested prompts:
          </p>
          <div className="flex flex-wrap gap-2">
            {preloadedPrompts.map((prompt, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t shrink-0">
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            title="Upload CSV or Excel"
          >
            <Upload className="w-4 h-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask me anything about your sales data..."
            className="flex-1"
          />
          <Button onClick={() => handleSendMessage()} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
