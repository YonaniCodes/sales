import { SalesData } from "@/types/sales";

export async function chatWithGemini(
  message: string,
  salesData: SalesData[]
): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        salesData: salesData.map(item => ({
          product: item.product,
          category: item.category,
          revenue: item.revenue,
          quantity: item.quantity,
          region: item.region,
          date: item.date,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get response");
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    console.error("Chat error:", error);
    throw error;
  }
}

// For streaming responses (future enhancement)
export async function chatWithGeminiStream(
  message: string,
  salesData: SalesData[],
  onChunk: (text: string) => void
): Promise<void> {
  try {
    const response = await fetch("/api/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        salesData: salesData.map(item => ({
          product: item.product,
          category: item.category,
          revenue: item.revenue,
          quantity: item.quantity,
          region: item.region,
          date: item.date,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get streaming response");
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No reader available");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      onChunk(chunk);
    }
  } catch (error: any) {
    console.error("Streaming error:", error);
    throw error;
  }
}

