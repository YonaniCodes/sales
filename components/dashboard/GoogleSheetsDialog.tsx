"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoogleSheetsConnect } from "./GoogleSheetsConnect";

interface GoogleSheetsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataFetched: (data: any[]) => void;
}

export function GoogleSheetsDialog({ open, onOpenChange, onDataFetched }: GoogleSheetsDialogProps) {
  const handleDataFetched = (data: any[]) => {
    onDataFetched(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Connect to Google Sheets</DialogTitle>
          <DialogDescription>
            Import your sales data directly from a Google Spreadsheet
          </DialogDescription>
        </DialogHeader>
        <GoogleSheetsConnect onDataFetched={handleDataFetched} />
      </DialogContent>
    </Dialog>
  );
}

