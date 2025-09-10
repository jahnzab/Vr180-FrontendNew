// Session and authentication utilities

// ==================== SESSION MANAGEMENT ====================
let keepAliveInterval = null;
let sessionCheckInterval = null;
let lastActivityTime = Date.now();

// Enhanced keep-alive function
export const maintainSession = async () => {
  try {
    console.log('🔄 Refreshing session keep-alive...');
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found, skipping keep-alive');
      return false;
    }
    
    const response = await fetch('/auth/keep-alive', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Session-KeepAlive': 'true'
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    console.log('✅ Session kept alive:', data.message);
    lastActivityTime = Date.now();
    updateActivityIndicator(true);
    return true;
    
  } catch (error) {
    console.warn('❌ Keep-alive failed:', error.message);
    updateActivityIndicator(false);
    return false;
  }
};

// Check system status
export const checkSystemStatus = async () => {
  try {
    const response = await fetch('/working', { signal: AbortSignal.timeout(8000) });
    const data = await response.json();
    console.log('🖥️ System status:', data.message);
    return data;
  } catch (error) {
    console.warn('System status check failed:', error.message);
    return null;
  }
};

// Check session validity
export const checkSessionValidity = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    const response = await fetch('/auth/session-status', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (data.valid) {
      console.log('✅ Session is valid');
      return true;
    }
    throw new Error('Session invalid');
  } catch (error) {
    console.error('❌ Session validation failed:', error.message);
    attemptTokenRefresh();
    return false;
  }
};

// Update activity indicator
const updateActivityIndicator = (isActive) => {
  const indicator = document.getElementById('connection-indicator') || createConnectionIndicator();
  indicator.className = isActive ? 'connection-active' : 'connection-inactive';
  indicator.title = isActive ? 'Connection active' : 'Connection issues';
};

// Create connection indicator UI
const createConnectionIndicator = () => {
  const indicator = document.createElement('div');
  indicator.id = 'connection-indicator';
  indicator.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    width: 20px; height: 20px; border-radius: 50%;
    z-index: 10000; border: 2px solid white;
  `;
  document.body.appendChild(indicator);
  return indicator;
};

// Add CSS styles
const addConnectionStyles = () => {
  if (document.getElementById('connection-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'connection-styles';
  style.textContent = `
    .connection-active { background-color: #00b894; box-shadow: 0 0 10px #00b894; }
    .connection-inactive { background-color: #ff7675; box-shadow: 0 0 10px #ff7675; animation: pulse 1s infinite; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
  `;
  document.head.appendChild(style);
};

// Update last activity timestamp
export const updateLastActivity = () => {
  lastActivityTime = Date.now();
};

// Start session maintenance
export const startSessionMaintenance = () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  console.log('🚀 Starting session maintenance system');
  addConnectionStyles();
  
  // Initial checks
  checkSystemStatus();
  maintainSession();
  
  // Set up intervals
  keepAliveInterval = setInterval(maintainSession, 4 * 60 * 1000);
  sessionCheckInterval = setInterval(checkSessionValidity, 30 * 60 * 1000);
  
  // Track user activity
  document.addEventListener('mousemove', updateLastActivity);
  document.addEventListener('keypress', updateLastActivity);
};

// Stop session maintenance
export const stopSessionMaintenance = () => {
  if (keepAliveInterval) clearInterval(keepAliveInterval);
  if (sessionCheckInterval) clearInterval(sessionCheckInterval);
  
  document.removeEventListener('mousemove', updateLastActivity);
  document.removeEventListener('keypress', updateLastActivity);
  
  console.log('🛑 Stopped session maintenance');
};

// ==================== AUTH UTILITIES ====================
// Token management
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const setRefreshToken = (refreshToken) => localStorage.setItem('refreshToken', refreshToken);
export const removeRefreshToken = () => localStorage.removeItem('refreshToken');

export const isAuthenticated = () => !!getToken();

export const logout = () => {
  removeToken();
  removeRefreshToken();
  stopSessionMaintenance();
  window.location.href = '/login';
};

// Token refresh function
export const attemptTokenRefresh = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');
    
    const response = await fetch('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    
    if (response.ok) {
      const data = await response.json();
      setToken(data.access_token);
      console.log('✅ Token refreshed successfully');
      return true;
    }
    throw new Error('Refresh failed');
  } catch (error) {
    console.error('❌ Token refresh failed:', error.message);
    logout();
    return false;
  }
};

// Session manager object
export const sessionManager = {
  start: startSessionMaintenance,
  stop: stopSessionMaintenance,
  refresh: maintainSession,
  checkStatus: checkSystemStatus,
  checkValidity: checkSessionValidity,
  updateActivity: updateLastActivity,
  isAuthenticated,
  logout
};

export default sessionManager;