# HealthLink AI - AI-Powered Healthcare Platform

**Get Disease Diagnosis In One Click** with advanced AI-powered health management features.

![HealthLink AI](https://img.shields.io/badge/Next.js-15.2.3-blue) ![Firebase](https://img.shields.io/badge/Firebase-11.8.1-orange) ![Google AI](https://img.shields.io/badge/Google%20AI-Gemini-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 🏥 Features

### 🤖 AI-Powered Features
- **AI Symptom Analyzer** - Analyze symptoms and get potential causes with specialist recommendations
- **AI Health Advisor** - Chat-based health advice powered by Google Gemini AI
- **Real-time Diagnosis** - Instant AI-driven health insights

### 📱 Core Healthcare Features
- **Hospital Locator** - Find nearby hospitals and urgent care facilities
- **Appointment Scheduler** - Book and manage healthcare appointments
- **Medical Records Management** - Secure storage and management of health records
- **Medication Tracker** - Track medications with reminders and dosage information
- **Personal Health Dashboard** - Comprehensive health metrics and insights

### 🔐 Security & Authentication
- **Firebase Authentication** - Secure user authentication
- **Firestore Database** - Real-time, secure data storage
- **Privacy-First Design** - HIPAA-compliant data handling

## 🚀 Technology Stack

- **Framework:** Next.js 15.2.3 with TypeScript
- **AI Integration:** Google Gemini AI via Genkit
- **Backend:** Firebase (Firestore, Authentication, Storage)
- **Styling:** Tailwind CSS with Radix UI components
- **Forms:** React Hook Form with Zod validation
- **Charts:** Recharts for health data visualization

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account
- Google AI Studio API key

### 1. Clone the repository
```bash
git clone https://github.com/Harssh-aitm/AI-HealthCare.git
cd AI-HealthCare
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google AI Configuration
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_API_KEY=your_gemini_api_key
```

### 4. Get API Keys

#### Firebase Setup:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication, Firestore, and Storage
4. Get your config from Project Settings

#### Google AI Setup:
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Generate a new API key
3. Add it to your environment variables

### 5. Run the application

#### Development Mode:
```bash
npm run dev
```
Visit `http://localhost:9002`

#### Production Build:
```bash
npm run build
npm run start
```
Visit `http://localhost:3000`

## 📦 Project Structure

```
src/
├── ai/                    # AI flows and Genkit configuration
│   ├── flows/            # AI-powered features
│   │   ├── ai-health-advisor.ts
│   │   └── ai-symptom-analyzer.ts
│   └── genkit.ts         # Genkit configuration
├── app/                  # Next.js app router pages
│   ├── health-advisor/   # AI Health Advisor page
│   ├── symptom-analyzer/ # AI Symptom Analyzer page
│   ├── appointments/     # Appointment management
│   ├── medical-records/  # Medical records management
│   ├── medications/      # Medication tracking
│   └── hospital-locator/ # Hospital finder
├── components/           # Reusable UI components
│   └── ui/              # Shadcn/ui components
├── hooks/               # Custom React hooks
└── lib/                 # Utility functions and configurations
```

## 🎯 Usage

### AI Health Advisor
1. Navigate to the Health Advisor page
2. Enter your age and medical history
3. Start chatting about your symptoms
4. Get AI-powered health advice and recommendations

### Symptom Analyzer
1. Go to the Symptom Analyzer page
2. Describe your symptoms in detail
3. Receive potential causes and specialist recommendations
4. Get suggested next steps for medical care

### Hospital Locator
1. Access the Hospital Locator feature
2. Find nearby hospitals and urgent care facilities
3. Get directions and contact information

## 🔒 Privacy & Security

- **Data Encryption:** All data is encrypted in transit and at rest
- **Firebase Security Rules:** Strict access controls
- **HIPAA Compliance:** Privacy-first design
- **No Data Retention:** Sensitive health data is not permanently stored

## ⚠️ Medical Disclaimer

**Important:** This application is for informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google AI for Gemini API
- Firebase for backend services
- Radix UI for component library
- Shadcn/ui for UI components
- Next.js team for the amazing framework

## 📞 Support

For support, email support@healthlinkai.com or create an issue in this repository.

---

**Built with ❤️ for better healthcare accessibility** 