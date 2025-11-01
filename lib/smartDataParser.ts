/**
 * Smart Data Parser - Dynamically infers column types without hardcoded names
 */

export interface ParsedDataRecord {
  [key: string]: string | number;
}

export interface ColumnInference {
  columnName: string;
  inferredType: 'date' | 'product' | 'category' | 'quantity' | 'revenue' | 'region' | 'customer' | 'other';
  dataType: 'string' | 'number' | 'date';
  sampleValues: any[];
}

/**
 * Analyze column and infer what it represents
 */
function inferColumnType(columnName: string, values: any[]): ColumnInference['inferredType'] {
  const lower = columnName.toLowerCase();
  const cleanValues = values.filter(v => v !== null && v !== undefined && v !== "");
  
  // Date column detection
  if (lower.includes('date') || lower.includes('time') || lower.includes('when') || lower.includes('created')) {
    return 'date';
  }
  
  // Product column detection (includes product_category)
  if (lower.includes('product') && lower.includes('category')) {
    return 'category'; // product_category → category
  }
  if (lower.includes('product') || lower.includes('item') || lower.includes('sku') || 
      lower.includes('good') || lower.includes('merchandise') || lower.includes('article')) {
    return 'product';
  }
  
  // Category column detection
  if (lower.includes('category') || lower.includes('type') || lower.includes('class') || lower.includes('group')) {
    return 'category';
  }
  
  // Quantity column detection
  if (lower.includes('quantity') || lower.includes('qty') || lower.includes('units') || 
      lower.includes('count') || lower.includes('pieces') || lower.includes('number')) {
    // Check if values are numeric
    const numericValues = cleanValues.filter(v => !isNaN(parseFloat(v)));
    if (numericValues.length > cleanValues.length * 0.5) {
      return 'quantity';
    }
  }
  
  // Revenue/Sales column detection - PRIORITIZE total_sales
  if (lower === 'total_sales' || lower === 'totalsales' || lower === 'total sales') {
    return 'revenue'; // total_sales → revenue
  }
  if (lower.includes('revenue') || lower.includes('sales') || lower.includes('amount') || 
      lower.includes('total') || lower.includes('price') || lower.includes('cost') || 
      lower.includes('value') || lower.includes('payment') || lower.includes('income')) {
    // Check if values are numeric
    const numericValues = cleanValues.filter(v => !isNaN(parseFloat(v)));
    if (numericValues.length > cleanValues.length * 0.5) {
      return 'revenue';
    }
  }
  
  // Region/Location column detection
  if (lower.includes('region') || lower.includes('location') || lower.includes('area') || 
      lower.includes('city') || lower.includes('state') || lower.includes('zone') || 
      lower.includes('country') || lower.includes('place') || lower.includes('district')) {
    return 'region';
  }
  
  // Customer column detection (includes customer_segment)
  if (lower.includes('segment') || lower.includes('customer') || lower.includes('client') || 
      lower.includes('buyer') || lower.includes('user') || lower.includes('purchaser') || 
      lower.includes('shopper')) {
    return 'customer';
  }
  
  return 'other';
}

/**
 * Automatically detect column types from data
 */
export function inferColumns(data: ParsedDataRecord[]): Map<string, ColumnInference> {
  if (data.length === 0) return new Map();
  
  const columns = Object.keys(data[0]);
  const inferences = new Map<string, ColumnInference>();
  
  for (const col of columns) {
    const values = data.slice(0, 100).map(row => row[col]); // Sample first 100 rows
    const inferredType = inferColumnType(col, values);
    
    // Determine data type
    const numericCount = values.filter(v => !isNaN(parseFloat(String(v)))).length;
    const dataType = numericCount > values.length * 0.7 ? 'number' : 'string';
    
    inferences.set(col, {
      columnName: col,
      inferredType,
      dataType,
      sampleValues: values.slice(0, 5)
    });
  }
  
  return inferences;
}

/**
 * Parse data dynamically without hardcoded column names
 */
export function parseDataDynamically(rawData: ParsedDataRecord[]): {
  data: ParsedDataRecord[];
  columnMapping: Map<string, ColumnInference>;
  summary: {
    totalRows: number;
    validRows: number;
    columns: string[];
  };
} {
  // Filter out completely empty rows
  const validData = rawData.filter(row => {
    return row && Object.keys(row).some(key => {
      const value = row[key];
      return value !== null && value !== undefined && value !== "";
    });
  });

  // Infer column types
  const columnMapping = inferColumns(validData);
  
  // Create standardized view with actual column mapping
  const standardizedData = validData.map(row => {
    const standardized: any = { ...row }; // Keep all original columns
    
    // Add standardized fields for common access
    columnMapping.forEach((inference, colName) => {
      if (inference.inferredType === 'revenue' && colName.toLowerCase().includes('total')) {
        standardized.revenue = row[colName];
      } else if (inference.inferredType === 'category') {
        standardized.category = row[colName];
        if (!standardized.product) {
          standardized.product = row[colName]; // Use category as product if no product column
        }
      } else if (inference.inferredType === 'customer') {
        standardized.customer = row[colName];
      } else if (inference.inferredType === 'region') {
        standardized.region = row[colName];
      } else if (inference.inferredType === 'quantity') {
        standardized.quantity = row[colName];
      } else if (inference.inferredType === 'date') {
        standardized.date = row[colName];
      }
    });
    
    return standardized;
  });
  
  // Log for debugging
  console.log("=== Smart Column Inference ===");
  columnMapping.forEach((inference, colName) => {
    console.log(`${colName} → ${inference.inferredType} (${inference.dataType})`);
  });
  console.log("=============================");

  return {
    data: standardizedData,
    columnMapping,
    summary: {
      totalRows: rawData.length,
      validRows: validData.length,
      columns: Array.from(columnMapping.keys())
    }
  };
}

/**
 * Get column name by inferred type
 */
export function getColumnByType(
  columnMapping: Map<string, ColumnInference>, 
  type: ColumnInference['inferredType']
): string | null {
  for (const [colName, inference] of columnMapping.entries()) {
    if (inference.inferredType === type) {
      return colName;
    }
  }
  return null;
}

