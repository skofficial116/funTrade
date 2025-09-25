# 🚀 funTrade - Modern Trading & Investment Platform

A comprehensive full-stack trading and investment platform built with React, Node.js, and MongoDB. Features user authentication, real-time analytics, referral systems, and a modern dashboard interface.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Features
- **User Authentication** - Secure JWT-based authentication with Clerk integration
- **Investment Tracking** - Real-time investment portfolio management
- **Analytics Dashboard** - Interactive charts and performance metrics
- **Referral System** - Multi-level referral program with rewards
- **Transaction Management** - Complete transaction history and analysis
- **Theme Support** - Dark/Light mode with consistent theming
- **Avatar Upload** - User profile customization with image upload

### 📊 Dashboard Features
- **Real-time Analytics** - Monthly/Weekly/Quarterly performance views
- **Interactive Charts** - Credit/Debit analysis with Recharts integration
- **Performance Tracking** - Earnings and investment trend analysis
- **Top Performers** - ROI calculations and performance metrics
- **Stats Cards** - Investment, earnings, referrals, and rewards overview

### 🔐 Security Features
- **JWT Authentication** - Secure token-based authentication
- **Cookie Management** - HTTP-only cookies for enhanced security
- **Input Validation** - Comprehensive data validation
- **CORS Protection** - Cross-origin request security

## 🛠 Tech Stack

### Frontend
- **React 19.1.0** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Recharts** - Interactive chart library
- **Clerk** - Authentication and user management
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **Cloudinary** - Image upload and management
- **Stripe** - Payment processing integration
- **Multer** - File upload middleware

### Development Tools
- **ESLint** - Code linting and formatting
- **Nodemon** - Development server auto-restart
- **PostCSS** - CSS processing
- **Vercel** - Deployment platform

## 📁 Project Structure

```
funTrade/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Shared components
│   │   │   ├── educator/       # Educator-specific components
│   │   │   └── student/        # Student-specific components
│   │   ├── pages/              # Page components
│   │   │   ├── dashboard/      # Dashboard pages
│   │   │   └── student/        # Student pages
│   │   ├── context/            # React context providers
│   │   ├── services/           # API service functions
│   │   └── assets/             # Static assets
│   ├── public/                 # Public assets
│   └── package.json            # Frontend dependencies
├── server/                     # Backend Node.js application
│   ├── configs/                # Configuration files
│   ├── controllers/            # Route controllers
│   ├── middlewares/            # Custom middleware
│   ├── models/                 # MongoDB models
│   ├── routes/                 # API routes
│   ├── services/               # Business logic services
│   └── package.json            # Backend dependencies
└── README.md                   # Project documentation
```

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/skofficial116/funTrade.git
   cd funTrade
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

## ⚙️ Environment Setup

### Server Environment Variables

1. **Generate JWT Secrets**
   ```bash
   cd server
   node generate-secrets.js
   ```

2. **Create server/.env file**
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/funtrade
   
   # JWT Configuration (Replace with generated secrets)
   JWT_SECRET=your-generated-jwt-secret-here
   REFRESH_SECRET=your-generated-refresh-secret-here
   
   # Cloudinary Configuration
   CLOUDINARY_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   
   # Stripe Configuration
   STRIPE_SECRET_KEY=your-stripe-secret-key
   
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   APP_NAME=FunTrade
   
   # Email Configuration (SendGrid)
   SENDGRID_API_KEY=your-sendgrid-api-key
   SENDGRID_FROM_EMAIL=your-verified-sender@yourdomain.com
   ```

### Client Environment Variables

Create `client/.env` file:
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key

# API Configuration
VITE_API_URL=http://localhost:5000

# Other configurations
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
```

## ✉️ Email Configuration (SendGrid)

This application uses SendGrid for sending transactional emails (verification, password reset, etc.). Follow these steps to set it up:

1. **Create a SendGrid Account**
   - Sign up at [SendGrid](https://signup.sendgrid.com/)
   - Verify your email address
   
2. **Create an API Key**
   - Go to [SendGrid API Keys](https://app.sendgrid.com/settings/api_keys)
   - Click "Create API Key"
   - Give it a name (e.g., "FunTrade Production")
   - Select "Restricted Access" and enable only "Mail Send" permissions
   - Copy the generated API key

3. **Verify a Sender Identity**
   - Go to [Sender Authentication](https://app.sendgrid.com/settings/sender_auth)
   - Click "Verify a Single Sender"
   - Fill in the sender details (this will be your "from" email)
   - Click "Create"
   - Check your email and click the verification link

4. **Update Environment Variables**
   - Add the following to your `.env` file:
   ```env
   SENDGRID_API_KEY=your-generated-api-key-here
   SENDGRID_FROM_EMAIL=your-verified-email@yourdomain.com
   APP_NAME=FunTrade  # This will be used in the email subject/from name
   ```

5. **Test the Email Service**
   - Start your server
   - The application will automatically test the SendGrid connection on startup
   - Check your server logs for the connection status

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm run server
   # or
   npm start
   ```

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Production Build

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd server
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/upload-avatar` - Upload user avatar

### Referral Endpoints
- `GET /api/referral/stats` - Get referral statistics
- `POST /api/referral/create` - Create referral link
- `GET /api/referral/earnings` - Get referral earnings

## 🔧 Key Features Implementation

### Authentication Flow
- JWT-based authentication with refresh tokens
- Clerk integration for enhanced user management
- Secure cookie handling for token storage

### Dashboard Analytics
- Real-time data visualization with Recharts
- Interactive charts for transaction analysis
- Performance metrics and ROI calculations
- Theme-aware chart components

### File Upload System
- Cloudinary integration for image storage
- Avatar upload with validation (5MB limit)
- Support for multiple image formats

### Theme System
- Consistent dark/light mode implementation
- Theme context provider for global state
- All components support theme switching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration for code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation for new features

## 🔒 Security Considerations

- Never commit `.env` files to version control
- Use strong, unique JWT secrets
- Implement proper input validation
- Keep dependencies updated
- Use HTTPS in production

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **JWT Authentication Error**
   - Ensure JWT secrets are properly configured in `.env`
   - Run `node generate-secrets.js` to generate new secrets

2. **Database Connection Issues**
   - Verify MongoDB is running
   - Check MONGODB_URI in environment variables

3. **CORS Errors**
   - Ensure FRONTEND_URL matches your client URL
   - Check CORS configuration in server.js

4. **File Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits (5MB max)

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check existing documentation
- Review the troubleshooting section

---

**Built with ❤️ by the funTrade Team**
