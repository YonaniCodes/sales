# Visual Guide 🎨

## What You Should See

### Landing Page (/)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                     [📊 Chart Icon]                      │
│                                                         │
│              Sales AI Dashboard                          │
│        Your intelligent sales analytics platform        │
│      Upload your data, chat with AI, gain insights     │
│                                                         │
│   [Go to Dashboard]  [Download Sample Data]            │
│                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │ 💬           │ │ 📈           │ │ 📁           │  │
│  │ AI-Powered   │ │ Real-Time    │ │ Easy Data    │  │
│  │ Chat         │ │ Analytics    │ │ Import       │  │
│  └──────────────┘ └──────────────┘ └──────────────┘  │
│                                                         │
│                  How It Works                           │
│                                                         │
│  [1] Upload Your Data                                  │
│  [2] Ask Questions                                     │
│  [3] Get Insights                                      │
│                                                         │
│        [Launch Dashboard] Button                        │
└─────────────────────────────────────────────────────────┘
```

**Colors**: Clean white background, primary color accents
**Fonts**: Large bold headings, readable body text

---

### Dashboard Page (/dashboard)

#### Desktop View (≥ 1024px)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      FULL SCREEN DASHBOARD                              │
├──────────┬─────────────────────────┬────────────────────────────────────┤
│          │                         │                                    │
│  [📊]    │  ✨ Sales AI Assistant  │   📊 Monthly Revenue Trend         │
│ SalesAI  │  Analyzing 0 records    │   [Line Chart Shows Here]          │
│          │                         │                                    │
│  ▶ Dash  │  ┌───────────────────┐  │                                    │
│  • Analy │  │ 👋 Hello! I'm...  │  │   📊 Top Products by Revenue       │
│  • Report│  └───────────────────┘  │   [Bar Chart Shows Here]           │
│  • Settin│                         │                                    │
│          │  Suggested prompts:     │                                    │
│ ─────────│  [Show total revenue]   │   📊 Revenue by Category           │
│          │  [Top products]         │   [Pie Chart Shows Here]           │
│  👤      │  [Regional analysis]    │                                    │
│  John    │  [Monthly trends]       │                                    │
│  Doe     │  [Category breakdown]   │   📊 Quick Stats                   │
│  john@   │                         │   Total: $0  Categories: 0         │
│          │  [📎] [Input...] [Send] │   Top Product: N/A                 │
│  Logout  │                         │                                    │
│          │                         │                                    │
└──────────┴─────────────────────────┴────────────────────────────────────┘
```

**Widths**: 
- Sidebar: 256px fixed
- Chat: 40% of remaining
- Charts: 60% of remaining

---

#### Tablet View (768px - 1023px)

```
┌─────────────────────────────────────────────────────────────┐
│ [☰ Menu]                  SalesAI                           │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                  │
│   💬 Chat Section        │   📊 Charts Section              │
│   (50% width)            │   (50% width)                    │
│                          │                                  │
│   AI messages...         │   Line Chart                     │
│   User messages...       │                                  │
│                          │   Bar Chart                      │
│   [Upload] [Input]       │                                  │
│                          │   Pie Chart                      │
└──────────────────────────┴──────────────────────────────────┘
```

**Behavior**: 
- Sidebar hidden, shown when menu clicked
- Chat and charts side-by-side

---

#### Mobile View (< 768px)

```
┌───────────────────────────────┐
│ [☰]  SalesAI                 │  ← Header (fixed)
├───────────────────────────────┤
│                               │
│    💬 Chat Section            │
│    (50vh height)              │
│                               │
│    AI Assistant messages      │
│    Your messages              │
│                               │
│    Suggested prompts          │
│                               │
│    [📎] [Input...] [▶]       │
│                               │
├───────────────────────────────┤
│                               │
│    📊 Charts Section          │
│    (50vh height, scrollable)  │
│                               │
│    📈 Line Chart              │
│                               │
│    📊 Bar Chart               │
│                               │
│    🥧 Pie Chart               │
│                               │
│    📊 Quick Stats             │
│                               │
└───────────────────────────────┘
```

**Behavior**:
- Stacked vertically
- Each section takes half viewport height
- Charts section scrollable
- Sidebar slides in from left when menu tapped

---

## Color Palette

### Light Mode (Default)
- **Background**: Pure white (`#FFFFFF`)
- **Foreground**: Near black (`#0A0A0A`)
- **Primary**: Dark gray (`#2B2B2B`)
- **Muted**: Light gray (`#F5F5F5`)
- **Border**: Very light gray (`#E5E5E5`)
- **Charts**: Blue (`#0088FE`), Green (`#00C49F`), Yellow (`#FFBB28`), Orange (`#FF8042`)

### Dark Mode
- **Background**: Near black (`#0A0A0A`)
- **Foreground**: Off-white (`#FAFAFA`)
- **Primary**: Light gray (`#E5E5E5`)
- **Muted**: Dark gray (`#2B2B2B`)
- **Border**: Dark border (`rgba(255,255,255,0.1)`)

---

## Interactive Elements

### Buttons

**Primary Button** (Go to Dashboard, Send):
```
┌─────────────────┐
│ 📊 Text         │  ← Solid fill, primary color
└─────────────────┘
Hover: Slightly darker
```

**Outline Button** (Download Sample):
```
┌─────────────────┐
│ 📁 Text         │  ← Border only
└─────────────────┘
Hover: Fill with muted color
```

**Icon Button** (Upload, Send):
```
┌────┐
│ 📎 │  ← Small, square
└────┘
```

### Chat Messages

**User Message** (Right-aligned):
```
                    ┌──────────────────────┐
                    │ Your question here   │
                    │ 2:30 PM             │
                    └──────────────────────┘
                    Primary color background
```

**AI Message** (Left-aligned):
```
┌──────────────────────┐
│ AI response here     │
│ 2:30 PM             │
└──────────────────────┘
Muted background
```

**Typing Indicator**:
```
┌──────────────┐
│ ● ● ●       │  ← Three dots animating
└──────────────┘
```

### Charts

**Line Chart**:
- Blue line with smooth curves
- Dots at data points
- Hover shows exact value
- Grid lines in background

**Bar Chart**:
- Green vertical bars
- Rounded top corners
- Labels angled at -45°
- Hover highlights bar

**Pie Chart**:
- Multi-colored segments
- Percentage labels on each slice
- Legend at bottom
- Hover shows dollar value

---

## Animations

### Sidebar Slide-In (Mobile)
```
Duration: 300ms
Easing: ease-in-out
Effect: Slides from left (-100% to 0%)
Overlay: Black fade-in (0% to 50% opacity)
```

### Message Appear
```
Duration: 300ms
Easing: ease-out
Effect: Fade in + slide up 10px
```

### Typing Indicator
```
Duration: Infinite
Easing: ease-in-out
Effect: Bounce (0.6s stagger per dot)
```

### Button Hover
```
Duration: 200ms
Easing: ease
Effect: Scale(1.02) or background change
```

### Chart Render
```
Duration: 400ms
Easing: ease-out
Effect: Fade in + grow from 0
```

---

## States

### Empty State (No Data)
```
        ┌──────────────────────┐
        │                      │
        │    📊 (large icon)   │
        │                      │
        │   No Data Yet        │
        │                      │
        │  Upload sales data   │
        │  to see charts       │
        │                      │
        └──────────────────────┘
```

### Loading State (File Upload)
```
┌──────────────────────┐
│ ● ● ●  Typing...    │  ← Animated dots
└──────────────────────┘
```

### Success State (File Uploaded)
```
┌─────────────────────────────────────┐
│ ✅ Successfully loaded 30 records! │
│ I'm ready to analyze your data.    │
│ 2:31 PM                            │
└─────────────────────────────────────┘
```

### Error State (Invalid File)
```
┌─────────────────────────────────────┐
│ ❌ Sorry, error parsing file.      │
│ Please check the format.           │
│ 2:32 PM                            │
└─────────────────────────────────────┘
```

---

## Responsive Breakpoints

```
Mobile:   < 640px    → Single column, stacked
Tablet:   640-1023px → Two columns (chat + charts)
Desktop:  ≥ 1024px   → Three columns (sidebar + chat + charts)
```

---

## Accessibility

- **Keyboard Navigation**: Tab through all interactive elements
- **Focus Indicators**: Visible outline on focused elements
- **Screen Readers**: Proper ARIA labels on charts
- **Color Contrast**: WCAG AA compliant (4.5:1 for text)
- **Touch Targets**: Minimum 44x44px on mobile

---

## What Happens When You Upload a File

### Step-by-Step Visual Flow

1. **Click Upload Button**
```
[📎] ← Click this
```

2. **File Picker Opens**
```
┌──────────────────────────┐
│ Select file:             │
│ • sample-sales-data.csv  │
│ • my-data.xlsx           │
└──────────────────────────┘
```

3. **File Selected - User Message Appears**
```
                    ┌──────────────────────────┐
                    │ 📎 Uploaded:            │
                    │ sample-sales-data.csv   │
                    │ 2:35 PM                │
                    └──────────────────────────┘
```

4. **Processing - Typing Indicator**
```
┌──────────────┐
│ ● ● ●       │
└──────────────┘
```

5. **Success - AI Response**
```
┌────────────────────────────────────┐
│ ✅ Successfully loaded 30 records! │
│ I'm ready to analyze your data.   │
│ Try: "What are top products?"     │
│ 2:35 PM                           │
└────────────────────────────────────┘
```

6. **Charts Update Instantly**
```
Line Chart: Shows monthly trend ↗
Bar Chart:  Shows top 6 products
Pie Chart:  Shows category split
Stats:      Shows totals
```

---

## Pro Tips for Best Experience

1. **Mobile**: Use landscape mode for better chart viewing
2. **Desktop**: Resize browser to see responsive behavior
3. **Dark Mode**: System preference auto-applies
4. **File Upload**: Drag and drop also works (coming soon)
5. **Prompts**: Click suggested prompts for instant analysis

---

**You should now see a beautiful, professional dashboard! 🎉**

