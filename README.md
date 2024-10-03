# Project Assignment: Admin Login Page with OTP Verification and "Remember Me" Feature

---

## Project Overview:
Tasked with creating an **Admin Login Page** where only verified administrators can log in. The login process includes verifying the admin's email address (which must follow a specific format), OTP-based authentication, and a "Remember Me" option for retaining the login session for a day.

---

## Workflow and Detailed Logic:

### 1. Email Verification Step:
- **Email Input Box**: 
  - An input field where the admin enters their email.
  - The email must end with the domain `@99accers.com`. 
  - Example format: `name@99accers.com` (e.g., `sandeep@99accers.com`).
- **Verify Button**:
  - Once the email is entered, the admin clicks on the "Verify" button.
  - Upon clicking, the system checks if the entered email has the correct domain.
    - If correct, the system sends an OTP to the admin's email and shows a message "Verified successfully."
    - If incorrect, it shows an error message "Email doesn't match."
    - Any unexpected error (server issue, etc.) will trigger a message "Login error occurred."
- **Backend Logic**:
  - Upon successful email verification, an OTP is sent to the admin's email via Firebase.
  - This step also dynamically reveals an **OTP input box**, **Submit button**, and a **Remember Me checkbox** below the email input box for further authentication.

### 2. OTP Verification and Login Step:
- **OTP Input Box**:
  - This box becomes visible after the email is verified and the OTP is sent.
  - The admin inputs the OTP received in their email.
- **Submit Button**:
  - After entering the OTP, the admin clicks the **Submit** button.
  - Backend checks if the OTP is correct:
    - If correct, the admin is logged in immediately, and a message "Logged in successfully" is shown.
    - If incorrect, it shows "OTP is incorrect."
    - Any unexpected issue triggers a message "OTP error occurred."
- **Remember Me Checkbox**:
  - This checkbox appears along with the OTP input box.
  - If checked, the admin’s session will be remembered for 24 hours, bypassing the email and OTP verification for future logins within that period.
  - **Backend Logic**: 
    - If "Remember Me" is selected, the session is set to last for 24 hours (using JWT or session cookies). For subsequent logins within this timeframe, the admin is automatically logged in without needing to verify the email or OTP.
    - After 24 hours, the session expires, and the admin must go through the verification process again.

---

## Tech Stack:

### Backend:
- **Node.js** and **Express.js**: For handling server-side logic, routing, and API creation.
- **Firebase**: 
  - **Firebase Authentication**: Used for OTP generation and email sending.
  - **Firebase Firestore (or Realtime Database)**: Used to store the OTP and manage user details.
  - **Firebase Hosting**: Optionally used to deploy the backend.
- **JWT or Session Cookies**: For implementing the "Remember Me" feature.
- **Git**: For version control.

### Frontend:
- **HTML/CSS/JavaScript**: 
  - HTML for creating the structure of the login page.
  - CSS for styling the page (e.g., input fields, buttons, checkboxes, and error/success messages).
  - JavaScript for handling client-side validation and interactions with the backend (using AJAX or Fetch API).

---

## UI Flow:

### Step 1: Initial Login Page
- A login page with an **Email Input Box** and a **Verify Button**.
- User enters the email and clicks on **Verify**.
   
### Step 2: Email Verification
- If the email is correct (ends with `@99accers.com`), an OTP is sent to the email, and an **OTP Input Box**, **Submit Button**, and **Remember Me Checkbox** appear below the email input box.
- If the email is incorrect, an error message is shown.

### Step 3: OTP Submission and Login
- The admin enters the OTP and clicks the **Submit** button.
- If OTP is correct, the admin is logged in immediately, and the message **"Logged in successfully"** appears.
- If OTP is incorrect, the message **"OTP is incorrect"** appears.

### Step 4: Remember Me Functionality
- If the **Remember Me checkbox** is selected, the admin’s session is remembered for 24 hours.
- During this period, when the admin visits the login page again, they are logged in automatically without needing to verify their email or OTP again.
- After 24 hours, the session expires, and the admin must go through the verification process once more.

---

## Error and Success Messages:

### Email Verification:
- **Success**: "Verified successfully."
- **Failure**: "Email doesn't match."
- **Error**: "Login error occurred."

### OTP Verification:
- **Success**: "Logged in successfully."
- **Failure**: "OTP is incorrect."
- **Error**: "OTP error occurred."

### Remember Me:
- **Session Active**: Admin remains logged in for 24 hours without re-verification.
- **Session Expired**: After 24 hours, admin must re-verify.

---

## Backend API Endpoints:

### 1. POST /verify-email
- **Request Body**: `{ email: "admin@99accers.com" }`
- **Function**: Checks if the email has the correct domain and sends OTP.
- **Response**: Success or failure message along with OTP generation.

### 2. POST /verify-otp
- **Request Body**: `{ email: "admin@99accers.com", otp: "123456", rememberMe: true }`
- **Function**: Verifies if the entered OTP matches the one sent to the email. If the "Remember Me" option is checked, a session or token is created to remember the admin for 24 hours.
- **Response**: 
  - If OTP is correct and "Remember Me" is checked, the session persists for 24 hours.
  - If OTP is correct without "Remember Me", admin is logged in only for the current session.
  - If OTP is incorrect, failure message is shown.

### 3. GET /auto-login
- **Request Body**: None (uses token/cookie from the client).
- **Function**: Automatically logs in the admin if a valid session exists (via token or cookie).
- **Response**: Logged in or session expired.

---

## Deployment Plan:

- **Firebase** will be used for OTP management and possibly hosting the backend.
- **JWT or session cookies** will be used to manage the "Remember Me" session for a duration of 24 hours.
- **HTML/CSS/JS** files will be hosted on a web server or integrated with Firebase Hosting.

---

## Example Workflow:

1. **Login Page**:
   - Admin enters: `sandeep@99accers.com`.
   - Clicks the **Verify** button.
   - The system checks if the email matches `@99accers.com` and sends an OTP.

2. **OTP and Remember Me**:
   - OTP input box appears.
   - Admin enters the OTP from the email.
   - Optionally checks the **Remember Me** box.
   - Clicks the **Submit** button.

3. **Login**:
   - If OTP is correct and "Remember Me" is selected, the admin is logged in, and the session persists for 24 hours.
   - If "Remember Me" is not selected, the session ends when the user logs out.

4. **Future Login (if "Remember Me" is selected)**:
   - If the admin returns within 24 hours, they are logged in automatically without email or OTP verification.

---

## Conclusion:
This document outlines the complete functionality and tech stack required for implementing a secure admin login system with email verification, OTP authentication, and a "Remember Me" feature. The login process automatically logs in the admin after successful OTP verification, and if the "Remember Me" option is selected, the session persists for 24 hours for a seamless user experience.
