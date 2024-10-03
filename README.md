# Admin Login Page with OTP Verification and "Remember Me" Feature

A secure admin login page that incorporates email verification, OTP-based authentication, and a "Remember Me" functionality for enhanced user experience.

## 🌟 Live Demo

- Frontend: https://private-login-page.netlify.app/
- Backend API: https://private-login-page-backend.onrender.com/

## 🚀 Features

- **Email Verification**: Ensures only valid administrators can access the system.
- **OTP Authentication**: One-time password sent to the admin’s email for secure login.
- **"Remember Me" Option**: Retains the admin's login session for 24 hours for easier access.
- **User-Friendly UI**: Clear prompts and error/success messages enhance usability.

## 🛠️ Technologies Used

### Backend
- **Node.js**: For server-side logic and API creation.
- **Express.js**: Framework for building the backend API.
- **NodeMailer**: For OTP generation and email sending.
- **Firebase**: 
  - **Firebase Firestore or Realtime Database**: To store user data and manage OTPs.
- **JWT**: For implementing the "Remember Me" feature.
- **Git**: For version control.

### Frontend
- **HTML**: For creating the structure of the login page.
- **CSS**: For styling the input fields, buttons, and messages.
- **JavaScript**: For client-side validation and API interaction.

## 🔧 API Endpoints

| Method | Endpoint           | Description                                       |
|--------|--------------------|---------------------------------------------------|
| POST   | `/verify-email`     | Validates the email and sends OTP to the admin.  |
| POST   | `/verify-otp`       | Checks the OTP entered by the admin for login.   |
| GET    | `/auto-login`       | Automatically logs in the admin if a valid session exists. |

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- Firebase account for authentication setup

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/
   cd 

2. **Install backend dependencies**:
   ```bash
   npm install

3. **Set up Firebase**:
   - Create a Firebase project and enable email/password authentication.
   - Add your Firebase configuration in the backend.
  
4. **Start the backend server**:
   ```bash
   nodemon app.js

5. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install

6. **Start the frontend development server**:
   ```bash
   npm start

7. **Open your browser and navigate to http://localhost:3000**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/sandeepguptax2003/AI-RESUME-BUILDER/issues).

## 📝 License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
