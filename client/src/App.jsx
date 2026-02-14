import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetail from './pages/MovieDetail';
import Search from './pages/Search';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';
import MoodDetectionPage from './pages/MoodDetectionPage';
import MoodRecommendations from './pages/MoodRecommendations';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedBackground />
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/mood-detection" element={<MoodDetectionPage />} />
              <Route path="/mood-recommendations" element={<MoodRecommendations />} />
              <Route
                path="/recommendations"
                element={
                  <ProtectedRoute>
                    <Recommendations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
