"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GoogleSheetsConnectProps {
  onDataFetched: (data: any[]) => void;
}

export function GoogleSheetsConnect({ onDataFetched }: GoogleSheetsConnectProps) {
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    if (!spreadsheetUrl.trim()) {
      setError("Please enter a Google Sheets URL");
      return;
    }

    // Extract spreadsheet ID from URL
    // Accepts both formats:
    // 1. https://docs.google.com/spreadsheets/d/{ID}/edit
    // 2. https://drive.google.com/file/d/{ID}/view
    let spreadsheetId: string | null = null;
    
    // Try Sheets URL format first
    const sheetsMatch = spreadsheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (sheetsMatch) {
      spreadsheetId = sheetsMatch[1];
    } else {
      // Try Drive file URL format
      const driveMatch = spreadsheetUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
      if (driveMatch) {
        spreadsheetId = driveMatch[1];
      }
    }

    if (!spreadsheetId) {
      setError("Invalid Google Sheets URL. Please copy the full URL from your browser.\n\nAccepted formats:\n• https://docs.google.com/spreadsheets/d/...\n• https://drive.google.com/file/d/...");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Check if we have OAuth configured
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      
      if (!clientId) {
        // Use public sheets API (no auth) - only works for publicly shared sheets
        const response = await fetch(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json`);
        const text = await response.text();
        
        // Parse Google Visualization API response
        const jsonString = text.substring(47).slice(0, -2);
        const json = JSON.parse(jsonString);
        
        const rows = json.table.rows;
        const cols = json.table.cols;
        
        const headers = cols.map((col: any) => col.label || `Column ${col.id}`);
        const data = rows.map((row: any) => {
          const obj: any = {};
          row.c.forEach((cell: any, idx: number) => {
            obj[headers[idx]] = cell?.v || "";
          });
          return obj;
        });
        
        console.log(`Fetched ${data.length} rows from Google Sheets`);
        onDataFetched(data);
        setSpreadsheetUrl("");
      } else {
        // Use OAuth flow (for private sheets)
        initiateOAuth(spreadsheetId);
      }
    } catch (err: any) {
      console.error("Sheets error:", err);
      setError(
        "Failed to fetch spreadsheet. Make sure:\n" +
        "1. The sheet is publicly accessible (Share → Anyone with link can view)\n" +
        "2. The URL is correct\n" +
        "3. The sheet has data"
      );
    } finally {
      setLoading(false);
    }
  };

  const initiateOAuth = (spreadsheetId: string) => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/sheets/auth`;
    const scope = "https://www.googleapis.com/auth/spreadsheets.readonly";
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `state=${spreadsheetId}`;
    
    window.location.href = authUrl;
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <svg className="w-6 h-6" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0c9d58"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#ea4335"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#34a853"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#fbbc04"/>
              <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#4285f4"/>
            </svg>
          </div>
          <div>
            <CardTitle>Connect Google Sheets</CardTitle>
            <CardDescription>Import data directly from your spreadsheet</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Spreadsheet URL</label>
          <div className="flex gap-2">
            <Input
              placeholder="https://docs.google.com/spreadsheets/d/... or https://drive.google.com/file/d/..."
              value={spreadsheetUrl}
              onChange={(e) => setSpreadsheetUrl(e.target.value)}
              disabled={loading}
            />
            <Button onClick={handleConnect} disabled={loading || !spreadsheetUrl.trim()}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            💡 Make sure your sheet is set to "Anyone with link can view"
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription className="text-xs whitespace-pre-line">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-muted/50 p-3 rounded text-xs space-y-2">
          <p className="font-semibold">How to connect:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Open your Google Sheet</li>
            <li>Click Share → Change to "Anyone with link"</li>
            <li>Copy the full URL from browser (Sheets or Drive link works!)</li>
            <li>Paste above and click Connect</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

