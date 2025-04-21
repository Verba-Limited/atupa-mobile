# MobileQuiz App

An Ionic Angular application for learning Yoruba language through quizzes.

## Google Sign-In Configuration

This application supports Google Sign-In for easy authentication. Follow these steps to configure it:

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or use an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Configure Consent Screen" and set up an External user type
5. Fill in the required information and save

### 2. Create OAuth 2.0 Credentials

1. In the "Credentials" page, click "Create Credentials" > "OAuth client ID"
2. Select "Web application" for development
3. Add authorized JavaScript origins:
   - `http://localhost:8100` for development
   - Your production URL when deployed
4. Add authorized redirect URIs:
   - `http://localhost:8100` for development
   - Your production URL when deployed
5. Click "Create" and note your Client ID

### 3. Configure the App

1. Open the following files and replace `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` with your actual client ID:
   - `src/app/app.component.ts`
   - `src/app/services/auth.service.ts`

### 4. For Native Mobile Apps

For Android:
1. Create an additional OAuth client ID for Android in Google Cloud Console
2. Configure your SHA-1 certificate fingerprint
3. Ensure the package name matches your app's

For iOS:
1. Create an additional OAuth client ID for iOS in Google Cloud Console
2. Configure your bundle ID to match your app's

## Running the App

```bash
# Install dependencies
npm install

# Run the app in the browser
ionic serve

# Build for production
ionic build --prod
```

## PocketBase Configuration

This app uses PocketBase as a backend. Make sure your PocketBase instance has OAuth2 properly configured for Google authentication.

In your PocketBase Admin UI:
1. Go to Settings > Auth Providers
2. Enable Google provider
3. Add your OAuth client ID and secret
4. Save changes 