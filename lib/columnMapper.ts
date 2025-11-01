/**
 * Maps user's actual CSV columns to our standard SalesData interface
 */

export function createColumnMapping(rawRow: Record<string, any>): {
  id: string;
  date: string;
  product: string;
  category: string;
  quantity: string;
  revenue: string;
  region: string;
  customer: string;
} {
  const columns = Object.keys(rawRow);
  
  return {
    id: findColumn(columns, ['transaction_id', 'id', 'sale_id', 'order_id']) || 'id',
    date: findColumn(columns, ['date', 'order_date', 'transaction_date', 'sale_date']) || 'date',
    product: findColumn(columns, ['product', 'product_name', 'item', 'item_name']) || 'product_category', // Fallback to category if no product
    category: findColumn(columns, ['product_category', 'category', 'type', 'product_type']) || 'category',
    quantity: findColumn(columns, ['quantity', 'qty', 'units', 'amount']) || 'quantity',
    revenue: findColumn(columns, ['total_sales', 'revenue', 'sales', 'amount', 'total', 'price']) || 'revenue',
    region: findColumn(columns, ['region', 'location', 'city', 'area', 'zone', 'state']) || 'region',
    customer: findColumn(columns, ['customer_segment', 'customer', 'client', 'buyer', 'segment']) || 'customer'
  };
}

function findColumn(columns: string[], possibleNames: string[]): string | null {
  // Try exact match first
  for (const name of possibleNames) {
    if (columns.includes(name)) {
      return name;
    }
  }
  
  // Try case-insensitive
  for (const name of possibleNames) {
    const found = columns.find(col => col.toLowerCase() === name.toLowerCase());
    if (found) {
      return found;
    }
  }
  
  return null;
}

/**
 * Transform raw data row to SalesData using column mapping
 */
export function transformRow(row: Record<string, any>, mapping: ReturnType<typeof createColumnMapping>, index: number) {
  return {
    id: String(row[mapping.id] || index),
    date: String(row[mapping.date] || new Date().toISOString().split('T')[0]),
    product: String(row[mapping.product] || row[mapping.category] || "Uncategorized"),
    category: String(row[mapping.category] || "General"),
    quantity: parseFloat(row[mapping.quantity]) || 0,
    revenue: parseFloat(row[mapping.revenue]) || 0,
    region: String(row[mapping.region] || "Unspecified"),
    customer: String(row[mapping.customer] || "General"),
    // Preserve ALL original columns
    ...row
  };
}

