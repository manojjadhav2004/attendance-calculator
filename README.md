# 🎓 Attendance Calculator - Full Stack Application

A modern, full-stack web application that helps students calculate whether they can bunk lectures or need to attend more to maintain the required 75% attendance.

## ✨ Features

### Frontend (React + Tailwind CSS)
- **Modern UI**: Clean, responsive design with smooth animations
- **Real-time Calculations**: Dynamic attendance percentage display
- **Color-coded Results**: Green (can bunk), Red (must attend), Yellow (exactly 75%)
- **Input Validation**: Prevents negative numbers and invalid inputs
- **Smooth Animations**: Powered by Framer Motion for engaging user experience

### Backend (Express.js)
- **RESTful API**: GET and POST endpoints for attendance calculations
- **Robust Validation**: Server-side input validation and error handling
- **Attendance Logic**: 
  - Calculate if student can bunk lectures
  - Determine how many more lectures needed for 75%
  - Handle exact 75% attendance scenarios
- **CORS Support**: Cross-origin resource sharing for frontend integration

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   npm run server:install
   ```

2. **Start the development servers:**
   ```bash
   npm run dev
   ```
   This will start both the frontend (port 3000) and backend (port 3001) concurrently.

   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   npm run server:dev

   # Terminal 2 - Frontend  
   npm run start:frontend
   ```

3. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api/health

## 📡 API Endpoints

### GET `/api/attendance`
Calculate attendance with query parameters:
```
GET /api/attendance?total=100&present=80
```

### POST `/api/attendance`
Calculate attendance with JSON body:
```json
{
  "total": 100,
  "present": 80
}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "totalLectures": 100,
    "presentLectures": 80,
    "attendancePercentage": 80,
    "requiredPercentage": 75,
    "message": "You can bunk 5 lectures",
    "status": "can_bunk",
    "canBunk": 5,
    "mustAttend": 0
  }
}
```

## 🎯 Attendance Rules

- **75% Rule**: Minimum attendance requirement
- **Can Bunk**: When attendance > 75%
- **Must Attend**: When attendance < 75%
- **Exactly 75%**: Cannot bunk any lectures

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful icons
- **Vite**: Fast build tool and development server

### Backend
- **Express.js**: Web application framework
- **CORS**: Cross-origin resource sharing
- **Node.js**: JavaScript runtime environment

## 🏗️ Project Structure

```
attendance-calculator-fullstack/
├── src/                    # Frontend React application
│   ├── App.tsx            # Main React component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── server/                 # Backend Express application
│   ├── app.js             # Express server and API routes
│   └── package.json       # Backend dependencies
├── package.json           # Frontend dependencies and scripts
└── README.md              # Project documentation
```

## 🚢 Deployment

### Frontend (Static)
```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

### Backend (Node.js)
```bash
cd server
npm start
# Deploy to your Node.js hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔧 Development

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server:dev` - Start only the backend server
- `npm run start:frontend` - Start only the frontend
- `npm run build` - Build the frontend for production
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview the production build

### Environment Variables

The application works with default settings, but you can customize:

- `PORT` - Backend server port (default: 3001)
- `VITE_API_URL` - Frontend API base URL (default: http://localhost:3001)

---

Made with ❤️ for students who want to optimize their attendance strategy!