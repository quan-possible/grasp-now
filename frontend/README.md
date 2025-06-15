# grasp.now Frontend

React application for the grasp.now document transformation platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file from the template:
```bash
cp .env.example .env
```

3. Configure your Firebase project settings in `.env`:
- Create a Firebase project at https://console.firebase.google.com
- Enable Authentication with Google provider
- Enable Firestore Database
- Enable Storage
- Copy your Firebase config values to `.env`

4. Start the development server:
```bash
npm run dev
```

## Features Implemented

### Day 1-2 MVP Setup ✅
- [x] React app with Vite and TypeScript
- [x] Firebase configuration (Auth, Firestore, Storage)
- [x] Zustand state management
- [x] Google authentication flow
- [x] Tailwind CSS with NYT-inspired design system
- [x] Responsive card-based UI
- [x] Authentication state management

### Next Steps (Day 3-4)
- [ ] UI Framework components (cards, buttons, modals)
- [ ] Navigation with sidebar
- [ ] Document upload component with drag-and-drop
- [ ] Document grid view with hover effects

## Architecture

- **State Management**: Zustand stores for auth and documents
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Firebase Auth with Google provider
- **Database**: Firestore for real-time document storage
- **File Storage**: Firebase Storage for document uploads

## Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```
