# TasteMate App with Supabase Authentication

A complete restaurant management system with AI-powered recommendations and full authentication.

## 🚀 Quick Setup

### 1. **Supabase Setup**

1. **Create a Supabase Project:**

   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be ready (2-3 minutes)

2. **Get Your Credentials:**

   - Go to Settings → API in your Supabase dashboard
   - Copy the "Project URL" and "anon/public" key

3. **Configure the App:**
   ```javascript
   // In src/lib/supabase.js, replace these lines:
   const supabaseUrl = "https://your-project-id.supabase.co";
   const supabaseAnonKey = "your-anon-key-here";
   ```

### 2. **Authentication Setup**

1. **Disable email confirmation (for testing):**

   - Go to Authentication → Settings in Supabase dashboard
   - Turn OFF "Enable email confirmations"
   - Save the settings

2. **Optional - Google OAuth:**
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials

### 3. **Start the App**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test the connection
# Go to: http://localhost:5173/#/test
```

## 🔧 Troubleshooting

### Common Issues:

1. **"Fetching failed" errors:**

   - ✅ Check your Supabase URL and anon key
   - ✅ Make sure your Supabase project is active
   - ✅ Check browser console for detailed errors

2. **Authentication not working:**

   - ✅ Disable email confirmations in Supabase Auth settings
   - ✅ Check if your project has RLS (Row Level Security) enabled
   - ✅ Verify the anon key has the right permissions

3. **CORS errors:**
   - ✅ Make sure you're using the correct Supabase URL
   - ✅ Check if your domain is allowed in Supabase settings

### Testing Connection:

Visit `/test` in your app to run comprehensive connection tests:

- ✅ Supabase connection
- ✅ Authentication service
- ✅ Session management
- ✅ Demo account creation

## 🎯 Demo Accounts

The app automatically creates these demo accounts:

- **Customer:** customer@demo.com / password123
- **Restaurant:** restaurant@demo.com / password123
- **Admin:** admin@demo.com / password123

## 📱 Features

### Authentication

- Email/password sign up and sign in
- Google OAuth integration
- Password reset functionality
- Role-based access control
- QR code registration

### User Types

1. **Customers** - Browse menus, get AI recommendations, place orders
2. **Restaurant Owners** - Manage menus, view analytics, configure settings
3. **Super Admins** - Manage all restaurants, users, and system settings

### AI Features

- Smart menu recommendations based on preferences
- Dietary restriction support with allergen warnings
- Personalized filtering and learning from order history

## 🔒 Security

- JWT-based authentication with automatic token refresh
- Row Level Security (RLS) on database tables
- Role-based access control with metadata validation
- Secure password requirements and validation

## 📞 Support

If you're still having connection issues:

1. Check the browser console for specific error messages
2. Verify your Supabase project is active and running
3. Make sure you've copied the credentials correctly
4. Try the connection test at `/test`

The app includes comprehensive error handling and will show you exactly what's wrong with the connection.
