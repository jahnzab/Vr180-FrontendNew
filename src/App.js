

import React, { useState, useEffect } from 'react';
import { Upload, Download, Play, User, LogOut, MessageSquare, X, History, } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCallback } from 'react';
//const API_BASE_URL = 'http://localhost:8000';
const API_BASE_URL = 'https://vr180-back.onrender.com';
//const API_BASE_URL='https://53447f14f28e.ngrok-free.app'
const API_BASE_URL ='https://jhanzaib-vr-conversion.hf.space'
const FeedbackHeader = () => {
  const [allFeedback, setAllFeedback] = useState([]);

  const fetchFeedback = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/`);
      if (response.ok) {
        const data = await response.json();
        setAllFeedback(data);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  useEffect(() => {
    fetchFeedback();
    const interval = setInterval(fetchFeedback, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary text-white py-2 px-4">
      <h5 className="mb-1">User Feedback on Jahanzaib's Platform</h5>
      <div style={{ maxHeight: "100px", overflowY: "auto" }}>
        {allFeedback.length > 0 ? (
          allFeedback.map((f, idx) => (
            <div key={idx} className="border-bottom py-1">
              <small>{f.content}</small>
            </div>
          ))
        ) : (
          <small>No feedback yet recorded Jahanzaib.</small>
        )}
      </div>
    </div>
  );
};

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ content: feedback }),
      });

      if (response.ok) {
        setFeedback("");
        setIsOpen(false);
        alert("Feedback submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="position-fixed" style={{ bottom: "20px", right: "20px", zIndex: 1050 }}>
      <h6>Feed back</h6>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary rounded-circle p-3 shadow-lg"
          style={{ width: "60px", height: "60px" }}
        >
          <MessageSquare size={24} />
        </button>
      ) : (
        <div className="card shadow-lg" style={{ width: "320px" }}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">Send Feedback</h6>
            <button onClick={() => setIsOpen(false)} className="btn btn-sm btn-outline-secondary">
              <X size={16} />
            </button>
          </div>
          <div className="card-body">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts, suggestions, or report issues..."
              className="form-control mb-3"
              rows={4}
              style={{ resize: "none" }}
            />
            <button
              onClick={submitFeedback}
              disabled={isSubmitting || !feedback.trim()}
              className="btn btn-primary w-100"
            >
              {isSubmitting ? "Sending..." : "Send Feedback"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const LoginForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { username: formData.username, password: formData.password }
        : formData;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
const data = await response.json();

    if (response.ok) {
      if (isLogin) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('username', formData.username);
        onLogin(formData.username); // This should trigger loadUserConversions
      } else {
        setIsLogin(true);
        alert('Registration successful! Please login.');
      }
    } else {
      alert(data.detail || 'Authentication failed');
    }
  } catch (error) {
    alert('Connection error. Please try again.');
  }
  setIsLoading(false);
};
  //     const data = await response.json();

  //     if (response.ok) {
  //       if (isLogin) {
  //         localStorage.setItem('token', data.access_token);
  //         localStorage.setItem('username', formData.username);
  //         onLogin(formData.username);
  //       } else {
  //         setIsLogin(true);
  //         alert('Registration successful! Please login.');
  //       }
  //     } else {
  //       alert(data.detail || 'Authentication failed');
  //     }
  //   } catch (error) {
  //     alert('Connection error. Please try again.');
  //   }
  //   setIsLoading(false);
  // };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('vr.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow">
              <div className="card-body p-4">
                <h2 className="text-center mb-4 fw-bold">
                  {isLogin ? 'Login' : 'Register'}
                </h2>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                {!isLogin && (
                  <div className="mb-3">
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="form-control"
                    />
                  </div>
                )}
                <div className="mb-3">
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="btn btn-primary w-100 mb-3"
                >
                  {isLoading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
                </button>
                <p className="text-center mb-0">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="btn btn-link p-0 text-decoration-none"
                  >
                    {isLogin ? 'Register' : 'Login'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const PreviousConversions = ({ conversions, onDeleteConversion }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  if (!conversions || conversions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">No previous conversions found.</p>
        <small>Upload and convert your first video to get started!</small>
      </div>
    );
  }

  const handleDownload = async (conversion) => {
    setDownloadingId(conversion.id);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/download/${conversion.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        
        // Check if blob is valid
        if (blob.size === 0) {
          throw new Error('Downloaded file is empty');
        }
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vr180_${conversion.original_filename}`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up after download
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      } else {
        // Try to get error details from response
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Download failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download failed: ${error.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (conversionId) => {
    if (window.confirm('Are you sure you want to delete this conversion? This action cannot be undone.')) {
      setDeletingId(conversionId);
      try {
        await onDeleteConversion(conversionId);
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete conversion. Please try again.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="mt-4">
      <h5 className="mb-3">Previous Conversions</h5>
      {conversions.map(conversion => (
        <div
          key={conversion.id}
          className="card mb-3 shadow-sm"
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <h6 className="card-title mb-1 text-truncate" title={conversion.original_filename}>
                  {conversion.original_filename}
                </h6>
                <small className="text-muted d-block mb-2">
                  Converted: {new Date(conversion.created_at).toLocaleString()}
                </small>
                {conversion.file_size && (
                  <small className="text-muted">
                    Size: {(conversion.file_size / 1024 / 1024).toFixed(2)} MB
                  </small>
                )}
              </div>
              
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleDownload(conversion)}
                  disabled={downloadingId === conversion.id}
                  title="Download VR180 video"
                >
                  {downloadingId === conversion.id ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-1" role="status">
                        <span className="visually-hidden">Downloading...</span>
                      </div>
                      Downloading...
                    </>
                  ) : (
                    'Download'
                  )}
                </button>
                
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(conversion.id)}
                  disabled={deletingId === conversion.id}
                  title="Delete this conversion"
                >
                  {deletingId === conversion.id ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-1" role="status">
                        <span className="visually-hidden">Deleting...</span>
                      </div>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('upload');
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedVideo, setProcessedVideo] = useState(null);
  const [originalFilename, setOriginalFilename] = useState('');
  
  // State for managing conversions
  const [conversions, setConversions] = useState([]);
  const [loadingConversions, setLoadingConversions] = useState(false);
  const [selectedConversion, setSelectedConversion] = useState(null);

   // Define handleLogout first
  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('username');
  //   setUser(null);
  //   setUploadedVideo(null);
  //   setProcessedVideo(null);
  //   setConversions([]);
  //   setSelectedConversion(null);
  // };

  // Define loadUserConversions with useCallback to prevent recreation
  const loadUserConversions = useCallback(async () => {
    setLoadingConversions(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/user/conversions/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("📦 Data received from API:", data);
        setConversions(data);
      } else if (response.status === 403) {
        console.error("Access forbidden - token may be invalid or expired");
        handleLogout();
      } else {
        console.error('Failed to load conversions:', response.status);
      }
    } catch (error) {
      console.error("Error loading conversions:", error);
    } finally {
      setLoadingConversions(false);
    }
  }, []);

  // Handle login success - this should be called after successful login
  const handleLoginSuccess = useCallback((username) => {
    setUser(username);
    loadUserConversions(); // This is the key - load conversions immediately
  }, [loadUserConversions]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setUser(username);
      loadUserConversions();
    }
  }, [loadUserConversions]);

// const loadUserConversions = async () => {
//   setLoadingConversions(true);

//   try {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.error("No authentication token found");
//       return;
//     }

//     // Remove the query parameter and use Authorization header instead
//     const response = await fetch(`${API_BASE_URL}/user/conversions/`, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });
    
//     if (response.ok) {
//       const data = await response.json();
//       setConversions(data);
//     } else if (response.status === 403) {
//       console.error("Access forbidden - token may be invalid or expired");
//       // Handle token expiration by logging out user
//       handleLogout();
//     } else {
//       console.error('Failed to load conversions:', response.status);
//     }
//   } catch (error) {
//     console.error("Error loading conversions:", error);
//   } finally {
//     setLoadingConversions(false);
//   }
// };
// // Handle login success
//   const handleLoginSuccess = (username) => {
//     setUser(username);
//     loadUserConversions(); // Load conversions immediately after login
//   };

 
// useEffect(() => {
//   const token = localStorage.getItem('token');
//   const username = localStorage.getItem('username');
//   if (token && username) {
//     setUser(username);
//     loadUserConversions();
//   }
// }, []);


const handleSelectConversion = (conversion) => {
  setSelectedConversion(conversion);
  setOriginalFilename(conversion.original_filename);
  
  // ✅ Just update the state, don't auto-download
  // handleDownload(conversion); // REMOVE THIS LINE
};


// const handleSelectConversion = (conversion) => {
//   setSelectedConversion(conversion);
//   setOriginalFilename(conversion.original_filename);
  
//   // Download the video when selected
//   handleDownload(conversion);
// };

// You'll need to add this download function
const [downloadingId, setDownloadingId] = useState(null);

const handleDownload = async (conversion) => {
  setDownloadingId(conversion.id); // Show loading state
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/download/${conversion.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vr180_${conversion.original_filename}`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } else {
      throw new Error('Download failed');
    }
  } catch (error) {
    console.error('Download failed:', error);
    alert('Download failed. Please try again.');
  } finally {
    setDownloadingId(null); // Clear loading state
  }
};
  // Handle deleting a conversion
  const handleDeleteConversion = async (conversionId) => {
  if (!window.confirm('Are you sure you want to delete this conversion?')) {
    return;
  }

  try {
    const token = localStorage.getItem('token');
    
    // Use the conversion ID endpoint instead
    await fetch(`${API_BASE_URL}/conversions/${conversionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    // Reload conversions
    loadUserConversions();
    
    // If the deleted conversion was currently selected, clear it
    if (selectedConversion && selectedConversion.id === conversionId) {
      setProcessedVideo(null);
      setSelectedConversion(null);
      setOriginalFilename('');
    }
  } catch (error) {
    console.error('Error deleting conversion:', error);
    alert('Failed to delete conversion');
  }
};
const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    setUploadedVideo(null);
    setProcessedVideo(null);
    setConversions([]);
    setSelectedConversion(null);
  };
  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('username');
  //   setUser(null);
  //   setUploadedVideo(null);
  //   setProcessedVideo(null);
  //   setConversions([]);
  //   setSelectedConversion(null);
  // };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedVideo(file);
    setProcessedVideo(null);
    setSelectedConversion(null);
    setOriginalFilename('');
  };

const processVideo = async () => {
  if (!uploadedVideo) return;

  setIsProcessing(true);
  const formData = new FormData();
  formData.append('video', uploadedVideo);

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/convert/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
      body: formData,
      timeout:1000*60*60,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Video processing failed');
    }

    // Download directly from the response
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vr180_${uploadedVideo.name}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    // Reload conversions to get the latest from server
    loadUserConversions();

    // Reset states
    setUploadedVideo(null);
    setProcessedVideo(null);

    // Show success message
    alert("Conversion completed successfully!");

  } catch (error) {
    console.error("Processing error:", error);
    alert(`Error: ${error.message}`);
  } finally {
    setIsProcessing(false);
  }
};

// Simple function to show working message
const checkWorking = async () => {
  const data = await fetch('/working').then(r => r.json());
  console.log(data.message);
};


setInterval(checkWorking, 60 * 60 * 1000);
// Call this every 10 minutes

 // 5 minutes
const downloadVideo = (filename) => {
  const downloadUrl = `${API_BASE_URL}/download/${filename}`;

  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `vr180_${originalFilename}`;  // Keeps your naming pattern
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
// const downloadVideo = (filename, originalFilename) => {
//   if (!filename) return;

//   const downloadUrl = `${API_BASE_URL}/download/${filename}`;
//   const downloadFilename = originalFilename || filename;

//   console.log("⬇️ Downloading from:", downloadUrl);

//   const a = document.createElement("a");
//   a.href = downloadUrl;
//   a.download = `vr180_${downloadFilename}`;
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
// };

if (!user) {
  return (
    <>
      <LoginForm onLogin={handleLoginSuccess} /> {/* Change this */}
      <FeedbackWidget />
    </>
  );
}

  // if (!user) {
  //   return (
  //     <>
  //       <LoginForm onLogin={setUser} />
  //       <FeedbackWidget />
  //     </>
  //   );
  // }

  return (
    <div className="min-vh-100 bg-light">
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
       <div id="connection-status">
        <div id="connection-indicator"></div>
        <div id="connection-text">Connection</div>
      </div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <span className="navbar-brand mb-0 h1 fw-bold">VR 180 Converter</span>
            <ul className="navbar-nav ms-4">
              <li className="nav-item">
                <button
                  onClick={() => setActiveSection('about')}
                  className={`nav-link btn btn-link ${activeSection === 'about' ? 'active' : ''}`}
                >
                  About
                </button>
              </li>
              <li className="nav-item">
                <button
                  onClick={() => setActiveSection('upload')}
                  className={`nav-link btn btn-link ${activeSection === 'upload' ? 'active' : ''}`}
                >
                  Convert
                </button>
              </li>
              <li className="nav-item">
                <button
                  onClick={() => setActiveSection('history')}
                  className={`nav-link btn btn-link ${activeSection === 'history' ? 'active' : ''}`}
                >
                  <History size={16} className="me-1" />
                  History ({conversions.length})
                </button>
              </li>
            </ul>
          </div>
          <div className="d-flex align-items-center">
            <span className="me-3 d-flex align-items-center text-muted">
              <User size={16} className="me-1" />
              {user}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm d-flex align-items-center"
            >
              <LogOut size={16} className="me-1" />
              Logout
            </button>
          </div>
        </div>
      </nav>
     
      <FeedbackHeader />
      
      <main className="container py-4">
        {activeSection === 'about' && (
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <h2 className="display-6 fw-bold mb-4">About VR 180 Converter</h2>
              <p className="lead text-muted mb-4">
                Transform your regular 2D videos into VR 180 using MiDAS small
                Our platform leverages advanced algorithms to convert standard videos into VR-ready content with
                proper VR180 metadata.
              </p>
              
              <h4 className="fw-bold mb-3">Features:</h4>
              <ul className="list-unstyled">
                <li className="mb-2">• AI-powered 2D to VR 180 conversion</li>
                <li className="mb-2">• FFmpeg VR180 metadata integration</li>
                <li className="mb-2">• High-quality video processing</li>
                <li className="mb-2">• Secure user authentication</li>
                <li className="mb-2">• Persistent video storage</li>
                <li className="mb-2">• Conversion history tracking</li>
              </ul>
              
              <h4 className="fw-bold mb-3 mt-4">How it works:</h4>
              <p className="text-muted">
                Simply upload your 2D video, and our AI will analyze and convert it into a VR 180 format.
                The converted video will include all necessary metadata for compatibility with VR headsets
                . All your conversions are saved and accessible anytime you log in.
              </p>
            </div>
          </div>
        )}

        {activeSection === 'history' && (
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title fw-bold mb-4">
                <History size={24} className="me-2" />
                Conversion History
              </h2>
              {loadingConversions ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <PreviousConversions 
                  conversions={conversions}
                  onSelectConversion={handleSelectConversion}
                  onDeleteConversion={handleDeleteConversion}
                />
              )}
            </div>
          </div>
        )}

        {activeSection === 'upload' && (
          <div className="row">
            <div className="col-12">
              {/* Show conversion complete message or upload section */}
              {processedVideo && !uploadedVideo ? (
                <div className="card shadow-sm mb-4">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="card-title fw-bold mb-0">
                        {selectedConversion ? 'Previous Conversion Ready' : 'VR 180 Conversion Complete!'}
                      </h4>
                      <button
                        onClick={() => {
                          setProcessedVideo(null);
                          setSelectedConversion(null);
                          setOriginalFilename('');
                        }}
                        className="btn btn-outline-secondary"
                      >
                        Convert New Video
                      </button>
                    </div>
                    
                    {selectedConversion && (
                      <div className="alert alert-info" role="alert">
                        <strong>Previously converted:</strong> {originalFilename}
                        <br />
                        <small>Converted on: {new Date(selectedConversion.created_at).toLocaleString()}</small>
                      </div>
                    )}

                    {!selectedConversion && (
                      <div className="alert alert-success" role="alert">
                        <strong>✓ Success!</strong> Your video has been successfully converted to VR 180 format
                      </div>
                    )}

                    {/* Download Card */}
                    <div className="card bg-light mb-4">
                      <div className="card-body text-center p-4">
                        <div className="mb-3">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex">
                            <Download size={32} className="text-primary" />
                          </div>
                        </div>
                        <h5 className="card-title">VR180 Video Ready</h5>
                        <p className="card-text text-muted">
                          <strong>Original:</strong> {originalFilename}
                        </p>
                        <p className="card-text">
                          <small className="text-muted">
                            Format: VR180 Side-by-Side • Compatible with: Oculus, YouTube VR, Google Cardboard
                          </small>
                        </p>
                        <button 
                          className="btn btn-primary btn-lg" 
                          onClick={() => downloadVideo()}
                        >
                          <Download size={20} className="me-2" />
                          Download VR180 Video
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Upload Section */
                <div className="card shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h2 className="card-title fw-bold mb-4">Convert Your Video</h2>
                    
                    {!uploadedVideo ? (
                      <div className="border border-2 border-dashed rounded p-5 text-center bg-light">
                        <input
                          type="file"
                          id="video-upload"
                          accept="video/*"
                          onChange={handleFileUpload}
                          className="d-none"
                        />
                        <label
                          htmlFor="video-upload"
                          className="cursor-pointer d-flex flex-column align-items-center"
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="bg-primary bg-opacity-10 rounded-circle p-4 mb-3">
                            <Upload size={48} className="text-primary" />
                          </div>
                          <h5 className="fw-bold">Upload your 2D video</h5>
                          <p className="text-muted">Click here or drag and drop your video file</p>
                          {conversions.length > 0 && (
                            <small className="text-info">
                              Or check your <button 
                                onClick={() => setActiveSection('history')} 
                                className="btn btn-link p-0 text-decoration-none"
                              >
                                conversion history
                              </button> for previous videos
                            </small>
                          )}
                        </label>
                      </div>
                    ) : (
                      <div>
                        <div className="bg-light rounded p-4 mb-4">
                          <h5 className="fw-bold mb-3">Uploaded Video</h5>
                          <div className="d-flex align-items-center">
                            <Play size={24} className="text-primary me-3" />
                            <div>
                              <h6 className="fw-bold mb-1">{uploadedVideo.name}</h6>
                              <small className="text-muted">
                                {(uploadedVideo.size / 1024 / 1024).toFixed(2)} MB
                              </small>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex gap-3">
                          <button
                            onClick={processVideo}
                            disabled={isProcessing}
                            className="btn btn-primary"
                          >
                            {isProcessing ? (
                              <>
                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                                Processing...
                              </>
                            ) : (
                              'Convert to VR 180'
                            )}
                          </button>
                          
                          <button
                            onClick={() => {
                              setUploadedVideo(null);
                            }}
                            className="btn btn-outline-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                        
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <FeedbackWidget />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default App;
