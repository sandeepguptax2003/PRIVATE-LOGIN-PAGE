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

// Event listeners to buttons for email verification, OTP verification, and logout
verifyEmailBtn.addEventListener('click', verifyEmail);
verifyOTPBtn.addEventListener('click', verifyOTP);
logoutBtn.addEventListener('click', logout);

// Function to verify email by sending a POST request to the server
async function verifyEmail() {
    const email = emailInput.value; // Get the email entered by the user
    try {
        const response = await fetch(`${API_URL}/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }) // Send email in the request body
        });
        const data = await response.json();
        if (response.ok) {
            // If email verification is successful, alert the user and display the OTP section
            alert(data.message);
            otpSection.style.display = 'block';
        } else {
            // If there is an error, show the error message
            alert(data.message);
        }
    } catch (error) {
        // Handle any errors during the email verification process
        console.error('Error:', error);
        alert('An error occurred while verifying email.');
    }
}

// Function to verify OTP by sending a POST request to the server
async function verifyOTP() {
    const email = emailInput.value; // Get the email entered by the user
    const otp = otpInput.value;     // Get the OTP entered by the user
    const rememberMe = rememberMeCheckbox.checked; // Check if "Remember me" is selected
    try {
        const response = await fetch(`${API_URL}/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, rememberMe }) // Send email, OTP, and rememberMe status
        });
        const data = await response.json();
        if (response.ok) {
            // If OTP is correct, store the token and email in local storage
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', email);
            showLoggedInState(email); // Show the logged-in state
        } else {
            // If OTP is incorrect, show the error message
            alert(data.message);
        }
    } catch (error) {
        // Handle any errors during the OTP verification process
        console.error('Error:', error);
        alert('An error occurred while verifying OTP.');
    }
}

// Function to show the logged-in state (after successful login)
function showLoggedInState(email) {
    loginForm.style.display = 'none';           // Hide the login form
    loggedInSection.style.display = 'block';    // Show the logged-in section
    userEmailSpan.textContent = email;          // Display the logged-in user's email
}

// Function to handle logout
function logout() {
    localStorage.removeItem('token');  // Remove the stored token
    localStorage.removeItem('email');  // Remove the stored email
    loginForm.style.display = 'block'; // Show the login form again
    loggedInSection.style.display = 'none'; // Hide the logged-in section
    otpSection.style.display = 'none';     // Hide the OTP section
    emailInput.value = '';                 // Clear the email input field
    otpInput.value = '';                   // Clear the OTP input field
    rememberMeCheckbox.checked = false;    // Uncheck the "Remember me" checkbox
}

// Function to automatically log in the user if they have a valid token
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch(`${API_URL}/check-auth`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                showLoggedInState(data.user.email);
                return true;
            } else {
                logout();
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            logout();
            return false;
        }
    }
    return false;
}

// Updated autoLogin function
async function autoLogin() {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) {
        const isAuthenticated = await checkAuth();
        if (isAuthenticated) {
            showLoggedInState(email);
        }
    }
}
// Try to automatically log in the user when the page loads
autoLogin();

// interval to periodically check authentication status
setInterval(checkAuth, 5 * 60 * 1000); // Check every 5 minutes
