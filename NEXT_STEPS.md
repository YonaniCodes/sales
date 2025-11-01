# Next Steps: LLM Integration Guide 🤖

## ✅ What's Been Updated

### 1. Reduced Chat Width
- **Before**: Chat was 40-50% of screen
- **After**: Chat is now 33-40% (narrower)
- **Charts**: Now take up 60-67% (wider)

### 2. Enhanced Empty State
New upload UI when no data is loaded:
- **Drag & Drop** zone (fully functional)
- **Click to upload** button
- **Google Sheets** connection option (ready for integration)
- **Sample CSV download** link
- Expected data format helper

### 3. Drag & Drop Support
- Visual feedback when dragging files
- Hover effects and animations
- Supports CSV and Excel files
- Works seamlessly with click-to-upload

### 4. Google Sheets Integration (Ready)
- UI component created
- Placeholder function in place
- Integration guide in `lib/googleSheets.ts`
- Ready for OAuth implementation

---

## 🚀 Next: LLM Integration

### Current State (Mock AI)
The system currently uses **smart mock AI** that:
- Analyzes actual uploaded data
- Responds to specific query patterns
- Returns formatted analysis
- File: `lib/salesAnalysis.ts`

### Step-by-Step LLM Integration

#### Option 1: OpenAI Integration

**1. Install OpenAI SDK**
```bash
pnpm add openai
```

**2. Add Environment Variables**
Create `.env.local`:
```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```

**3. Create OpenAI Client**
Create `lib/openai.ts`:
```typescript
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeWithGPT(
  salesData: any[],
  userQuery: string
): Promise<string> {
  const context = `
You are a sales data analyst. Here's the sales data summary:
- Total records: ${salesData.length}
- Total revenue: $${salesData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
- Date range: ${salesData[0]?.date} to ${salesData[salesData.length - 1]?.date}

Data sample: ${JSON.stringify(salesData.slice(0, 5))}

User question: ${userQuery}

Provide a clear, actionable answer based on the data.
`;

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful sales data analyst assistant.'
      },
      {
        role: 'user',
        content: context
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content || 'No response generated.';
}
```

**4. Update ChatSection**
Modify `components/dashboard/ChatSection.tsx`:
```typescript
import { analyzeWithGPT } from '@/lib/openai';

// Replace this line (around line 216):
const response = analyzeSalesData(salesData, text);

// With:
const response = await analyzeWithGPT(salesData, text);
```

**5. Make handleSendMessage async**
```typescript
const handleSendMessage = async (messageText?: string) => {
  // ... existing code ...
  
  // Update the setTimeout to async call
  try {
    const response = await analyzeWithGPT(salesData, text);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);
  } catch (error) {
    console.error('AI Error:', error);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "Sorry, I encountered an error analyzing your data.",
      timestamp: new Date()
    }]);
  } finally {
    setIsTyping(false);
  }
};
```

---

#### Option 2: Anthropic Claude Integration

**1. Install Anthropic SDK**
```bash
pnpm add @anthropic-ai/sdk
```

**2. Add Environment Variables**
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

**3. Create Anthropic Client**
Create `lib/anthropic.ts`:
```typescript
import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeWithClaude(
  salesData: any[],
  userQuery: string
): Promise<string> {
  const dataContext = {
    totalRecords: salesData.length,
    totalRevenue: salesData.reduce((sum, item) => sum + item.revenue, 0),
    dateRange: {
      start: salesData[0]?.date,
      end: salesData[salesData.length - 1]?.date
    },
    sample: salesData.slice(0, 10)
  };

  const message = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a sales data analyst. 

Sales Data Context:
${JSON.stringify(dataContext, null, 2)}

User Question: ${userQuery}

Provide a clear, data-driven answer. Use bullet points and specific numbers from the data.`
      }
    ],
  });

  return message.content[0].type === 'text' 
    ? message.content[0].text 
    : 'No response generated.';
}
```

**4. Update ChatSection** (same as OpenAI, but import Claude function)

---

#### Option 3: Local LLM (Ollama)

**1. Install Ollama**
```bash
# Install from https://ollama.ai
ollama pull llama2
```

**2. Install Ollama SDK**
```bash
pnpm add ollama
```

**3. Create Ollama Client**
Create `lib/ollama.ts`:
```typescript
import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });

export async function analyzeWithOllama(
  salesData: any[],
  userQuery: string
): Promise<string> {
  const prompt = `
Analyze this sales data and answer the question.

Data: ${JSON.stringify(salesData.slice(0, 5))}
Total records: ${salesData.length}

Question: ${userQuery}

Answer:`;

  const response = await ollama.chat({
    model: 'llama2',
    messages: [{ role: 'user', content: prompt }],
  });

  return response.message.content;
}
```

---

### Recommended Approach

**For Production: OpenAI GPT-4 Turbo**
- ✅ Best accuracy
- ✅ Great with structured data
- ✅ Fast responses
- ❌ Costs per request

**For Privacy: Anthropic Claude**
- ✅ Excellent reasoning
- ✅ Very safe outputs
- ✅ Great context window
- ❌ Slightly more expensive

**For Local/Free: Ollama**
- ✅ Free
- ✅ Privacy (runs locally)
- ✅ No API costs
- ❌ Requires local resources
- ❌ Slower responses

---

## 📋 Implementation Checklist

### Phase 1: Basic LLM Integration
- [ ] Choose LLM provider (OpenAI/Anthropic/Ollama)
- [ ] Install SDK
- [ ] Add API keys to environment
- [ ] Create client utility file
- [ ] Update ChatSection to use real LLM
- [ ] Test with sample queries
- [ ] Add error handling
- [ ] Add loading states

### Phase 2: Advanced Features
- [ ] Implement streaming responses
- [ ] Add conversation history context
- [ ] Add data caching for faster responses
- [ ] Implement rate limiting
- [ ] Add cost tracking (for paid APIs)
- [ ] Add response quality checks

### Phase 3: Google Sheets Integration
- [ ] Set up Google Cloud Project
- [ ] Enable Google Sheets API
- [ ] Create OAuth credentials
- [ ] Install @react-oauth/google
- [ ] Implement OAuth flow
- [ ] Add spreadsheet picker UI
- [ ] Fetch and parse spreadsheet data
- [ ] Add auto-refresh option

---

## 🔧 Code Files to Modify

### 1. `lib/salesAnalysis.ts`
- Keep as fallback/mock
- OR replace with LLM calls
- OR create new `lib/aiAnalysis.ts`

### 2. `components/dashboard/ChatSection.tsx`
- Line ~216: Replace analyzeSalesData
- Make handleSendMessage async
- Add error handling
- Add streaming support (optional)

### 3. `.env.local` (create if not exists)
```env
# OpenAI
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# OR Anthropic
ANTHROPIC_API_KEY=your_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Google Sheets (future)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
```

### 4. `lib/googleSheets.ts` (already created)
- Implement OAuth flow
- Add API calls
- Parse spreadsheet data

---

## 💡 Pro Tips

### 1. Context Management
Send relevant data summary, not entire dataset:
```typescript
const summary = {
  totalRecords: data.length,
  totalRevenue: sum(data.revenue),
  topProducts: getTop(data, 5),
  dateRange: [min(data.date), max(data.date)]
};
```

### 2. Prompt Engineering
Be specific in your system prompts:
```typescript
const systemPrompt = `
You are a sales analyst. Rules:
- Always cite specific numbers
- Use bullet points
- Be concise (max 5 sentences)
- Focus on actionable insights
`;
```

### 3. Cost Optimization
- Cache common queries
- Summarize data before sending
- Use streaming for better UX
- Set max_tokens limits

### 4. Error Handling
```typescript
try {
  const response = await llm.analyze(data, query);
  return response;
} catch (error) {
  if (error.code === 'rate_limit') {
    return 'Please wait a moment before asking another question.';
  }
  return 'I encountered an error. Please try again.';
}
```

---

## 🚀 Quick Start (OpenAI Example)

**1. Install**
```bash
pnpm add openai
```

**2. Add key**
```bash
echo "OPENAI_API_KEY=sk-your-key" >> .env.local
```

**3. Create `lib/openai.ts`** (see code above)

**4. Update ChatSection.tsx**
```typescript
import { analyzeWithGPT } from '@/lib/openai';

// In handleSendMessage:
const response = await analyzeWithGPT(salesData, text);
```

**5. Test it!**
Upload data and ask: "What are my top products?"

---

## 📞 Need Help?

- **OpenAI Docs**: https://platform.openai.com/docs
- **Anthropic Docs**: https://docs.anthropic.com
- **Ollama Docs**: https://ollama.ai/docs
- **Google Sheets API**: https://developers.google.com/sheets/api

---

**Ready to add real AI? Start with OpenAI - it's the easiest! 🚀**

