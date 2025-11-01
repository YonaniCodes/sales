import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, MessageSquare, TrendingUp, Upload } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Sales<span className="text-primary">AI</span> Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your intelligent sales analytics platform. Upload your data, chat with AI, and gain powerful insights.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                <BarChart3 className="w-5 h-5" />
                Go to Dashboard
              </Button>
            </Link>
            <a href="/sample-sales-data.csv" download>
              <Button size="lg" variant="outline" className="gap-2">
                <Upload className="w-5 h-5" />
                Download Sample Data
              </Button>
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>AI-Powered Chat</CardTitle>
              <CardDescription>
                Ask questions in natural language and get instant insights about your sales data
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Real-Time Analytics</CardTitle>
              <CardDescription>
                Beautiful charts and visualizations that update instantly as you upload new data
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Easy Data Import</CardTitle>
              <CardDescription>
                Simply drag and drop your CSV or Excel files to start analyzing your sales data
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Upload Your Data</h3>
                    <p className="text-muted-foreground">
                      Click the upload button in the chat and select your CSV or Excel file containing sales data
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Ask Questions</h3>
                    <p className="text-muted-foreground">
                      Use natural language to ask about trends, top products, regional performance, and more
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Get Insights</h3>
                    <p className="text-muted-foreground">
                      View interactive charts and receive AI-powered analysis to make data-driven decisions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Card className="bg-primary text-primary-foreground max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Access your dashboard now and start analyzing your sales data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="gap-2">
                  Launch Dashboard
                  <BarChart3 className="w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
