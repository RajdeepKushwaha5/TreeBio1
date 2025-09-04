# 🌳 TreeBio

<div align="center">
  <img src="https://treebio1.vercel.app/favicon.svg" alt="TreeBio Logo" width="80" height="80">
  
  **A Modern Bio Link Platform for the Digital Age**
  
  [![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-treebio1.vercel.app-brightgreen)](https://treebio1.vercel.app)
  [![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

## 📖 Description

TreeBio is a powerful, modern bio link platform that transforms the way you showcase your digital presence. Create stunning, customizable profile pages with unlimited links, real-time analytics, QR codes, URL shortening, and advanced customization options—all in one seamless platform designed for content creators, entrepreneurs, and businesses.

## �️ Tech Stack

- **Frontend**: Next.js 15.5.2, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Authentication**: Clerk
- **Deployment**: Vercel
- **Real-time**: Pusher
- **UI Components**: Radix UI, Lucide React

## ✨ Features

- **🔗 Smart Link Management**: Unlimited links with categories, scheduling, and custom icons
- **📊 Real-time Analytics**: Comprehensive tracking with geographic insights and device analytics
- **🎨 Advanced Customization**: Professional themes, custom colors, and mobile-first design
- **🛠️ Professional Tools**: Built-in URL shortener, QR code generator, and bulk import/export
- **🔐 Secure Authentication**: User management with privacy controls and GDPR compliance

## 🚀 Installation

### Prerequisites

- Node.js 18.0 or higher
- PostgreSQL database
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/RajdeepKushwaha5/TreeBio1.git
   cd TreeBio1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/treebio"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
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
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Visit [http://localhost:3000](http://localhost:3000) to see TreeBio running locally.

## 🎯 Usage

1. **Create Account**: Sign up using the authentication system
2. **Setup Profile**: Add your avatar, bio, and personal information
3. **Add Links**: Create and organize your important links
4. **Customize**: Choose themes and customize your page design
5. **Share**: Share your TreeBio profile URL with your audience
6. **Monitor**: Track performance with built-in analytics

### Example Profile URL
```
https://treebio1.vercel.app/yourusername
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app's URL | Yes |
| `NEXT_PUBLIC_PUSHER_APP_KEY` | Pusher app key | Optional |

### Database Setup

TreeBio uses Prisma as the ORM. The database schema includes:
- Users and authentication
- Links and collections
- Analytics and tracking
- URL shortener data

## 🔌 API Documentation

TreeBio provides RESTful API endpoints for all major functionality:

### Core Endpoints
- `GET /api/health` - Health check
- `GET /api/profile` - Get user profile
- `POST /api/links` - Create new link
- `GET /api/analytics` - Get analytics data
- `POST /api/shortener` - Create short URL

### Debug Endpoints
- `GET /api/debug/database` - Database connection test
- `GET /api/debug/env` - Environment variables check

For complete API documentation, run the application locally and visit the debug endpoints.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Fork this repository** to your GitHub account

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your forked repository

3. **Set Environment Variables**
   - Add all variables from your `.env.local` file
   - Set `DATABASE_URL` to your production database
   - Configure Clerk with production keys

4. **Deploy**
   - Click "Deploy"
   - Your TreeBio instance will be live in minutes

### Other Platforms

TreeBio can also be deployed to:
- Railway
- Heroku
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Use conventional commit messages

### Reporting Issues
- Use [GitHub Issues](https://github.com/RajdeepKushwaha5/TreeBio1/issues) to report bugs
- Include steps to reproduce
- Specify your environment details

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Rajdeep Kushwaha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Vercel** for seamless deployment platform
- **Clerk** for authentication services
- **Prisma** for the excellent ORM
- **Tailwind CSS** for the utility-first CSS framework

## 👨‍💻 Author

<div align="center">
  <img src="https://github.com/RajdeepKushwaha5.png" alt="Rajdeep Kushwaha" width="100" height="100" style="border-radius: 50%;">
  
  **Rajdeep Kushwaha**
  
  *Full-Stack Developer & Open Source Enthusiast*

  [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RajdeepKushwaha5)
  [![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/rajdeeptwts)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rajdeep-singh-b658a833a/)
  [![Medium](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@rajdeep01)
</div>

---

<div align="center">
  
  **🌟 If this project helped you, please consider giving it a star!**
  
  [![Live Demo](https://img.shields.io/badge/🚀_Try_TreeBio-treebio1.vercel.app-brightgreen?style=for-the-badge)](https://treebio1.vercel.app)
  
  *Made with ❤️ by Rajdeep Kushwaha*
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
