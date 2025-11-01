import { SalesData } from "@/types/sales";

/**
 * Intelligently maps CSV columns to SalesData structure
 * Handles various column name formats and case sensitivity
 */
export function parseRowToSalesData(row: Record<string, string>, index: number): SalesData | null {
  // Helper function to find value from multiple possible column names
  const getField = (fieldNames: string[]): string | null => {
    // First try exact matches (case-sensitive)
    for (const field of fieldNames) {
      if (row[field] !== undefined && row[field] !== null && row[field] !== "") {
        return row[field];
      }
    }
    
    // Then try case-insensitive
    const rowKeys = Object.keys(row);
    for (const field of fieldNames) {
      const matchingKey = rowKeys.find(key => key.toLowerCase() === field.toLowerCase());
      if (matchingKey && row[matchingKey] !== undefined && row[matchingKey] !== null && row[matchingKey] !== "") {
        return row[matchingKey];
      }
    }
    
    return null;
  };

  // Extract and validate data
  const id = getField(["id", "ID", "transaction_id", "order_id", "sale_id"]) || index.toString();
  
  const date = getField([
    "date", "Date", "DATE", 
    "order_date", "OrderDate", "transaction_date", "TransactionDate",
    "sale_date", "SaleDate", "created_at", "timestamp"
  ]) || new Date().toISOString().split('T')[0];

  const product = getField([
    "product", "Product", "PRODUCT",
    "product_name", "ProductName", "item", "Item",
    "item_name", "ItemName", "sku", "SKU"
  ]);

  const category = getField([
    "category", "Category", "CATEGORY",
    "product_category", "ProductCategory", "type", "Type",
    "item_category", "ItemCategory"
  ]);

  const quantityStr = getField([
    "quantity", "Quantity", "QUANTITY",
    "qty", "Qty", "QTY",
    "amount", "Amount", "units", "Units"
  ]);
  const quantity = parseFloat(quantityStr) || 0;

  const revenueStr = getField([
    "revenue", "Revenue", "REVENUE",
    "sales", "Sales", "SALES",
    "amount", "Amount", "AMOUNT",
    "total", "Total", "TOTAL",
    "price", "Price", "PRICE",
    "value", "Value", "VALUE"
  ]);
  const revenue = parseFloat(revenueStr) || 0;

  const region = getField([
    "region", "Region", "REGION",
    "location", "Location", "LOCATION",
    "area", "Area", "AREA",
    "city", "City", "CITY",
    "state", "State", "STATE",
    "zone", "Zone", "ZONE"
  ]);

  const customer = getField([
    "customer", "Customer", "CUSTOMER",
    "client", "Client", "CLIENT",
    "customer_name", "CustomerName", "client_name", "ClientName",
    "buyer", "Buyer"
  ]);

  // Validate required fields - skip if all critical fields are empty
  const hasValidData = (product && product !== "Unknown") || 
                       (revenue > 0) || 
                       (quantity > 0) ||
                       (category && category !== "General");

  if (!hasValidData) {
    return null; // Skip this row
  }

  return {
    id,
    date,
    product: product || "Uncategorized",
    category: category || "Uncategorized",
    quantity,
    revenue,
    region: region || "Unspecified",
    customer: customer || "Walk-in"
  };
}

/**
 * Parse and clean sales data from CSV/Excel
 */
export function parseSalesData(rawData: Array<Record<string, string>>): SalesData[] {
  const parsed: SalesData[] = [];
  
  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    
    // Skip completely empty rows
    if (!row || Object.keys(row).length === 0) {
      continue;
    }
    
    const salesRecord = parseRowToSalesData(row, i);
    if (salesRecord) {
      parsed.push(salesRecord);
    }
  }
  
  console.log(`Parsed ${parsed.length} valid records from ${rawData.length} total rows`);
  return parsed;
}

/**
 * Log CSV structure for debugging
 */
export function debugCSVStructure(rawData: Array<Record<string, string>>) {
  if (rawData.length === 0) {
    console.log("No data to analyze");
    return;
  }

  const firstRow = rawData[0];
  const columns = Object.keys(firstRow);
  
  console.log("=== CSV Structure Debug ===");
  console.log("Total rows:", rawData.length);
  console.log("Columns found:", columns);
  console.log("Sample row:", firstRow);
  console.log("========================");
}

