# 🎬 MovieAI - AI-Powered Movie Recommendation Website

A full-stack web application that provides personalized movie recommendations using artificial intelligence. Built with React, Node.js, Express, MongoDB, and TMDB API.

## 🌟 Features

### User Authentication
- User registration and login with JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes for authenticated users
- Persistent login sessions

### Movie Browsing & Discovery
- Browse movies by categories:
  - Popular Movies
  - Top Rated
  - Now Playing
  - Upcoming
- Advanced search functionality
- Detailed movie information pages with:
  - Movie posters and backdrops
  - Cast and crew information
  - Trailers
  - User ratings and reviews

### Rating System
- Rate movies on a 1-5 star scale
- View personal rating history
- Update and manage ratings
- See average ratings across all users

### AI-Powered Recommendations
- **Hybrid Recommendation Algorithm** combining:
  - **Content-Based Filtering**: Recommends movies similar to ones you've rated highly (based on genres, cast, popularity)
  - **Collaborative Filtering**: Recommends movies liked by users with similar tastes
  - **Popularity-Based Fallback**: For new users, shows trending movies
- Personalized "Recommended for You" page
- Dynamic recommendations that improve as you rate more movies

### Responsive Design
- Mobile-first responsive design
- Netflix-inspired dark theme
- Smooth animations and transitions
- Optimized for all screen sizes

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Axios for HTTP requests
- CSS3 for styling

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing

**External APIs:**
- TMDB (The Movie Database) API for movie data

### Project Structure

```
AI-Movie-Recommend/
├── client/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Rating.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── MovieDetail.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/           # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── services/          # API service layer
│   │   │   ├── api.js
│   │   │   ├── auth.service.js
│   │   │   ├── movie.service.js
│   │   │   ├── rating.service.js
│   │   │   └── recommendation.service.js
│   │   ├── utils/             # Utility functions
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
├── server/                     # Node.js Backend
│   ├── config/                # Configuration
│   │   └── database.js
│   ├── controllers/           # Route controllers
│   │   ├── auth.controller.js
│   │   ├── movie.controller.js
│   │   ├── rating.controller.js
│   │   └── recommendation.controller.js
│   ├── middleware/            # Custom middleware
│   │   └── auth.js
│   ├── models/                # Database models
│   │   ├── User.js
│   │   └── Rating.js
│   ├── routes/                # API routes
│   │   ├── auth.routes.js
│   │   ├── movie.routes.js
│   │   ├── rating.routes.js
│   │   └── recommendation.routes.js
│   ├── services/              # Business logic
│   │   ├── tmdb.service.js
│   │   └── recommendation.service.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── README.md
└── .gitignore
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- TMDB API Key

### Getting TMDB API Key

1. Go to [TMDB website](https://www.themoviedb.org/)
2. Create a free account
3. Navigate to Settings > API
4. Request an API key (choose "Developer" option)
5. Copy your API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Swarit-Gupta/AI-Movie-Recommend.git
   cd AI-Movie-Recommend
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Create .env file
   cp .env.example .env
   
   # Edit .env and add your configuration:
   # - MongoDB URI (local: mongodb://localhost:27017/movie-recommendation)
   # - JWT Secret (generate a random string)
   # - TMDB API Key
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   
   # Create .env file
   cp .env.example .env
   
   # Edit .env and configure:
   # - API URL (default: http://localhost:5000/api)
   ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```
   
   Or use MongoDB Atlas (cloud database)

5. **Run the Application**
   
   In one terminal (Backend):
   ```bash
   cd server
   npm run dev
   ```
   
   In another terminal (Frontend):
   ```bash
   cd client
   npm run dev
   ```

6. **Access the Application**
   
   Open your browser and navigate to:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Movie Endpoints

#### Get Popular Movies
```http
GET /api/movies/popular?page=1
```

#### Get Top Rated Movies
```http
GET /api/movies/top-rated?page=1
```

#### Get Now Playing Movies
```http
GET /api/movies/now-playing?page=1
```

#### Get Upcoming Movies
```http
GET /api/movies/upcoming?page=1
```

#### Search Movies
```http
GET /api/movies/search?query=inception&page=1
```

#### Get Movie Details
```http
GET /api/movies/:id
```

### Rating Endpoints

#### Add/Update Rating
```http
POST /api/ratings
Authorization: Bearer <token>
Content-Type: application/json

{
  "movieId": 550,
  "rating": 5,
  "movieTitle": "Fight Club",
  "moviePoster": "/path/to/poster.jpg",
  "genres": [18, 53]
}
```

#### Get User's Ratings
```http
GET /api/ratings/user?page=1&limit=20
Authorization: Bearer <token>
```

#### Get Movie Ratings
```http
GET /api/ratings/movie/:movieId
```

#### Get User's Rating for Specific Movie
```http
GET /api/ratings/user/:movieId
Authorization: Bearer <token>
```

#### Delete Rating
```http
DELETE /api/ratings/:movieId
Authorization: Bearer <token>
```

### Recommendation Endpoints

#### Get Personalized Recommendations
```http
GET /api/recommendations?limit=20
Authorization: Bearer <token>
```

## 🤖 AI Recommendation Algorithm

The recommendation system uses a hybrid approach:

### 1. Content-Based Filtering
- Analyzes movies you've rated highly (4-5 stars)
- Finds similar movies based on:
  - Genre matching
  - Similar cast and crew
  - Movie popularity
- Uses TMDB's "similar movies" API

### 2. Collaborative Filtering
- Identifies users with similar rating patterns
- Recommends movies that similar users enjoyed
- Weights recommendations by user similarity score

### 3. Scoring System
- Content-based recommendations: 60% weight
- Collaborative recommendations: 40% weight
- Combines and deduplicates recommendations
- Sorts by final weighted score

### 4. Fallback Strategy
- New users (no ratings): Shows popular/trending movies
- Few ratings: Emphasizes content-based recommendations
- Many ratings: Balanced hybrid approach

## 🎨 UI/UX Features

- **Dark Theme**: Optimized for viewing in low-light conditions
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Loading States**: Smooth loading animations and skeletons
- **Error Handling**: User-friendly error messages
- **Star Rating System**: Interactive 5-star rating component
- **Movie Cards**: Hover effects and smooth transitions
- **Hero Section**: Engaging landing page with call-to-action

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- HTTP-only cookies (configurable)
- Protected API routes
- Input validation
- CORS configuration
- Environment variable protection

## 🚧 Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 Environment Variables

### Server (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/movie-recommendation
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie database API
- React and Node.js communities for excellent documentation
- All contributors and users of this project

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using React, Node.js, and AI**
