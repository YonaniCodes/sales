# 🚀 Quick Start: Gemini Integration (3 Steps)

## ✅ All Code is Already Done!

The integration code is complete. You just need to add your API key.

---

## Step 1: Get Your Free API Key 🔑

1. **Open**: https://makersuite.google.com/app/apikey
2. **Click**: "Create API Key" button
3. **Select**: "Create API key in new project" (or choose existing)
4. **Copy** the API key (it starts with `AIzaSy...`)

**No credit card needed!** Free tier includes 15 requests/minute.

---

## Step 2: Add API Key to Project 📝

Create a file named `.env.local` in your project root (`C:\Users\Hp\Desktop\hackthon\sales\.env.local`):

```env
GEMINI_API_KEY=AIzaSyA_your_actual_key_here
```

**Replace** `AIzaSyA_your_actual_key_here` with your actual key from Step 1.

**Example:**
```env
GEMINI_API_KEY=AIzaSyAbCdEf1234567890GhIjKlMnOpQrStUvWxYz
```

---

## Step 3: Restart Server 🔄

1. **Stop** your current dev server (press `Ctrl+C` in terminal)
2. **Start** it again:
   ```bash
   pnpm dev
   ```

**That's it!** 🎉

---

## 🧪 Test It!

1. **Open**: http://localhost:3000/dashboard
2. **Upload** a CSV/Excel file with sales data
3. **Ask** in the chat:
   - "What are my top products?"
   - "Show me revenue trends"
   - "Analyze by region"

4. **Watch** Gemini analyze your data! 🤖

---

## ❌ Troubleshooting

### Error: "API key not configured"
- Check `.env.local` exists in project root
- Check API key has no extra spaces
- Restart server after adding key

### Error: "Failed to get response"
- Verify API key is correct
- Check internet connection
- Make sure you're not over rate limit (15/min)

### Still not working?
- Check `.env.local` is in: `C:\Users\Hp\Desktop\hackthon\sales\.env.local`
- Make sure file name is exactly `.env.local` (not `.env.local.txt`)
- Restart dev server completely

---

## ✅ Verification

After setup, when you ask a question in chat, you should see:
- Typing indicator appears
- Real AI response (not mock)
- Context-aware answers based on your data
- Professional formatting with insights

If you see "API key not configured", double-check Step 2!

---

**Ready? Get your key and start chatting with your data!** 🚀

