# 🔧 JWT Authentication Setup Instructions

## Problem
You're getting the error: **"secretOrPrivateKey must have a value"** during sign-in.

## Solution
This error occurs because the JWT secrets are not configured in your environment variables.

### Step 1: Generate JWT Secrets
Run this command in your server directory to generate secure secrets:

```bash
cd server
node generate-secrets.js
```

### Step 2: Create/Update .env File
1. In your `server` directory, create a `.env` file (if it doesn't exist)
2. Copy the generated secrets from Step 1 and add them to your `.env` file
3. Your `.env` file should look like this:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/your-database-name

# JWT Configuration (REQUIRED - Replace with your generated secrets)
JWT_SECRET=your-generated-jwt-secret-here
REFRESH_SECRET=your-generated-refresh-secret-here

# Cloudinary Configuration (if using)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Server Configuration
NODE_ENV=development
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Step 3: Restart Your Server
After adding the secrets to your `.env` file, restart your server:

```bash
npm start
# or
npm run dev
```

## Security Notes
- ⚠️ **Never commit your `.env` file to version control**
- 🔐 Keep your JWT secrets secure and private
- 🔄 Use different secrets for JWT_SECRET and REFRESH_SECRET
- 📝 The `.env.example` file shows the required format without actual secrets

## Verification
After completing these steps:
1. Try signing in again
2. The error should be resolved
3. You should be able to authenticate successfully

## Additional Help
If you continue to have issues:
1. Check that your `.env` file is in the correct location (`server/.env`)
2. Ensure there are no spaces around the `=` signs in your `.env` file
3. Verify that your server is reading the environment variables correctly
4. Check the server console for any other configuration errors
