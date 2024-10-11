// Base API URL for authentication endpoints
const API_URL = 'https://private-login-page-backend.onrender.com/api/auth';

// HTML elements
const emailInput = document.getElementById('email');
const verifyEmailBtn = document.getElementById('verifyEmail');
const otpSection = document.getElementById('otpSection');
const otpInput = document.getElementById('otp');
const rememberMeCheckbox = document.getElementById('rememberMe');
const verifyOTPBtn = document.getElementById('verifyOTP');
const loggedInSection = document.getElementById('loggedInSection');
const userEmailSpan = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logout');
const loginForm = document.getElementById('loginForm');

// Event listeners
verifyEmailBtn.addEventListener('click', verifyEmail);
verifyOTPBtn.addEventListener('click', verifyOTP);
logoutBtn.addEventListener('click', logout);

async function verifyEmail() {
    const email = emailInput.value;
    try {
        const response = await fetch(`${API_URL}/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            credentials: 'include' // Important for cookies
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            otpSection.style.display = 'block';
        } else {
            alert(data.message || 'An error occurred while verifying email.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to the server.');
    }
}


async function verifyOTP() {
    const email = emailInput.value;
    const otp = otpInput.value;
    const rememberMe = rememberMeCheckbox.checked;
    try {
        const response = await fetch(`${API_URL}/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, rememberMe }),
            credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
            showLoggedInState(email);
        } else {
            alert(data.message || 'An error occurred while verifying OTP.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while verifying OTP. Please check the console for more details.');
    }
}

function showLoggedInState(email) {
    loginForm.style.display = 'none';
    loggedInSection.style.display = 'block';
    userEmailSpan.textContent = email;
}

async function logout() {
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        if (response.ok) {
            loginForm.style.display = 'block';
            loggedInSection.style.display = 'none';
            otpSection.style.display = 'none';
            emailInput.value = '';
            otpInput.value = '';
            rememberMeCheckbox.checked = false;
        } else {
            const data = await response.json();
            alert(data.message || 'Logout failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while logging out. Please check the console for more details.');
    }
}

async function checkAuth() {
    try {
      const response = await fetch(`${API_URL}/check-auth`, {
        method: 'GET',
        credentials: 'include'  // This is crucial for sending cookies
      });
  
      if (response.ok) {
        const data = await response.json();
        showLoggedInState(data.user.email);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error in checkAuth:', error);
      return false;
    }
  }
  
  window.onload = async function() {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      loginForm.style.display = 'block';
      loggedInSection.style.display = 'none';
    }
  };

// Function to show logged-in UI
function showLoggedInState(email) {
    loginForm.style.display = 'none';
    loggedInSection.style.display = 'block';
    userEmailSpan.textContent = email;
}



// Check authentication status when the page loads
checkAuth();

// Periodically check authentication status
setInterval(checkAuth, 5 * 60 * 1000); // Check every 5 minutes