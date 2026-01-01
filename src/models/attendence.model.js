import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  courseId: {
    type: String, 
    required: true
  },
  records: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' 
    },
    name: String,
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT'],
      required: true
    }
  }]
}, { timestamps: true });

// OLD (CommonJS): module.exports = mongoose.model('Attendance', attendanceSchema);
// NEW (ES Modules):
const Attendance = mongoose.model('Attendance', attendanceSchema);
export  { Attendance };