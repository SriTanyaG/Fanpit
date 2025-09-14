@echo off
REM Fanpit Project Setup Script for Windows
REM This script sets up both frontend and backend for the Fanpit project

echo.
echo ==========================================
echo 🎯 Fanpit Project Setup
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js (v18 or higher) first.
    pause
    exit /b 1
)

echo [SUCCESS] Node.js is installed
node --version

REM Check if MongoDB is available
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB is not installed locally. Make sure you have MongoDB running or use MongoDB Atlas.
) else (
    echo [SUCCESS] MongoDB is installed
)

echo.
echo [INFO] Setting up backend...
cd Fanpit-Assesment

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Backend dependencies installed successfully

REM Create .env file if it doesn't exist
if not exist .env (
    echo [INFO] Creating backend .env file...
    (
        echo MONGODB_URI=mongodb://localhost:27017/fanpit
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo FRONTEND_URL=http://localhost:3000
        echo EMAIL_HOST=smtp.gmail.com
        echo EMAIL_PORT=587
        echo EMAIL_USER=your-email@gmail.com
        echo EMAIL_PASS=your-app-password
    ) > .env
    echo [WARNING] Please update the .env file with your actual configuration
) else (
    echo [SUCCESS] Backend .env file already exists
)

cd ..

echo.
echo [INFO] Setting up frontend...
cd fanpit-frontend

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Frontend dependencies installed successfully

REM Create .env.local file if it doesn't exist
if not exist .env.local (
    echo [INFO] Creating frontend .env.local file...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:3001
        echo NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
    ) > .env.local
    echo [WARNING] Please update the .env.local file with your actual configuration
) else (
    echo [SUCCESS] Frontend .env.local file already exists
)

cd ..

echo.
echo ==========================================
echo [SUCCESS] Setup completed successfully!
echo ==========================================
echo.
echo 📋 Next steps:
echo 1. Update environment variables in both .env files
echo 2. Start MongoDB (if using local instance)
echo 3. Start the backend: cd Fanpit-Assesment ^&^& npm run start:dev
echo 4. Start the frontend: cd fanpit-frontend ^&^& npm run dev
echo 5. Open http://localhost:3000 in your browser
echo.
echo 📚 For detailed setup instructions, see README.md
echo.
pause
