# 🎯 Admin Dashboard

Modern Admin Dashboard with Tennis Game Tracking - Built with Next.js 15, shadcn/ui, Drizzle ORM, Neon Postgres, and NextAuth.js.

## ✨ Features

- 🎨 **Colorful UI Design** - Inspired by modern admin dashboards with vibrant gradients
- 🌓 **Dual Theme Support** - Light and dark mode with system preference detection
- 🎾 **Tennis Game Tracking** - Comprehensive match management system with ATP-style profiles
- 📊 **Interactive Charts** - Beautiful data visualizations with Recharts
- 🔐 **Authentication** - Secure user management with NextAuth.js
- 📱 **Responsive Design** - Mobile-first approach with touch-friendly interface
- ⚡ **Performance** - Server components and optimized loading states

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 15.4.7 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Icons**: Lucide React

### Backend & Database

- **Database**: Neon Postgres (Serverless)
- **ORM**: Drizzle ORM + Drizzle Kit
- **Authentication**: NextAuth.js
- **Validation**: Zod

### Development Tools

- **Package Manager**: pnpm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript

## 🎨 Design System

### Color Palette

- **Purple-Pink Gradient**: `#8B5CF6 → #EC4899` (Revenue cards)
- **Blue-Cyan Gradient**: `#3B82F6 → #06B6D4` (User cards)
- **Green-Emerald Gradient**: `#10B981 → #059669` (Order cards)
- **Orange-Red Gradient**: `#F59E0B → #EF4444` (Growth cards)

### Theme System

- **Light Mode**: Clean white backgrounds with soft shadows
- **Dark Mode**: Deep navy backgrounds with neon accents
- **Glassmorphism**: Backdrop blur effects for modern aesthetics

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/
│   ├── ui/              # shadcn/ui components (26 components)
│   ├── charts/          # Chart components
│   ├── forms/           # Form components
│   └── features/        # Feature-specific components
│       ├── dashboard/   # Dashboard components
│       ├── matches/     # Match management
│       ├── players/     # Player management
│       └── users/       # User management
├── lib/                 # Utility functions
└── db/                  # Database schemas and migrations
```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/joungwonlim/admin-dashboard.git
   cd admin-dashboard
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   DATABASE_URL=your_neon_postgres_url
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Features Overview

### Dashboard

- 📈 **KPI Cards** - Revenue, users, orders, growth metrics
- 📊 **Interactive Charts** - Trend analysis with date range filters
- 📋 **Data Tables** - Sortable, filterable, and searchable tables
- 🎯 **Real-time Updates** - Live data synchronization

### Tennis Management

- 👤 **Player Profiles** - ATP-style detailed player information
- 🎾 **Match Tracking** - Singles and doubles match management
- 🏆 **Rankings** - Dynamic leaderboards with statistics
- 📈 **Performance Analytics** - Head-to-head comparisons and trends

### User Management

- 🔐 **Role-based Access** - Admin, manager, and viewer roles
- 👥 **User Administration** - Complete user lifecycle management
- 📝 **Audit Trails** - Comprehensive change tracking
- 🔒 **Security** - JWT-based authentication with RBAC

## 🎨 UI Components

### Installed shadcn/ui Components (26)

- **Layout**: Card, Sheet, Dialog, Tabs, Accordion
- **Forms**: Input, Label, Textarea, Select, Checkbox, Switch
- **Data**: Table, Badge, Progress, Avatar
- **Navigation**: Navigation Menu, Breadcrumb, Separator
- **Feedback**: Alert, Alert Dialog, Sonner (Toast)
- **Utility**: Tooltip, Scroll Area, Skeleton
- **Interactive**: Button, Dropdown Menu

## 🚀 Development Roadmap

### Phase 1: Foundation ✅

- [x] Project setup and configuration
- [x] Design system implementation
- [x] Basic component structure

### Phase 2: Database & Auth 🚧

- [ ] Database schema design
- [ ] Authentication system
- [ ] User management

### Phase 3: Core Features 📋

- [ ] Dashboard implementation
- [ ] Tennis match management
- [ ] Player profiles and statistics

### Phase 4: Advanced Features 🎯

- [ ] Real-time updates
- [ ] Advanced analytics
- [ ] Mobile optimization

## 📝 Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server

# Database
pnpm db:generate  # Generate database migrations
pnpm db:push      # Push schema changes
pnpm db:studio    # Open Drizzle Studio

# Code Quality
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful and accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM for SQL databases
- [Neon](https://neon.tech/) - Serverless Postgres platform

---

**Built with ❤️ by the Admin Dashboard Team**
