import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calculator, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface AttendanceResult {
  totalLectures: number;
  presentLectures: number;
  attendancePercentage: number;
  requiredPercentage: number;
  message: string;
  status: 'can_bunk' | 'must_attend' | 'exactly_75';
  canBunk: number;
  mustAttend: number;
}

function App() {
  const [totalLectures, setTotalLectures] = useState<string>('');
  const [presentLectures, setPresentLectures] = useState<string>('');
  const [result, setResult] = useState<AttendanceResult | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const calculateAttendance = async () => {
    if (!totalLectures || !presentLectures) {
      setError('Please fill in both fields');
      return;
    }

    // Add validation: present lectures cannot be greater than total lectures
    if (parseInt(presentLectures) > parseInt(totalLectures)) {
      setError('Number of lectures attended cannot be greater than total lectures.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
    // update  it for loacl host
      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/attendance?total=${totalLectures}&present=${presentLectures}`
);

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        setError('');
      } else {
        setError(data.error);
        setResult(null);
      }
    } catch (err) {
      setError('Failed to connect to server. Please make sure the backend is running.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'can_bunk':
        return 'text-green-600';
      case 'must_attend':
        return 'text-red-600';
      case 'exactly_75':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'can_bunk':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'must_attend':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'exactly_75':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const currentPercentage = totalLectures && presentLectures 
    ? Math.round((parseInt(presentLectures) / parseInt(totalLectures)) * 10000) / 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Attendance Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Check if you can bunk lectures or need to attend more (75% rule)
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Total Number of Lectures
                </label>
                <input
                  type="number"
                  value={totalLectures}
                  onChange={(e) => setTotalLectures(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="Enter total lectures"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Lectures Attended
                </label>
                <input
                  type="number"
                  value={presentLectures}
                  onChange={(e) => setPresentLectures(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="Enter attended lectures"
                  min="0"
                />
              </div>
            </div>

            {/* Current Percentage Display */}
            {totalLectures && presentLectures && parseInt(totalLectures) > 0 && parseInt(presentLectures) <= parseInt(totalLectures) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-50 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Current Attendance
                  </span>
                  <span className={`text-lg font-bold ${currentPercentage >= 75 ? 'text-green-600' : currentPercentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {currentPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(currentPercentage, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-3 rounded-full ${getProgressBarColor(currentPercentage)}`}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span className="font-medium">75% Required</span>
                  <span>100%</span>
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={calculateAttendance}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Calculator className="w-6 h-6" />
                </motion.div>
              ) : (
                <Calculator className="w-6 h-6" />
              )}
              {loading ? 'Calculating...' : 'Check Attendance'}
            </motion.button>
          </div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  {getStatusIcon(result.status)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Attendance Result
                </h3>
              </div>

              <div className="space-y-6">
                {/* Main Message */}
                <div className={`text-xl font-semibold text-center p-4 rounded-xl ${result.status === 'can_bunk' ? 'bg-green-50' : result.status === 'must_attend' ? 'bg-red-50' : 'bg-yellow-50'}`}>
                  <p className={getStatusColor(result.status)}>
                    {result.message}
                  </p>
                </div>

                {/* Statistics */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-indigo-600">
                      {result.attendancePercentage}%
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Current Attendance
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-purple-600">
                      {result.presentLectures}/{result.totalLectures}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Lectures Attended
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-green-600">
                      {result.requiredPercentage}%
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Required Minimum
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                {result.status === 'can_bunk' && result.canBunk > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-green-800">
                      <span className="font-semibold">Great news!</span> You're ahead of the 75% requirement. 
                      You can afford to miss up to <span className="font-bold">{result.canBunk}</span> more lecture{result.canBunk !== 1 ? 's' : ''} 
                      and still maintain the minimum attendance.
                    </p>
                  </div>
                )}

                {result.status === 'must_attend' && result.mustAttend > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-800">
                      <span className="font-semibold">Attention needed!</span> You need to attend 
                      <span className="font-bold"> {result.mustAttend}</span> more lecture{result.mustAttend !== 1 ? 's' : ''} 
                      to reach the minimum 75% attendance requirement.
                    </p>
                  </div>
                )}

                {result.status === 'exactly_75' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-yellow-800">
                      <span className="font-semibold">Perfect balance!</span> You're exactly at the 75% requirement. 
                      Missing any more lectures will put you below the minimum attendance threshold.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 text-gray-500"
        >
          <p className="text-sm">
            Made with ❤️ by Manoj R Jadhav😊
          </p>
          
        </motion.div>
      </div>
    </div>
  );
}

export default App;