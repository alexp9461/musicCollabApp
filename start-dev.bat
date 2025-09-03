@echo off
echo Starting Music Collab App Development Environment...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3

echo Starting Mobile App...
start "Mobile App" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3000
echo Mobile App: Check the Expo QR code in the second terminal
echo.
pause
