import { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import './MoodDetection.css';

const MoodDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [emotions, setEmotions] = useState(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const detectionIntervalRef = useRef(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        const MODEL_URL = '/models';
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        
        setModelsLoaded(true);
        setIsLoading(false);
        console.log('Face-api models loaded successfully');
      } catch (err) {
        console.error('Error loading models:', err);
        setError('Failed to load face detection models. Please refresh the page.');
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setIsDetecting(false);
  };

  // Detect emotions
  const detectEmotions = async () => {
    if (!videoRef.current || !modelsLoaded) return;

    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections) {
        const expressions = detections.expressions;
        setEmotions(expressions);
        
        // Determine dominant mood
        const mood = determineMood(expressions);
        setDetectedMood(mood);

        // Draw on canvas
        if (canvasRef.current) {
          const displaySize = {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight
          };
          faceapi.matchDimensions(canvasRef.current, displaySize);
          
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          // Draw face detection box
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        }
      }
    } catch (err) {
      console.error('Error detecting emotions:', err);
    }
  };

  // Determine mood from emotions
  const determineMood = (expressions) => {
    const emotions = {
      happy: expressions.happy,
      sad: expressions.sad,
      angry: expressions.angry,
      fearful: expressions.fearful,
      disgusted: expressions.disgusted,
      surprised: expressions.surprised,
      neutral: expressions.neutral
    };

    // Find dominant emotion
    let dominantEmotion = 'neutral';
    let maxValue = 0;

    for (const [emotion, value] of Object.entries(emotions)) {
      if (value > maxValue) {
        maxValue = value;
        dominantEmotion = emotion;
      }
    }

    // Advanced mood detection
    if (emotions.happy > 0.3 && emotions.neutral > 0.3) {
      return 'romantic';
    }
    if (emotions.neutral > 0.5 && maxValue < 0.7) {
      return 'calm';
    }
    if (emotions.happy > 0.5 && emotions.surprised > 0.2) {
      return 'excited';
    }

    return dominantEmotion;
  };

  // Start detection
  const handleStartDetection = async () => {
    if (!modelsLoaded) {
      setError('Models are still loading. Please wait...');
      return;
    }

    await startCamera();
    setIsDetecting(true);
    
    // Wait for video to be ready
    setTimeout(() => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      
      // Detect emotions every 500ms
      detectionIntervalRef.current = setInterval(() => {
        detectEmotions();
      }, 500);
    }, 1000);
  };

  // Stop detection
  const handleStopDetection = () => {
    stopCamera();
    setDetectedMood(null);
    setEmotions(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Get mood emoji
  const getMoodEmoji = (mood) => {
    const emojiMap = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      fearful: '😨',
      disgusted: '🤢',
      surprised: '😲',
      neutral: '😐',
      excited: '🤩',
      calm: '😌',
      romantic: '😍'
    };
    return emojiMap[mood] || '😐';
  };

  // Get mood color
  const getMoodColor = (mood) => {
    const colorMap = {
      happy: '#FFD700',
      sad: '#4682B4',
      angry: '#DC143C',
      fearful: '#9370DB',
      disgusted: '#8FBC8F',
      surprised: '#FF69B4',
      neutral: '#A9A9A9',
      excited: '#FF4500',
      calm: '#87CEEB',
      romantic: '#FF1493'
    };
    return colorMap[mood] || '#A9A9A9';
  };

  return (
    <div className="mood-detection-container">
      <div className="mood-detection-header">
        <h2>🎭 Mood Detection</h2>
        <p>Let us detect your mood and recommend perfect movies for you!</p>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      {isLoading && (
        <div className="loading-message">
          <div className="loader"></div>
          <p>Loading AI models...</p>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="camera-container">
            <div className="video-wrapper">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                onLoadedMetadata={() => {
                  if (canvasRef.current && videoRef.current) {
                    canvasRef.current.width = videoRef.current.videoWidth;
                    canvasRef.current.height = videoRef.current.videoHeight;
                  }
                }}
              />
              <canvas ref={canvasRef} className="detection-canvas" />
              
              {!isDetecting && (
                <div className="camera-overlay">
                  <div className="overlay-content">
                    <span className="camera-icon">📷</span>
                    <p>Click "Start Detection" to begin</p>
                  </div>
                </div>
              )}
            </div>

            <div className="camera-controls">
              {!isDetecting ? (
                <button
                  onClick={handleStartDetection}
                  className="btn-primary"
                  disabled={!modelsLoaded}
                >
                  📸 Start Detection
                </button>
              ) : (
                <button
                  onClick={handleStopDetection}
                  className="btn-danger"
                >
                  ⏹️ Stop Detection
                </button>
              )}
            </div>
          </div>

          {detectedMood && emotions && (
            <div className="mood-results">
              <div className="detected-mood" style={{ borderColor: getMoodColor(detectedMood) }}>
                <div className="mood-emoji">{getMoodEmoji(detectedMood)}</div>
                <div className="mood-info">
                  <h3>Detected Mood: <span style={{ color: getMoodColor(detectedMood) }}>
                    {detectedMood.charAt(0).toUpperCase() + detectedMood.slice(1)}
                  </span></h3>
                  <p className="mood-confidence">
                    Confidence: {(Math.max(...Object.values(emotions)) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="emotions-breakdown">
                <h4>Emotion Analysis</h4>
                <div className="emotion-bars">
                  {Object.entries(emotions).map(([emotion, value]) => (
                    <div key={emotion} className="emotion-item">
                      <span className="emotion-label">
                        {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                      </span>
                      <div className="emotion-bar-container">
                        <div
                          className="emotion-bar"
                          style={{
                            width: `${value * 100}%`,
                            backgroundColor: getMoodColor(emotion)
                          }}
                        />
                      </div>
                      <span className="emotion-value">{(value * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {detectedMood && (
            <div className="mood-actions">
              <a
                href={`/mood-recommendations?mood=${detectedMood}&emotions=${JSON.stringify(emotions)}`}
                className="btn-get-recommendations"
                style={{ backgroundColor: getMoodColor(detectedMood) }}
              >
                🎬 Get Movie Recommendations
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MoodDetection;
