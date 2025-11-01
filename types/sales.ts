export interface SalesData {
  id: string;
  date: string;
  product: string;
  category: string;
  quantity: number;
  revenue: number;
  region: string;
  customer: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface UploadedFile {
  name: string;
  size: number;
  data: SalesData[];
}

