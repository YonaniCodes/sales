"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileSpreadsheet, Loader2, CheckCircle2 } from "lucide-react";

interface UploadingStateProps {
  fileName: string;
  progress?: number;
  isComplete?: boolean;
}

export function UploadingState({ fileName, progress = 0, isComplete = false }: UploadingStateProps) {
  return (
    <div className="flex flex-col h-full items-center justify-center p-6">
      <Card className="w-full max-w-md border-2">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          {!isComplete ? (
            <>
              {/* Animated Upload Icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileSpreadsheet className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-primary-foreground animate-spin" />
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2">Processing Your File</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {fileName}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden mb-4">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                >
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Analyzing your sales data...
              </p>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 animate-scale-in">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>

              <h3 className="text-xl font-bold mb-2 text-green-600">Upload Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Successfully loaded your data
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes scale-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

