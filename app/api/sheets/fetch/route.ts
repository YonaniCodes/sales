import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { accessToken, spreadsheetId, range } = await req.json();

    if (!accessToken || !spreadsheetId) {
      return NextResponse.json(
        { error: "Missing access token or spreadsheet ID" },
        { status: 400 }
      );
    }

    // Fetch data from Google Sheets
    const sheetRange = range || "A1:Z10000";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetRange}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch spreadsheet data");
    }

    const data = await response.json();
    
    // Convert to array of objects
    const rows = data.values || [];
    if (rows.length === 0) {
      return NextResponse.json({ error: "No data found in spreadsheet" }, { status: 404 });
    }

    // First row is headers
    const headers = rows[0];
    const dataRows = rows.slice(1);

    const formattedData = dataRows.map((row: any[], index: number) => {
      const obj: any = {};
      headers.forEach((header: string, idx: number) => {
        obj[header] = row[idx] || "";
      });
      return obj;
    });

    return NextResponse.json({ data: formattedData, headers });
  } catch (error: any) {
    console.error("Sheets fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch spreadsheet" },
      { status: 500 }
    );
  }
}

