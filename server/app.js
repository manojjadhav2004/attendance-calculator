const express = require('express');
const cors = require('cors');
app.use(cors({
  origin: "https://attendance-calculator-1.onrender.com"
}));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Attendance calculation endpoint
app.get('/api/attendance', (req, res) => {
  try {
    const { total, present } = req.query;
    
    // Parse and validate input
    const totalLectures = parseInt(total);
    const presentLectures = parseInt(present);
    
    // Validation
    if (isNaN(totalLectures) || isNaN(presentLectures)) {
      return res.status(400).json({
        success: false,
        error: 'Total and present lectures must be valid numbers'
      });
    }
    
    if (totalLectures < 0 || presentLectures < 0) {
      return res.status(400).json({
        success: false,
        error: 'Lectures cannot be negative'
      });
    }
    
    if (presentLectures > totalLectures) {
      return res.status(400).json({
        success: false,
        error: 'Present lectures cannot be more than total lectures'
      });
    }
    
    if (totalLectures === 0) {
      return res.status(400).json({
        success: false,
        error: 'Total lectures must be greater than 0'
      });
    }
    // Calculate attendance percentage
const attendancePercentage = (presentLectures / totalLectures) * 100;
const requiredPercentage = 75;

let message = '';
let status = '';
let canBunk = 0;
let mustAttend = 0;

if (attendancePercentage > requiredPercentage) {
  // Calculate how many lectures you can bunk before dropping below 75%
  let x = 0;
  while ((presentLectures / (totalLectures + x)) * 100 >= requiredPercentage) {
    x++;
  }
  canBunk = x - 1;
  status = 'can_bunk';
  message = `You can bunk ${canBunk} lecture${canBunk !== 1 ? 's' : ''} safely.`;

} else if (attendancePercentage === requiredPercentage) {
  status = 'exactly_75';
  message = 'You are exactly at 75%. Don’t miss any more lectures!';

} else {
  // Correct formula for mustAttend
  mustAttend = Math.ceil(
    ((requiredPercentage / 100) * totalLectures - presentLectures) / 0.25
  );

  status = 'must_attend';
  message = `You must attend ${mustAttend} more lecture${mustAttend !== 1 ? 's' : ''} to reach 75%.`;
}

    
    res.json({
      success: true,
      data: {
        totalLectures,
        presentLectures,
        attendancePercentage: Math.round(attendancePercentage * 100) / 100,
        requiredPercentage: 75,
        message,
        status,
        canBunk,
        mustAttend
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST endpoint for the same functionality
app.post('/api/attendance', (req, res) => {
  try {
    const { total, present } = req.body;
    
    // Parse and validate input
    const totalLectures = parseInt(total);
    const presentLectures = parseInt(present);
    
    // Validation
    if (isNaN(totalLectures) || isNaN(presentLectures)) {
      return res.status(400).json({
        success: false,
        error: 'Total and present lectures must be valid numbers'
      });
    }
    
    if (totalLectures < 0 || presentLectures < 0) {
      return res.status(400).json({
        success: false,
        error: 'Lectures cannot be negative'
      });
    }
    
    if (presentLectures > totalLectures) {
      return res.status(400).json({
        success: false,
        error: 'Present lectures cannot be more than total lectures'
      });
    }
    
    if (totalLectures === 0) {
      return res.status(400).json({
        success: false,
        error: 'Total lectures must be greater than 0'
      });
    }
    
    // Calculate attendance percentage
    const attendancePercentage = (presentLectures / totalLectures) * 100;
    const requiredAttendance = 0.75 * totalLectures;
    
    let message = '';
    let status = '';
    let canBunk = 0;
    let mustAttend = 0;
    
    if (presentLectures > requiredAttendance) {
      // Can bunk lectures
      canBunk = Math.floor(presentLectures - requiredAttendance);
      message = `You can bunk ${canBunk} lecture${canBunk !== 1 ? 's' : ''}`;
      status = 'can_bunk';
    } else if (presentLectures < requiredAttendance) {
      // Must attend more lectures
      mustAttend = Math.ceil(requiredAttendance - presentLectures);
      message = `You cannot bunk any lectures. You must attend ${mustAttend} more lecture${mustAttend !== 1 ? 's' : ''} to reach 75%`;
      status = 'must_attend';
    } else {
      // Exactly at 75%
      message = 'You cannot bunk any lectures because you are at 75% attendance';
      status = 'exactly_75';
    }
    
    res.json({
      success: true,
      data: {
        totalLectures,
        presentLectures,
        attendancePercentage: Math.round(attendancePercentage * 100) / 100,
        requiredPercentage: 75,
        message,
        status,
        canBunk,
        mustAttend
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});