# 🌳 TreeBio

<div align="center">
  <img src="https://treebio1.vercel.app/favicon.ico" alt="TreeBio Logo" width="64" height="64">
  
  **A Modern Bio Link Platform for the Digital Age**
  
  [![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-treebio1.vercel.app-brightgreen)](https://treebio1.vercel.app)
  [![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-Latest-2D3748?logo=prisma)](https://www.prisma.io/)
  [![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel)](https://vercel.com)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

## 🎯 Overview

**TreeBio** is a powerful, modern bio link platform that transforms the way you showcase your digital presence. Create stunning, customizable profile pages with unlimited links, real-time analytics, QR codes, URL shortening, and much more—all in one seamless platform.

**🌟 Perfect for:** Content creators, entrepreneurs, influencers, businesses, freelancers, and anyone who wants to consolidate their online presence into one beautiful, professional page.

### 🚀 **Live Demo**: [treebio1.vercel.app](https://treebio1.vercel.app)

---

## ✨ Key Features

### 🔗 **Smart Link Management**
- **Unlimited Links**: Add as many links as you need
- **Link Categories**: Organize with custom collections
- **Smart Scheduling**: Set start/end dates for temporary links
- **Drag & Drop Reordering**: Easy link management
- **Custom Icons**: 1000+ icons or upload your own
- **Click Analytics**: Track performance for each link

### 🎨 **Advanced Customization**
- **Professional Themes**: Beautiful pre-built designs
- **Custom Theme Builder**: Create unique color schemes
- **Custom Domains**: Use your own domain (coming soon)
- **Profile Personalization**: Avatar, bio, social links
- **Mobile-First Design**: Perfect on all devices

### 📊 **Powerful Analytics**
- **Real-Time Tracking**: Live visitor analytics
- **Geographic Insights**: See where your visitors are from
- **Device Analytics**: Desktop vs mobile breakdown
- **Click Heatmaps**: Visual representation of link performance
- **Time-Based Reports**: Daily, weekly, monthly trends
- **Export Data**: Download your analytics as CSV

### 🛠️ **Professional Tools**
- **URL Shortener**: Built-in link shortening with analytics
- **QR Code Generator**: Instant QR codes for any link
- **Bulk Link Import**: CSV import for easy migration
- **API Access**: Full REST API for integrations
- **SEO Optimized**: Meta tags and social sharing

### 🔐 **Security & Privacy**
- **Secure Authentication**: Powered by Clerk
- **Privacy Controls**: Public/private profiles
- **GDPR Compliant**: Privacy-focused analytics
- **SSL Secured**: HTTPS by default
- **Data Protection**: Your data, your control

---

## 🛠️ Technology Stack

### **Frontend & Backend**
- **Next.js 15.5.2** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible components
- **Prisma** - Type-safe database ORM

### **Database & Infrastructure**
- **PostgreSQL** - Reliable, scalable database
- **Vercel** - Edge deployment platform
- **Clerk** - Authentication & user management
- **Pusher** - Real-time features

### **Tools & Libraries**
- **QRCode.js** - QR code generation
- **Chart.js** - Data visualization
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Beautiful icons

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js 18+** 
- **PostgreSQL database**
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/RajdeepKushwaha5/TreeBio1.git
cd TreeBio1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/treebio"

# Clerk Authentication (Get from https://clerk.dev)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_key_here"
CLERK_SECRET_KEY="sk_test_your_secret_here"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# App Configuration  
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="TreeBio"

# Pusher (Real-time features)
NEXT_PUBLIC_PUSHER_APP_KEY="your_pusher_key"
PUSHER_APP_ID="your_app_id" 
PUSHER_SECRET="your_secret"
NEXT_PUBLIC_PUSHER_CLUSTER="your_cluster"

# Optional: Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed with sample data
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```

🎉 **Visit `http://localhost:3000` to see TreeBio running locally!**

---

## 📁 Project Structure

```
TreeBio1/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── sign-in/              # Login page
│   │   └── sign-up/              # Registration page
│   ├── (home)/                   # Public homepage
│   ├── (profile)/                # User profile pages
│   ├── admin/                    # Dashboard & Admin
│   │   ├── analytics/            # Analytics dashboard
│   │   ├── collections/          # Link collections
│   │   ├── my-tree/              # Profile management
│   │   ├── overview/             # Main dashboard
│   │   ├── settings/             # User settings
│   │   └── tools/                # QR codes, shortener
│   ├── api/                      # API Routes
│   │   ├── archive/              # Archive functionality
│   │   ├── collections/          # Collections API
│   │   ├── dashboard/            # Dashboard data
│   │   ├── debug/                # Debug endpoints
│   │   ├── health/               # Health checks
│   │   ├── links/                # Link management
│   │   ├── profile/              # Profile API
│   │   ├── settings/             # Settings API
│   │   ├── shortener/            # URL shortener
│   │   └── social-links/         # Social media links
│   ├── s/                        # Short URL redirects
│   └── templates/                # Profile templates
├── components/                   # React Components
│   ├── ui/                       # Reusable UI components
│   ├── analytics/                # Analytics components
│   ├── content-editor.tsx        # Rich content editor
│   ├── qr-code-generator.tsx     # QR code features
│   ├── link-shortener-monitor.tsx # URL shortener
│   └── ...                       # Other components
├── lib/                          # Core Libraries
│   ├── db.ts                     # Database connection
│   ├── auth.ts                   # Authentication utils
│   ├── analytics.ts              # Analytics logic
│   └── utils.ts                  # Utility functions
├── hooks/                        # Custom React hooks
├── modules/                      # Feature modules
├── prisma/                       # Database schema
├── public/                       # Static assets
└── styles/                       # Global styles
```

---

## 🔌 API Documentation

### Authentication Endpoints
```http
GET  /api/health                 # Health check
GET  /api/debug/env              # Environment check
POST /api/profile                # User profile management
```

### Link Management
```http
GET    /api/links                # Get all user links
POST   /api/links                # Create new link
PUT    /api/links/update         # Update existing link
DELETE /api/links/:id            # Delete link
```

### Collections
```http
GET  /api/collections            # Get user collections
POST /api/collections            # Create collection
GET  /api/collections/links      # Get collection links
```

### URL Shortener
```http
POST /api/shortener              # Create short URL
GET  /api/shortener              # Get all short URLs
GET  /api/shortener/:code        # Redirect short URL
GET  /api/shortener/:code/stats  # Get URL statistics
```

### Analytics
```http
GET /api/dashboard               # Dashboard analytics
GET /api/dashboard/realtime      # Real-time data
```

### Debug Endpoints
```http
GET /api/debug/database          # Database connection test
GET /api/debug/test-db          # Database query test
GET /api/debug/onboarding       # User onboarding check
```

---

## 🚀 Deployment Guide

### Deploy to Vercel (Recommended)

TreeBio is optimized for Vercel deployment:

1. **Fork & Import**: Fork this repository and import to Vercel
2. **Environment Variables**: Add all environment variables from your `.env.local`
3. **Database**: Set up PostgreSQL (Vercel Postgres, Supabase, or Neon)
4. **Deploy**: Click deploy!

```bash
# Quick deploy with Vercel CLI
npm i -g vercel
vercel --prod
```

### Production Environment Variables
```env
# Production Database (example with Neon)
DATABASE_URL="postgresql://user:pass@host.neon.tech/dbname?sslmode=require"

# Production Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."

# Production App URL
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Other Platforms

#### Netlify
```bash
npm run build
# Deploy the .next folder
```

#### Railway
```bash
# Connect your GitHub repo to Railway
# Set environment variables
# Deploy automatically
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🎯 Usage Examples

### Creating Your First Bio Link
```typescript
// 1. Sign up at your deployed TreeBio instance
// 2. Complete your profile setup
// 3. Add your first links

const profileData = {
  username: "yourhandle",
  displayName: "Your Name", 
  bio: "Your bio description",
  avatar: "profile-image.jpg",
  theme: "modern-dark"
}
```

### Adding Links Programmatically
```typescript
// Using the API
const newLink = await fetch('/api/links', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "My Portfolio",
    url: "https://portfolio.com",
    description: "Check out my work",
    isActive: true
  })
});
```

### Analytics Data Structure
```typescript
interface AnalyticsData {
  totalClicks: number;
  totalViews: number;
  topLinks: Array<{
    title: string;
    clicks: number;
    url: string;
  }>;
  geographic: Array<{
    country: string;
    visits: number;
  }>;
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started
1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/yourusername/TreeBio1.git`
3. **Create** a branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes
5. **Test** thoroughly: `npm test`
6. **Commit**: `git commit -m 'Add amazing feature'`
7. **Push**: `git push origin feature/amazing-feature`
8. **Open** a Pull Request

### Development Guidelines
- **Code Style**: Follow the existing TypeScript/React patterns
- **Testing**: Add tests for new features
- **Documentation**: Update README and code comments
- **Commits**: Use conventional commit messages

### Areas for Contribution
- 🎨 **New themes and customization options**
- 📊 **Advanced analytics features**
- 🔧 **Performance optimizations**
- 🌐 **Internationalization (i18n)**
- 📱 **Mobile app development**
- 🔌 **Third-party integrations**

---

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connection
curl https://yourdomain.com/api/debug/database

# Verify environment variables
curl https://yourdomain.com/api/debug/env
```

#### Build Failures
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

#### Authentication Issues
1. Verify Clerk keys in environment variables
2. Check Clerk dashboard configuration
3. Ensure redirect URLs are correct

### Getting Help
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/RajdeepKushwaha5/TreeBio1/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/RajdeepKushwaha5/TreeBio1/discussions)
- 📧 **Email**: Contact through GitHub

---

## 📊 Project Status & Roadmap

### ✅ Current Features (v1.0)
- [x] **User Authentication** - Secure login/signup
- [x] **Profile Management** - Complete profile customization
- [x] **Link Management** - Unlimited links with analytics
- [x] **URL Shortener** - Built-in link shortening
- [x] **QR Code Generator** - Instant QR codes
- [x] **Real-time Analytics** - Comprehensive tracking
- [x] **Theme System** - Multiple beautiful themes
- [x] **Responsive Design** - Mobile-first approach
- [x] **Collections** - Organize links in groups
- [x] **Admin Dashboard** - Complete management interface

### 🔄 In Development (v1.1)
- [ ] **Custom Domains** - Use your own domain
- [ ] **Advanced Analytics** - Conversion tracking
- [ ] **A/B Testing** - Test different link arrangements
- [ ] **Team Collaboration** - Multi-user profiles
- [ ] **API v2** - Enhanced API with webhooks

### 🎯 Future Plans (v2.0)
- [ ] **Mobile App** - Native iOS/Android apps
- [ ] **White Label** - Branded solutions for agencies
- [ ] **E-commerce Integration** - Sell products directly
- [ ] **Social Media Scheduling** - Content management
- [ ] **Email Marketing** - Built-in newsletter features

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 TreeBio - Rajdeep Kushwaha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 About the Author

<div align="center">
  <img src="https://github.com/RajdeepKushwaha5.png" alt="Rajdeep Kushwaha" width="100" height="100" style="border-radius: 50%;">
  
  ### **Rajdeep Kushwaha**
  
  *Full-Stack Developer & Open Source Enthusiast*
  
  Building modern web applications with cutting-edge technologies.
  Passionate about creating tools that empower digital creators.

  [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RajdeepKushwaha5)
  [![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/rajdeeptwts)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rajdeep-singh-b658a833a/)
  [![Medium](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@rajdeep01)

</div>

### 🎯 **My Mission**
To create powerful, accessible tools that help people showcase their digital presence and build meaningful online connections.

### 💼 **Other Projects**
- 🔗 **TreeBio** - This bio link platform
- 🚀 **Coming Soon** - More exciting projects!

---

## 🌟 Show Your Support

If TreeBio has helped you create an amazing bio link page, please consider:

- ⭐ **Starring this repository**
- 🍴 **Forking and contributing**
- 🐛 **Reporting bugs or requesting features**
- 💬 **Sharing with your network**
- ☕ **Buying me a coffee** (coming soon)

<div align="center">
  
### 🚀 Ready to create your TreeBio? 

[![Get Started](https://img.shields.io/badge/🌳_Get_Started-treebio1.vercel.app-brightgreen?style=for-the-badge)](https://treebio1.vercel.app)
[![View Source](https://img.shields.io/badge/📝_View_Source-GitHub-black?style=for-the-badge&logo=github)](https://github.com/RajdeepKushwaha5/TreeBio1)
[![Report Issue](https://img.shields.io/badge/🐛_Report_Issue-GitHub_Issues-orange?style=for-the-badge&logo=github)](https://github.com/RajdeepKushwaha5/TreeBio1/issues)

---

**Made with ❤️ by [Rajdeep Kushwaha](https://github.com/RajdeepKushwaha5)**

*TreeBio - Grow your digital presence, one link at a time* 🌳

</div>
- **Profile Customization**: Avatar, bio, social links
- **Responsive Design**: Optimized for all devices

### 📊 **Analytics & Insights**
- **Real-time Analytics**: Track clicks, views, and engagement
- **Geographic Data**: See where your visitors come from
- **Device Analytics**: Desktop vs mobile usage
- **Time-based Reports**: Daily, weekly, monthly insights
- **Link Performance**: Individual link statistics

### 🛠️ **Advanced Tools**
- **QR Code Generator**: Create QR codes for any link or your profile
- **Link Shortener**: Built-in URL shortener with analytics
- **Bulk Import/Export**: CSV import/export for link management
- **API Access**: RESTful API for integrations
- **White Label Options**: Remove branding (premium)

### 🔐 **Security & Performance**
- **User Authentication**: Secure login with Clerk
- **Privacy Controls**: Public/private profile options
- **GDPR Compliant**: Privacy-focused analytics
- **Fast Loading**: Optimized performance
- **SSL Secured**: HTTPS by default

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15.4.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5.0** - Type safety
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma 6.13.0** - Database ORM
- **PostgreSQL** - Primary database
- **Clerk** - Authentication and user management

### **Tools & Libraries**
- **QRCode.js** - QR code generation
- **Chart.js & Recharts** - Data visualization
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Nanoid** - Unique ID generation

### **Development**
- **ESLint** - Code linting
- **Turbopack** - Fast bundler
- **Vercel** - Deployment platform

## 🚀 Installation Guide

### Prerequisites
- **Node.js** 18.0 or higher
- **PostgreSQL** database
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/RajdeepKushwaha5/TreeBio.git
cd TreeBio
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/treebio"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="TreeBio"

# Optional: Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### Step 4: Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### Step 5: Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application running!

## 🎯 Usage

### Getting Started
1. **Sign Up**: Create an account using the sign-up page
2. **Complete Profile**: Add your avatar, bio, and basic information
3. **Add Links**: Start adding your social media, website, and other important links
4. **Customize**: Choose a theme or create a custom design
5. **Share**: Share your TreeBio profile URL with the world!

### Adding Links
```typescript
// Example link structure
const link = {
  title: "My Portfolio",
  url: "https://myportfolio.com",
  description: "Check out my latest work",
  category: "Professional",
  icon: "portfolio",
  isActive: true,
  scheduledStart: null,
  scheduledEnd: null
}
```

### Custom Themes
```typescript
// Example custom theme
const customTheme = {
  primaryColor: "#6366f1",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  fontFamily: "Inter",
  borderRadius: "8px",
  buttonStyle: "rounded"
}
```

### Analytics API
```typescript
// Fetch analytics data
const analytics = await fetch('/api/analytics', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 📁 Project Structure

```
treebio/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Authentication pages
│   ├── (home)/                 # Public homepage
│   ├── (profile)/              # User profile pages
│   ├── admin/                  # Admin dashboard
│   │   ├── analytics/          # Analytics pages
│   │   ├── settings/           # Settings pages
│   │   └── tools/              # Tools (QR, Shortener)
│   ├── api/                    # API endpoints
│   │   ├── analytics/          # Analytics API
│   │   ├── links/              # Link management API
│   │   ├── shortener/          # URL shortener API
│   │   └── user/               # User API
│   └── s/                      # Short URL redirects
├── components/                 # React components
│   ├── ui/                     # UI components (Radix-based)
│   ├── analytics/              # Analytics components
│   ├── link-shortener/         # Shortener components
│   └── theme/                  # Theme components
├── lib/                        # Utility libraries
│   ├── db.ts                   # Database connection
│   ├── auth.ts                 # Authentication helpers
│   ├── analytics.ts            # Analytics utilities
│   └── utils.ts                # General utilities
├── prisma/                     # Database schema & migrations
├── public/                     # Static assets
└── styles/                     # Global styles
```

## 🔌 API Endpoints

### Authentication
```http
GET  /api/auth/user              # Get current user
PUT  /api/auth/user              # Update user profile
```

### Links
```http
GET    /api/links                # Get user links
POST   /api/links                # Create new link
PUT    /api/links/:id            # Update link
DELETE /api/links/:id            # Delete link
```

### Analytics
```http
GET /api/analytics               # Get user analytics
GET /api/analytics/links/:id     # Get link analytics
GET /api/analytics/profile       # Get profile analytics
```

### URL Shortener
```http
POST /api/shortener              # Create short URL
GET  /api/shortener              # Get user short URLs
GET  /api/shortener/:id/stats    # Get short URL stats
```

### QR Code
```http
POST /api/qr-code                # Generate QR code
```

## 🚀 Deployment Guide

### Deploy to Vercel (Recommended)
1. **Connect Repository**: Import your GitHub repository (https://github.com/RajdeepKushwaha5/TreeBio) to Vercel
2. **Environment Variables**: Add all environment variables from `.env.local`
3. **Database**: Set up PostgreSQL (recommend Vercel Postgres or Supabase)
4. **Deploy**: Click deploy!

```bash
# Optional: Deploy using Vercel CLI
npm i -g vercel
vercel --prod
```

### Deploy to Other Platforms

#### Netlify
```bash
npm run build
# Upload 'out' directory to Netlify
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production
```env
# Production Database
DATABASE_URL="postgresql://prod-user:password@prod-host:5432/treebio"

# Production Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."

# Production URL
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started
1. Fork the repository (https://github.com/RajdeepKushwaha5/TreeBio)
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- **Code Style**: Follow existing patterns, use TypeScript
- **Commits**: Use conventional commit messages
- **Testing**: Add tests for new features
- **Documentation**: Update README and comments

### Reporting Issues
- Use GitHub Issues for bug reports and feature requests
- Include steps to reproduce bugs
- Specify your environment (OS, Node version, browser)

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 TreeBio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 📞 Contact & Support

### Get Help
- 📧 **Email**: support@treebio.com
- 💬 **Discord**: [Join our community](https://discord.gg/treebio)
- 🐛 **Issues**: [GitHub Issues](https://github.com/RajdeepKushwaha5/TreeBio/issues)
- 📖 **Documentation**: [Full Documentation](https://docs.treebio.com)

### Author
**Rajdeep Kushwaha**
- 🐙 **GitHub**: [@RajdeepKushwaha5](https://github.com/RajdeepKushwaha5)
- 🐦 **X (Twitter)**: [@rajdeeptwts](https://x.com/rajdeeptwts)
- 💼 **LinkedIn**: [Rajdeep Singh](https://www.linkedin.com/in/rajdeep-singh-b658a833a/)
- ✍️ **Medium**: [@rajdeep01](https://medium.com/@rajdeep01)

## 🤝 Connect with Me

<div align="center">
  
### Let's build something amazing together!
  
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RajdeepKushwaha5)
[![X (Twitter)](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/rajdeeptwts)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rajdeep-singh-b658a833a/)
[![Medium](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@rajdeep01)

</div>

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/RajdeepKushwaha5">Rajdeep Kushwaha</a></p>
  <p>⭐ Star this repo if you find it helpful!</p>
  
  <!-- Social Links -->
  <p>
    <a href="https://github.com/RajdeepKushwaha5">
      <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
    </a>
    <a href="https://x.com/rajdeeptwts">
      <img src="https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white" alt="X (Twitter)">
    </a>
    <a href="https://www.linkedin.com/in/rajdeep-singh-b658a833a/">
      <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
    </a>
    <a href="https://medium.com/@rajdeep01">
      <img src="https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white" alt="Medium">
    </a>
  </p>
  
  <!-- Repository Links -->
  <p>🔗 <a href="https://github.com/RajdeepKushwaha5/TreeBio">GitHub Repository</a> | 🐛 <a href="https://github.com/RajdeepKushwaha5/TreeBio/issues">Report Issues</a> | 💡 <a href="https://github.com/RajdeepKushwaha5/TreeBio/discussions">Discussions</a></p>
</div>
