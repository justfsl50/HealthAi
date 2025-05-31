# 🚀 HealthLink AI - Deployment Guide

## 📋 **Pre-Deployment Checklist**

### **1. 🔐 Environment Variables (CRITICAL)**

#### **Firebase Configuration:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### **Google AI Configuration:**
```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_API_KEY=your_gemini_api_key
```

### **2. 🔥 Firebase Setup Requirements**

#### **Enable Firebase Services:**
1. **Authentication**
   - Email/Password provider
   - Google provider (optional)
   - Configure authorized domains

2. **Firestore Database**
   - Create database in production mode
   - Set up security rules

3. **Firebase Storage**
   - Configure storage bucket
   - Set up security rules

#### **Firebase Security Rules:**

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Medical records - strict access control
    match /medical_records/{recordId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Appointments
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### **3. 🌐 Domain & SSL Configuration**
- Custom domain (optional)
- SSL certificate (auto-configured on most platforms)
- DNS configuration

---

## 🏗️ **Platform-Specific Deployment**

### **Option 1: Vercel (Recommended)**

#### **Steps:**
1. **Connect Repository:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Environment Variables:**
   - Go to Vercel Dashboard > Project Settings > Environment Variables
   - Add all required environment variables
   - Redeploy after adding variables

3. **Domain Configuration:**
   - Add custom domain in Vercel dashboard
   - Configure DNS records

#### **Build Settings:**
- **Framework:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

---

### **Option 2: Netlify**

#### **Steps:**
1. **Connect Repository:**
   - Go to Netlify Dashboard
   - "New site from Git"
   - Connect to your GitHub repository

2. **Build Settings:**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables:**
   - Site Settings > Environment Variables
   - Add all required variables

---

### **Option 3: Firebase Hosting**

#### **Setup:**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

#### **Firebase Configuration (firebase.json):**
```json
{
  "hosting": {
    "public": ".next",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

### **Option 4: AWS Amplify**

#### **Steps:**
1. Connect GitHub repository
2. Configure build settings
3. Add environment variables
4. Deploy

---

## 🔧 **Production Optimizations**

### **1. Performance Monitoring**
Add analytics and monitoring:

```bash
# Install monitoring packages
npm install @vercel/analytics @vercel/speed-insights
```

### **2. Error Monitoring**
Consider adding Sentry for error tracking:

```bash
npm install @sentry/nextjs
```

### **3. SEO Optimization**
- Add meta tags
- Configure sitemap
- Add robots.txt

### **4. Security Headers**
Add to `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

---

## 🧪 **Testing Before Deployment**

### **1. Build Test:**
```bash
npm run build
npm run start
```

### **2. Environment Test:**
- Test with production environment variables
- Verify all AI features work
- Test Firebase authentication
- Check all pages load correctly

### **3. Performance Test:**
- Run Lighthouse audit
- Check Core Web Vitals
- Test mobile responsiveness

---

## 📊 **Post-Deployment Monitoring**

### **1. Application Monitoring**
- Set up uptime monitoring
- Configure error alerts
- Monitor API usage

### **2. Analytics Setup**
- Google Analytics
- User behavior tracking
- Performance metrics

### **3. Cost Monitoring**
- Firebase usage monitoring
- Google AI API usage tracking
- Hosting costs

---

## 🆘 **Common Deployment Issues & Solutions**

### **Issue 1: Environment Variables Not Working**
```bash
# Solution: Ensure all env vars are set on hosting platform
# Restart/redeploy after adding variables
```

### **Issue 2: AI Features Not Working**
```bash
# Check: API keys are correctly set
# Verify: Google AI Studio API key has proper permissions
```

### **Issue 3: Firebase Connection Issues**
```bash
# Verify: Firebase config is correct
# Check: Authorized domains include your deployment URL
```

### **Issue 4: Build Failures**
```bash
# Common fix: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## ✅ **Deployment Success Checklist**

- [ ] All environment variables configured
- [ ] Firebase services enabled and configured
- [ ] Production build successful
- [ ] All pages loading correctly
- [ ] AI features working (Health Advisor & Symptom Analyzer)
- [ ] Authentication working
- [ ] Database operations functional
- [ ] SSL certificate active
- [ ] Domain configured (if custom)
- [ ] Error monitoring setup
- [ ] Analytics configured

---

## 🔄 **Continuous Deployment**

### **GitHub Actions (Optional):**
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          vercel-args: '--prod'
```

---

## 📞 **Support**

If you encounter issues during deployment:
1. Check the console for error messages
2. Verify all environment variables are set
3. Test locally with production environment
4. Check hosting platform documentation
5. Review Firebase console for any service issues

**Your HealthLink AI app is ready for production deployment! 🚀** 