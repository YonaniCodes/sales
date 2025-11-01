import { SalesData, ChartData } from "@/types/sales";

export function analyzeSalesData(data: SalesData[], query: string): string {
  if (!data || data.length === 0) {
    return "No data available. Please upload a CSV or Excel file with your sales data.";
  }

  const lowerQuery = query.toLowerCase();

  // Total revenue analysis
  if (lowerQuery.includes("total revenue") || lowerQuery.includes("total sales")) {
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    return `The total revenue from your sales data is $${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} across ${data.length} transactions.`;
  }

  // Average analysis
  if (lowerQuery.includes("average") || lowerQuery.includes("avg")) {
    const avgRevenue = data.reduce((sum, item) => sum + item.revenue, 0) / data.length;
    const avgQuantity = data.reduce((sum, item) => sum + item.quantity, 0) / data.length;
    return `Average revenue per transaction: $${avgRevenue.toFixed(2)}\nAverage quantity sold: ${avgQuantity.toFixed(2)} units`;
  }

  // Top products
  if (lowerQuery.includes("top product") || lowerQuery.includes("best selling") || lowerQuery.includes("most popular")) {
    const productRevenue = new Map<string, number>();
    data.forEach(item => {
      productRevenue.set(item.product, (productRevenue.get(item.product) || 0) + item.revenue);
    });
    const topProducts = Array.from(productRevenue.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    return `Top 5 products by revenue:\n${topProducts.map((p, i) => `${i + 1}. ${p[0]}: $${p[1].toFixed(2)}`).join('\n')}`;
  }

  // Regional analysis
  if (lowerQuery.includes("region") || lowerQuery.includes("location") || lowerQuery.includes("area")) {
    const regionRevenue = new Map<string, number>();
    data.forEach(item => {
      regionRevenue.set(item.region, (regionRevenue.get(item.region) || 0) + item.revenue);
    });
    const regions = Array.from(regionRevenue.entries()).sort((a, b) => b[1] - a[1]);
    
    return `Revenue by region:\n${regions.map((r, i) => `${i + 1}. ${r[0]}: $${r[1].toFixed(2)}`).join('\n')}`;
  }

  // Monthly trend
  if (lowerQuery.includes("trend") || lowerQuery.includes("month") || lowerQuery.includes("time")) {
    const monthlyRevenue = new Map<string, number>();
    data.forEach(item => {
      const month = new Date(item.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyRevenue.set(month, (monthlyRevenue.get(month) || 0) + item.revenue);
    });
    const sorted = Array.from(monthlyRevenue.entries()).sort((a, b) => 
      new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );
    
    return `Monthly revenue trend:\n${sorted.map(m => `${m[0]}: $${m[1].toFixed(2)}`).join('\n')}`;
  }

  // Category analysis
  if (lowerQuery.includes("category") || lowerQuery.includes("categories")) {
    const categoryRevenue = new Map<string, number>();
    data.forEach(item => {
      categoryRevenue.set(item.category, (categoryRevenue.get(item.category) || 0) + item.revenue);
    });
    const categories = Array.from(categoryRevenue.entries()).sort((a, b) => b[1] - a[1]);
    
    return `Revenue by category:\n${categories.map(c => `${c[0]}: $${c[1].toFixed(2)}`).join('\n')}`;
  }

  // Default response
  return `I analyzed your sales data with ${data.length} transactions. You can ask me about:\n- Total revenue or sales\n- Average metrics\n- Top products\n- Regional performance\n- Monthly trends\n- Category breakdown\n\nTry asking: "What are the top products?" or "Show me regional performance"`;
}

export function generateChartData(data: SalesData[]): {
  lineData: ChartData[];
  barData: ChartData[];
  pieData: ChartData[];
} {
  if (!data || data.length === 0) {
    return {
      lineData: [],
      barData: [],
      pieData: []
    };
  }

  // Line chart: Monthly revenue trend
  const monthlyRevenue = new Map<string, number>();
  data.forEach(item => {
    const month = new Date(item.date).toLocaleString('default', { month: 'short' });
    monthlyRevenue.set(month, (monthlyRevenue.get(month) || 0) + item.revenue);
  });
  const lineData: ChartData[] = Array.from(monthlyRevenue.entries()).map(([name, value]) => ({
    name,
    value: Math.round(value)
  }));

  // Bar chart: Top products
  const productRevenue = new Map<string, number>();
  data.forEach(item => {
    productRevenue.set(item.product, (productRevenue.get(item.product) || 0) + item.revenue);
  });
  const barData: ChartData[] = Array.from(productRevenue.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({
      name,
      value: Math.round(value)
    }));

  // Pie chart: Revenue by category
  const categoryRevenue = new Map<string, number>();
  data.forEach(item => {
    categoryRevenue.set(item.category, (categoryRevenue.get(item.category) || 0) + item.revenue);
  });
  const pieData: ChartData[] = Array.from(categoryRevenue.entries()).map(([name, value]) => ({
    name,
    value: Math.round(value)
  }));

  return { lineData, barData, pieData };
}

