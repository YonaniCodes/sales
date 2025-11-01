import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { message, salesData } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    // Initialize all variables at function scope
    let currency = "ETB";
    let currencySymbol = "ETB";
    let totalRevenue = 0;
    let totalQuantity = 0;
    
    // Analyze data to provide better context
    let dataContext = "";
    
    if (salesData && salesData.length > 0) {
      // Detect currency from data
      const currencyValues = [...new Set(salesData.map((item: any) => item.currency))].filter(Boolean);
      currency = currencyValues[0] || "ETB";
      currencySymbol = currency === "ETB" ? "ETB" : currency === "USD" ? "$" : currency;
      
      // Try multiple column names for revenue
      totalRevenue = salesData.reduce((sum: number, item: any) => {
        return sum + (parseFloat(item.total_sales) || parseFloat(item.revenue) || 0);
      }, 0);
      totalQuantity = salesData.reduce((sum: number, item: any) => sum + (parseFloat(item.quantity) || 0), 0);
      const regions = [...new Set(salesData.map((item: any) => item.region))].filter(r => r && r !== "Unknown" && r !== "Unspecified");
      const products = [...new Set(salesData.map((item: any) => item.product || item.product_category))].filter(p => p && p !== "Unknown" && p !== "Uncategorized" && p !== "General");
      const categories = [...new Set(salesData.map((item: any) => item.category || item.product_category))].filter(c => c && c !== "General" && c !== "Uncategorized");
      
      // Determine which metric to use (revenue or quantity)
      const useQuantity = totalRevenue === 0;
      const metricName = useQuantity ? "Quantity" : "Revenue";
      const metricValue = useQuantity ? totalQuantity : totalRevenue;
      
      // Filter data by region if question mentions a specific region
      const lowerMessage = message.toLowerCase();
      let relevantData = salesData;
      let regionFilter = null;
      
      for (const region of regions) {
        if (lowerMessage.includes(region.toLowerCase())) {
          relevantData = salesData.filter((item: any) => item.region === region);
          regionFilter = region;
          break;
        }
      }
      
      // Group by product/category and aggregate
      const productStats: Record<string, { quantity: number; revenue: number; count: number }> = {};
      relevantData.forEach((item: any) => {
        const prod = item.product || item.product_category || item.category || "Unknown";
        if (!productStats[prod]) {
          productStats[prod] = { quantity: 0, revenue: 0, count: 0 };
        }
        productStats[prod].quantity += parseFloat(item.quantity) || 0;
        productStats[prod].revenue += (parseFloat(item.total_sales) || parseFloat(item.revenue) || 0);
        productStats[prod].count += 1;
      });
      
      // Group by region
      const regionStats: Record<string, { quantity: number; revenue: number; count: number }> = {};
      salesData.forEach((item: any) => {
        const reg = item.region || "Unknown";
        if (!regionStats[reg]) {
          regionStats[reg] = { quantity: 0, revenue: 0, count: 0 };
        }
        regionStats[reg].quantity += parseFloat(item.quantity) || 0;
        regionStats[reg].revenue += (parseFloat(item.total_sales) || parseFloat(item.revenue) || 0);
        regionStats[reg].count += 1;
      });
      
      // Sort and get top items
      const topProducts = Object.entries(productStats)
        .map(([name, stats]) => ({
          name,
          quantity: stats.quantity,
          revenue: stats.revenue,
          count: stats.count
        }))
        .sort((a, b) => (useQuantity ? b.quantity - a.quantity : b.revenue - a.revenue))
        .slice(0, 10);
      
      const topRegions = Object.entries(regionStats)
        .map(([name, stats]) => ({
          name,
          quantity: stats.quantity,
          revenue: stats.revenue,
          count: stats.count
        }))
        .sort((a, b) => (useQuantity ? b.quantity - a.quantity : b.revenue - a.revenue));
      
      dataContext = `
Sales Data Summary:
- Total Records: ${salesData.length}
- Currency: ${currency} (Ethiopian Birr)
- ${regionFilter ? `Filtering by Region: ${regionFilter} (${relevantData.length} records)` : "All Regions"}
- Total Revenue (total_sales column): ${currencySymbol} ${totalRevenue.toLocaleString()}
- Total Quantity: ${totalQuantity.toLocaleString()} units
- Available Regions (${regions.length}): ${regions.join(", ")}
- Product Categories (${categories.length}): ${categories.slice(0, 10).join(", ")}${categories.length > 10 ? "..." : ""}
- Customer Segments: ${[...new Set(salesData.map((item: any) => item.customer_segment))].filter(Boolean).join(", ")}
- Date Range: ${salesData[0]?.date || "N/A"} to ${salesData[salesData.length - 1]?.date || "N/A"}

TOP PRODUCT CATEGORIES ${regionFilter ? `in ${regionFilter}` : "(All Regions)"}:
${topProducts.map((p, i) => 
  `${i + 1}. ${p.name} - Revenue: ${currencySymbol} ${p.revenue.toLocaleString()}, Quantity: ${p.quantity.toLocaleString()} units (${p.count} transactions)`
).join("\n")}

ALL REGIONS Performance:
${topRegions.map((r, i) => 
  `${i + 1}. ${r.name} - Revenue: ${currencySymbol} ${r.revenue.toLocaleString()}, Quantity: ${r.quantity.toLocaleString()} units (${r.count} transactions)`
).join("\n")}

DATA SAMPLE (first 5 ${regionFilter ? `from ${regionFilter}` : "records"}):
${relevantData.slice(0, 5).map((item: any, i: number) => 
  `${i + 1}. Region: ${item.region}, Category: ${item.product_category || item.category}, Quantity: ${item.quantity}, Revenue: ${currencySymbol} ${item.total_sales || item.revenue || 0}, Customer: ${item.customer_segment || item.customer}, Date: ${item.date}`
).join("\n")}
`;
    } else {
      dataContext = "No sales data uploaded yet. Please ask the user to upload their sales data first.";
    }

    // System prompt
    const systemPrompt = `You are an expert sales data analyst AI assistant. You help users analyze their sales data and provide actionable insights.

${dataContext}

IMPORTANT CONTEXT:
- Currency: ${currency} (Ethiopian Birr) - Use "${currencySymbol}" symbol in all responses
- Revenue is in 'total_sales' column (${currencySymbol} ${totalRevenue.toLocaleString()} total!)
- Product names are in 'product_category' column (Spices, Electronics, Cereals, etc.)
- Customer types are in 'customer_segment' (Wholesale, Retail, B2B)
- When user asks about "top products" or "top categories", use the TOP PRODUCT CATEGORIES list above
- When user asks about a specific region (e.g., Amhara, Afar, Addis Ababa), the data is already filtered for that region
- Answer based on the ACTUAL numbers in the lists above
- Use ${currencySymbol} (not $) for all currency amounts

Guidelines:
- Answer directly with the data shown above
- Use bullet points for clarity
- Cite specific numbers from the TOP PRODUCT CATEGORIES and REGIONS lists
- Always use ${currencySymbol} for currency (Ethiopian Birr)
- Use emojis for visual appeal (📊 📈 💰)
- Format numbers with commas
- Be specific and concrete with actual numbers

User Question: ${message}`;

    // Use Gemini 2.0 Flash (free and fast)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get response from Gemini" },
      { status: 500 }
    );
  }
}

