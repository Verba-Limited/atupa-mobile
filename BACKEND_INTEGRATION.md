# Backend Integration Guide

This document outlines the integration between the Atupa mobile app and the new Node.js Express backend.

## Overview

The integration provides:
- **API Service**: Centralized HTTP client for backend communication
- **Auth Backend Service**: Authentication using the new backend instead of Firebase
- **Quiz Backend Service**: Quiz management with backend integration
- **Fallback Support**: Local data when backend is unavailable

## Architecture

### Backend Services
- **API Gateway** (localhost:3000) - Main entry point
- **Auth Service** (localhost:3001) - User authentication
- **User Service** (localhost:3002) - User profiles and preferences
- **Quiz Service** (localhost:3003) - Quiz questions and categories
- **Progress Service** (localhost:3004) - User progress tracking
- **Leaderboard Service** (localhost:3005) - Rankings and social features

### Frontend Integration
- **ApiService**: HTTP client with token management
- **AuthBackendService**: Authentication flow management
- **QuizBackendService**: Quiz data and progress management

## Setup Instructions

### 1. Start Backend Services

```bash
cd atupa-backend

# Start all services
npm run build
npm run dev:services

# Or start individual services
npm run dev:auth
npm run dev:quiz
npm run dev:progress
# etc.
```

### 2. Configure Mobile App

The mobile app will automatically detect if the backend is available and fallback to local data if needed.

#### Environment Configuration
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  // ... other config
};
```

### 3. Update Service Imports

To use the new backend services, update your component imports:

```typescript
// Old Firebase-based auth
import { AuthService } from '../services/auth.service';

// New backend-based auth
import { AuthBackendService } from '../services/auth-backend.service';
import { QuizBackendService } from '../services/quiz-backend.service';
```

## Usage Examples

### Authentication

```typescript
// Login
const user = await this.authBackendService.login(email, password);

// Register
const newUser = await this.authBackendService.register({
  email,
  password,
  firstName,
  lastName
});

// Google Sign-In
const googleUser = await this.authBackendService.signInWithGoogle();

// Logout
await this.authBackendService.logout();
```

### Quiz Management

```typescript
// Get categories
const categories = await this.quizBackendService.getCategories().toPromise();

// Get quizzes for a category
const quizzes = await this.quizBackendService.getQuizzesByCategory('1', 1);

// Submit quiz answer
const result = await this.quizBackendService.submitAnswer(
  quizId, 
  'option2', 
  30 // time spent in seconds
);

// Update progress
await this.quizBackendService.updateProgress({
  quizId,
  categoryId: '1',
  levelNumber: 1,
  selectedAnswer: 'option2',
  isCorrect: result.isCorrect,
  pointsEarned: result.pointsEarned,
  timeSpent: 30
});
```

### User Progress

```typescript
// Get user stats
const stats = await this.quizBackendService.getUserStats();

// Get category progress
const progress = await this.quizBackendService.getCategoryProgress('1');
```

## Migration Strategy

### Phase 1: Parallel Running
- Keep existing Firebase auth as fallback
- Add backend services alongside existing ones
- Test backend integration thoroughly

### Phase 2: Gradual Migration
- Update login/register pages to use backend
- Update quiz pages to use backend data
- Update progress tracking to use backend

### Phase 3: Full Migration
- Remove Firebase dependencies (optional)
- Use backend as primary data source
- Keep local data as offline fallback

## Component Updates Required

### 1. Login Page
```typescript
// src/app/login/login.page.ts
import { AuthBackendService } from '../services/auth-backend.service';

constructor(
  private authBackendService: AuthBackendService
  // ... other dependencies
) {}

async openDashboard() {
  try {
    await this.authBackendService.login(this.email, this.password);
    this.router.navigateByUrl('/tabs');
  } catch (error) {
    console.error('Login error:', error);
    this.toastService.showError(error.message);
  }
}
```

### 2. Quiz Pages
```typescript
// src/app/quiz-page/quiz-page.page.ts
import { QuizBackendService } from '../services/quiz-backend.service';

constructor(
  private quizBackendService: QuizBackendService
  // ... other dependencies
) {}

async loadQuizzes() {
  try {
    this.quizzes = await this.quizBackendService.getQuizzesByCategory(
      this.categoryId, 
      this.currentLevel
    );
  } catch (error) {
    console.error('Failed to load quizzes:', error);
    // Fallback to local data
  }
}
```

### 3. Profile Pages
```typescript
// src/app/profile/profile.page.ts
import { AuthBackendService } from '../services/auth-backend.service';

async updateProfile() {
  try {
    await this.authBackendService.updateProfile(this.profileData);
    this.toastService.showSuccess('Profile updated successfully');
  } catch (error) {
    console.error('Update error:', error);
    this.toastService.showError(error.message);
  }
}
```

## Testing

### 1. Backend Health Checks
```bash
# Check if services are running
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3003/health
```

### 2. API Testing
```bash
# Register user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Get categories
curl http://localhost:3000/api/v1/quiz/categories

# Seed quiz data
curl -X POST http://localhost:3003/seed
```

### 3. Mobile App Testing
1. Start backend services
2. Run mobile app: `ionic serve`
3. Test login/register flows
4. Test quiz functionality
5. Test offline mode (stop backend)

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Backend is configured for localhost:8100 and localhost:4200
   - Update CORS settings if using different ports

2. **Connection Refused**
   - Ensure backend services are running
   - Check port configurations in environment files

3. **Token Expiration**
   - Backend includes automatic token refresh
   - Fallback to login if refresh fails

4. **Data Not Loading**
   - Check browser network tab for API errors
   - Verify backend services are responding
   - Local data fallback should activate automatically

### Debug Mode

Enable debug logging:
```typescript
// In ApiService
console.log('API Request:', method, url, data);
console.log('API Response:', response);
```

## Production Deployment

### Backend
1. Deploy to cloud provider (AWS, Digital Ocean, etc.)
2. Set up production database (MongoDB Atlas)
3. Configure environment variables
4. Set up SSL certificates
5. Configure production CORS origins

### Mobile App
1. Update environment.prod.ts with production API URL
2. Build for production: `ionic build --prod`
3. Deploy to app stores

## Security Considerations

- JWT tokens with expiration
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- HTTPS in production
- Secure storage of API keys

## Performance Optimizations

- API response caching
- Offline data persistence
- Image optimization
- Lazy loading of quiz data
- Connection pooling for database

## Future Enhancements

1. **Real-time Features**
   - WebSocket integration for live leaderboards
   - Push notifications for achievements

2. **Advanced Analytics**
   - User learning patterns
   - Performance metrics
   - A/B testing support

3. **Content Management**
   - Admin panel for quiz management
   - Content versioning
   - Multi-language support

4. **Social Features**
   - User competitions
   - Study groups
   - Progress sharing
