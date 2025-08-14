# Product Catalog - Modern E-commerce App

A modern, production-quality React app that showcases a product catalog using the DummyJSON API. Built with Next.js 14+, TypeScript, Tailwind CSS, and shadcn/ui.

## ✨ Features

- **Modern Tech Stack**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Beautiful UI**: shadcn/ui components with responsive design
- **Advanced Search**: Debounced search with 300ms delay
- **Smart Filtering**: Category, price range, rating, and stock filters
- **Sorting Options**: Relevance, price (asc/desc), rating
- **Pagination**: Server-side pagination with configurable page size
- **Infinite Scroll**: Optional infinite scroll mode
- **Dark/Light Theme**: System preference detection with manual override
- **Shopping Cart**: Local cart with persistent storage
- **Product Details**: Rich product pages with image galleries
- **URL State**: All filters and search state reflected in URL
- **Fully Responsive**: Mobile-first design with adaptive layouts
- **Type Safety**: Full TypeScript coverage with Zod validation
- **Testing**: Vitest + React Testing Library setup

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd catalog-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE=https://dummyjson.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Catalog main page
│   └── product/[id]/      # Product detail pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── ProductCard.tsx   # Product card component
│   ├── ProductGrid.tsx   # Products grid layout
│   ├── Filters.tsx       # Filter sidebar
│   ├── SearchBar.tsx     # Search input
│   ├── SortControl.tsx   # Sorting dropdown
│   ├── Pagination.tsx    # Page navigation
│   ├── RatingStars.tsx   # Star rating display
│   ├── Price.tsx         # Price with discount
│   ├── ThemeToggle.tsx   # Theme switcher
│   └── Cart.tsx          # Shopping cart
├── lib/                  # Utilities and configurations
│   ├── api.ts            # API client functions
│   ├── schemas.ts        # Zod validation schemas
│   ├── store.ts          # Zustand state management
│   ├── queryKeys.ts      # React Query keys
│   └── utils.ts          # Helper functions
├── hooks/                # Custom React hooks
│   └── useDebouncedValue.ts
└── tests/                # Test files
    ├── setup.ts          # Test configuration
    ├── components/       # Component tests
    └── hooks/            # Hook tests
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run tests with Vitest |
| `npm run test:ui` | Run tests with UI interface |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run preview` | Build and preview production build |

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE=https://dummyjson.com

# Optional: Enable MSW for local mocking
# NEXT_PUBLIC_USE_MSW=true
```

### API Endpoints

The app uses the DummyJSON API:

- **Products List**: `GET /products?limit=20&skip=0`
- **Search**: `GET /products/search?q=query&limit=20&skip=0`
- **Categories**: `GET /products/categories`
- **Product Details**: `GET /products/{id}`
- **Category Products**: `GET /products/category/{category}`

## 🎨 URL Parameters

The catalog supports various URL parameters for filtering and navigation:

### Search & Pagination
- `q` - Search query
- `page` - Current page number
- `limit` - Items per page (default: 20)

### Filters
- `category` - Product category (multi-select)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `minRating` - Minimum rating filter
- `inStock` - Show only in-stock items

### Sorting & Display
- `sort` - Sort order (relevance, price-asc, price-desc, rating-desc)
- `infinite` - Enable infinite scroll

### Example URLs

```
# Search for phones with price filter
/?q=phone&minPrice=100&maxPrice=500&sort=price-asc

# Category filter with rating
/?category=smartphones&minRating=4&page=2

# Price range with stock filter
/?minPrice=200&maxPrice=1000&inStock=true&sort=rating-desc
```

## 🧪 Testing

The project includes a comprehensive testing setup:

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Structure

- **Component Tests**: Test React components with React Testing Library
- **Hook Tests**: Test custom hooks with proper cleanup
- **Mock Setup**: Next.js router and Image component mocks
- **Test Utilities**: Jest DOM matchers and custom helpers

## 🎯 Key Features Deep Dive

### Debounced Search
- 300ms delay to prevent excessive API calls
- Immediate search on Enter key press
- URL state synchronization

### Advanced Filtering
- Client-side filtering for price, rating, and stock
- Server-side filtering for categories
- Combined filtering with accurate pagination

### State Management
- **React Query**: Server state (products, categories)
- **Zustand**: Client state (theme, cart, UI preferences)
- **URL State**: All filters persisted in URL for sharing

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts (1-4 columns)
- Mobile filter sidebar
- Touch-friendly interactions

### Performance Optimizations
- Image optimization with Next.js Image
- React Query caching and background updates
- Debounced user inputs
- Lazy loading and skeleton states

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [DummyJSON](https://dummyjson.com/) for the free API
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Next.js](https://nextjs.org/) for the amazing framework

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Join our community discussions

---

**Happy coding! 🎉**
