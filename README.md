# SalesAI Dashboard 📊

An intelligent sales analytics platform built with Next.js 15, React 19, and shadcn/ui. Upload your sales data and chat with AI to gain powerful insights.

## Features ✨

- **🤖 AI-Powered Chat**: Ask questions in natural language about your sales data
- **📊 Real-Time Visualizations**: Beautiful interactive charts (Line, Bar, Pie)
- **📁 Easy Data Import**: Upload CSV or Excel files with drag-and-drop
- **📱 Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- **🎨 Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Tech Stack 🛠️

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style)
- **Charts**: Recharts
- **Data Parsing**: PapaParse (CSV) & xlsx (Excel)
- **Icons**: Lucide React
- **Authentication**: Better Auth (configured)

## Getting Started 🚀

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd sales
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage 📖

### Uploading Data

1. Navigate to the Dashboard
2. Click the Upload button (📎) in the chat section
3. Select a CSV or Excel file with your sales data

### Expected Data Format

Your CSV/Excel file should have these columns:
- `date`: Transaction date (YYYY-MM-DD)
- `product`: Product name
- `category`: Product category
- `quantity`: Number of units sold
- `revenue`: Revenue amount
- `region`: Geographic region
- `customer`: Customer name

**Sample file included**: `/public/sample-sales-data.csv`

### Asking Questions

Try these prompts:
- "Show me total revenue and key metrics"
- "What are my top performing products?"
- "Analyze revenue by region"
- "Show me monthly sales trends"
- "Break down revenue by category"

## Project Structure 📁

```
sales/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard page
│   ├── (auth)/               # Authentication routes
│   ├── globals.css           # Global styles
│   └── layout.tsx            # Root layout
├── components/
│   ├── dashboard/
│   │   ├── DashboardSidebar.tsx  # Left navigation sidebar
│   │   ├── ChatSection.tsx       # Middle chat interface
│   │   └── ChartsSection.tsx     # Right charts panel
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── salesAnalysis.ts      # Data analysis logic
│   ├── auth.ts               # Authentication setup
│   └── utils.ts              # Utility functions
├── types/
│   └── sales.ts              # TypeScript types
└── public/
    └── sample-sales-data.csv # Sample data file
```

## Features Deep Dive 🔍

### Dashboard Layout

- **Left Sidebar**: Navigation menu (Dashboard, Analytics, Reports, Settings), user profile, and logout
- **Middle Section**: AI chat interface with file upload and pre-loaded prompts
- **Right Section**: Interactive charts that update based on uploaded data

### Mobile Responsiveness

- Collapsible sidebar with hamburger menu
- Sections stack vertically on mobile
- Touch-friendly interactions
- Optimized chart sizes for all screen sizes

### Charts

1. **Line Chart**: Monthly revenue trends over time
2. **Bar Chart**: Top 6 products by revenue
3. **Pie Chart**: Revenue distribution by category
4. **Summary Stats**: Quick metrics card

## Customization 🎨

### Colors

Edit `app/globals.css` to change the color scheme:
```css
:root {
  --primary: /* your color */;
  --background: /* your color */;
  /* ... other CSS variables */
}
```

### Navigation Items

Edit `components/dashboard/DashboardSidebar.tsx`:
```typescript
const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  // Add your items here
];
```

### AI Prompts

Edit `components/dashboard/ChatSection.tsx`:
```typescript
const preloadedPrompts = [
  "Your custom prompt 1",
  "Your custom prompt 2",
];
```

## Authentication 🔐

The project is set up with Better Auth. To integrate:

1. Configure your auth provider in `lib/auth.ts`
2. Update the logout handler in `app/dashboard/page.tsx`
3. Add protected route middleware as needed

## Deployment 🚀

### Vercel (Recommended)

```bash
pnpm build
vercel deploy
```

### Other Platforms

```bash
pnpm build
pnpm start
```

## Browser Support 🌐

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance 

- Server Components for optimal loading
- Code splitting and lazy loading
- Optimized bundle size
- Fast chart rendering with Recharts

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License.

## Support 💬

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and shadcn/ui
