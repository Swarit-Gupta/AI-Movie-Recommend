# 🎭 Mood Detection Feature - Setup Guide

## Overview

The AI Movie Recommendation system now includes **real-time mood detection** using webcam-based facial expression recognition! The system detects your emotions and recommends movies that match your current mood.

## 🌟 Features

- **Real-time Face Detection**: Uses face-api.js for accurate facial recognition
- **Emotion Analysis**: Detects 7 emotions (happy, sad, angry, fearful, disgusted, surprised, neutral)
- **Advanced Mood Mapping**: Combines emotions to detect complex moods (excited, calm, romantic)
- **Personalized Recommendations**: AI-powered movie suggestions based on your detected mood
- **Visual Feedback**: Live emotion breakdown with confidence scores
- **10 Mood Categories**: happy, sad, angry, fearful, disgusted, surprised, neutral, excited, calm, romantic

## 📋 Setup Instructions

### Backend Setup (Already Complete! ✅)

The backend has been fully configured with:
- Mood detection API endpoints
- Mood-based recommendation algorithm
- Genre-to-mood mapping service

### Frontend Setup

#### Step 1: Install Dependencies

Navigate to the client directory and install packages:

```bash
cd client
npm install
```

This will install `face-api.js` (v0.22.2) and other required dependencies.

#### Step 2: Download AI Models

Download the face detection models using one of these methods:

**Option A: Automated Script (Recommended)**
```bash
npm run download-models
```

**Option B: Manual Download**
1. Go to: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
2. Download these files to `client/public/models/`:
   - `tiny_face_detector_model-weights_manifest.json`
   - `tiny_face_detector_model-shard1`
   - `face_expression_model-weights_manifest.json`
   - `face_expression_model-shard1`

**Option C: Copy from node_modules**
```bash
# Windows PowerShell
xcopy /E /I node_modules\face-api.js\weights public\models

# macOS/Linux
cp -r node_modules/face-api.js/weights/* public/models/
```

#### Step 3: Start the Development Server

```bash
# Terminal 1: Start backend (from server directory)
cd server
npm run dev

# Terminal 2: Start frontend (from client directory)
cd client
npm run dev
```

#### Step 4: Grant Camera Permissions

When you visit the Mood Detection page:
1. Your browser will request camera access
2. Click "Allow" to enable facial expression detection
3. The system will start analyzing your emotions in real-time

## 🎯 How to Use

### 1. Navigate to Mood Detection
- Click "🎭 Mood Detection" in the navigation bar
- Or visit: `http://localhost:5173/mood-detection`

### 2. Start Detection
- Click "📸 Start Detection" button
- Allow camera access when prompted
- Position your face in the camera frame

### 3. View Results
- Watch as the system detects your emotions in real-time
- See emotion breakdown with confidence percentages
- Your dominant mood will be highlighted

### 4. Get Recommendations
- Click "🎬 Get Movie Recommendations" button
- View personalized movie suggestions based on your mood
- Each movie has a mood match score

## 🧠 Mood-to-Genre Mapping

| Mood | Movie Genres | Description |
|------|-------------|-------------|
| 😊 Happy | Comedy, Family, Animation | Feel-good movies to enhance happiness |
| 😢 Sad | Drama, Romance | Emotional stories that resonate |
| 😠 Angry | Action, Crime, Thriller | High-energy films to channel intensity |
| 😨 Fearful | Horror, Mystery, Thriller | Thrilling movies that embrace tension |
| 🤢 Disgusted | Documentary, History, Sci-Fi | Thought-provoking content |
| 😲 Surprised | Sci-Fi, Fantasy, Mystery | Movies with unexpected twists |
| 😐 Neutral | Mixed genres | Popular highly-rated films |
| 🤩 Excited | Action, Adventure, Sci-Fi | Epic adventures and spectacles |
| 😌 Calm | Romance, History, Documentary | Gentle and peaceful films |
| 😍 Romantic | Romance, Comedy, Drama | Love stories and heartwarming tales |

## 🔧 API Endpoints

### Mood Recommendations
```http
POST /api/mood/recommendations
Authorization: Bearer <token>
Content-Type: application/json

{
  "mood": "happy",
  "emotions": {
    "happy": 0.85,
    "surprised": 0.10,
    "neutral": 0.05
  }
}
```

### Get Mood Genres
```http
GET /api/mood/genres/:mood
```

### List All Supported Moods
```http
GET /api/mood/list
```

## 🎨 Architecture

### Frontend Components
- **MoodDetection.jsx**: Main camera and detection UI
- **MoodRecommendations.jsx**: Display mood-based movie suggestions
- **MoodDetectionPage.jsx**: Wrapper page component

### Backend Services
- **mood.controller.js**: API endpoint handlers
- **mood.service.js**: Mood detection and recommendation logic
- **mood.routes.js**: Route definitions

### Technologies Used
- **face-api.js**: Real-time face detection and expression recognition
- **React**: Frontend framework
- **TMDB API**: Movie data and recommendations
- **SQLite**: User ratings storage
- **Node.js + Express**: Backend API

## 🐛 Troubleshooting

### Camera Not Working
- **Chrome/Edge**: Settings → Privacy → Camera → Allow for localhost
- **Firefox**: Preferences → Privacy → Permissions → Camera
- **Safari**: Preferences → Websites → Camera

### Models Not Loading
1. Verify files exist in `client/public/models/`
2. Check browser console for specific errors
3. Try re-downloading models: `npm run download-models`
4. Clear browser cache and reload

### Low Detection Accuracy
- Ensure good lighting conditions
- Position face clearly in frame
- Minimize background distractions
- Keep camera lens clean

### API Errors
- Verify backend server is running on port 5000
- Check you're logged in (some endpoints require authentication)
- Inspect Network tab for detailed error messages

## 🔒 Privacy & Security

- **No Data Storage**: Facial analysis happens entirely in the browser
- **No Image Upload**: Your camera feed never leaves your device
- **Local Processing**: All face detection runs client-side
- **Secure**: Camera access requires explicit user permission

## 📱 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 60+ | ✅ Full | Recommended |
| Firefox 55+ | ✅ Full | Works great |
| Edge 79+ | ✅ Full | Chromium-based |
| Safari 11+ | ⚠️ Limited | May have camera issues |
| Mobile Chrome | ✅ Full | Requires HTTPS in production |
| Mobile Safari | ⚠️ Limited | Camera constraints |

## 🚀 Production Deployment

### Important: HTTPS Required
- Camera access requires HTTPS in production
- Use services like Netlify, Vercel, or configure SSL/TLS

### Environment Variables
Ensure these are set in production:
```env
# Backend
JWT_SECRET=your-secure-secret
TMDB_API_KEY=your-tmdb-key

# Frontend
VITE_API_URL=https://your-api-domain.com
```

### Model Files
- Include `public/models/` in your build
- Models total ~1.5 MB - consider CDN for large deployments

## 💡 Advanced Features (Future Enhancements)

Potential improvements:
- [ ] Multi-face detection for group recommendations
- [ ] Emotion history tracking over time
- [ ] Mood-based playlists/watchlists
- [ ] Integration with smart home mood lighting
- [ ] Voice-based mood detection
- [ ] Personalized mood patterns learning

## 📚 Additional Resources

- [face-api.js Documentation](https://github.com/justadudewhohacks/face-api.js)
- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [WebRTC Camera Access](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

## 🆘 Support

If you encounter issues:
1. Check the console for detailed error messages
2. Review this guide's troubleshooting section
3. Verify all setup steps were completed
4. Ensure both backend and frontend servers are running

---

**Happy Mood Detection! 🎭🎬**

Enjoy personalized movie recommendations based on how you feel right now!
