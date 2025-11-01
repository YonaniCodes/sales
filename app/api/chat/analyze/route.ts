import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { salesData } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    if (!salesData || salesData.length === 0) {
      return NextResponse.json(
        { error: "No sales data provided" },
        { status: 400 }
      );
    }

    // Prepare data context - analyze actual columns dynamically
    const dataColumns = Object.keys(salesData[0] || {});
    const sampleData = salesData.slice(0, 5);

    // Analyze column patterns
    const columnAnalysis = dataColumns.map((col) => {
      const sampleValues = salesData.slice(0, 10).map((row) => row[col]);
      const hasNumbers = sampleValues.some(
        (v) => !isNaN(parseFloat(String(v)))
      );
      return `${col} (${hasNumbers ? "numeric" : "text"})`;
    });

    const systemPrompt = `You are a data analysis expert. Analyze this sales data and return ONLY a valid JSON response (no markdown, no explanation).

IMPORTANT: The data columns may have ANY names. Do NOT assume standard column names like "product", "revenue", etc.

Actual columns in the data: ${dataColumns.join(", ")}
Column types: ${columnAnalysis.join(", ")}
Total records: ${salesData.length}
Sample data (first 5 rows): ${JSON.stringify(sampleData, null, 2)}

YOUR TASK:
1. INFER which columns represent: products, categories, revenue/sales amounts, regions/locations, quantities, dates
2. Use the ACTUAL column names from the data when creating charts
3. Calculate metrics based on the actual numeric columns present
4. IMPORTANT: If revenue is all zeros, use quantity or other numeric columns instead
5. If products/categories are all "Unknown" or "General", focus on regions and dates for insights

Return JSON in this EXACT format:
{
  "insights": {
    "summary": "Brief 2-sentence summary of the data based on actual columns",
    "key_metrics": {
      "total_revenue": number (sum of revenue column if found, otherwise null),
      "total_records": ${salesData.length},
      "best_category": "top category name or null",
      "best_region": "top region/location name or null",
      "date_range": "date range if date column exists"
    },
    "recommendations": ["specific recommendation 1", "specific recommendation 2", "specific recommendation 3"]
  },
  "charts": [
    {
      "type": "bar" | "line" | "pie",
      "title": "Descriptive chart title",
      "description": "What this chart shows",
      "xField": "ACTUAL column name from data (e.g., '${dataColumns[0]}')",
      "yField": "ACTUAL numeric column name from data",
      "aggregation": "sum" | "count" | "average"
    }
  ]
}

CRITICAL RULES:
1. Use ACTUAL column names from the data: ${dataColumns.join(", ")}
2. For xField, use text/categorical columns (regions, products, categories, etc.)
3. For yField, use numeric columns that have NON-ZERO values (check the sample data!)
4. Generate 3-4 charts that make sense for THIS specific dataset
5. If revenue is all zeros, use quantity or other numeric columns
6. Focus on columns that have actual varied data (not all "Unknown" or "General")
7. If products are unknown, create charts by region instead
8. Return ONLY valid JSON, no markdown code blocks

SPECIAL HANDLING FOR THIS DATA:
- If you see revenue is all 0, use "quantity" for the yField
- If products are all "Unknown", use "region" for categorical breakdown
- Focus on what HAS real data: regions, quantities, dates

Example chart using REAL columns:
{
  "type": "bar",
  "title": "Top Performing ${
    dataColumns.find(
      (c) =>
        c.toLowerCase().includes("product") || c.toLowerCase().includes("item")
    ) || dataColumns[0]
  }",
  "xField": "${
    dataColumns.find(
      (c) =>
        c.toLowerCase().includes("product") || c.toLowerCase().includes("item")
    ) || dataColumns[0]
  }",
  "yField": "${
    dataColumns.find((c) => !isNaN(parseFloat(String(sampleData[0]?.[c])))) ||
    dataColumns[1]
  }",
  "aggregation": "sum"
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    // Clean the response (remove markdown if present)
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    // Parse JSON
    const analysis = JSON.parse(cleanedText);

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error("Analysis API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze data" },
      { status: 500 }
    );
  }
}
