import {Attendance} from '../models/attendence.model.js';
import {User} from '../models/user.model.js';
import { sendMessage } from '../utils/WhatsappClient.js';
import {asyncHandler} from "../utils/asyncHandler.js";
import mongoose from 'mongoose';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const markAttendance = asyncHandler( async (req, res) => {
  const { date, courseId, records } = req.body;

  try {
    
    const newRecord = await Attendance.create({ date, courseId, records });

    // 2. Send WhatsApp Messages
    records.forEach(async (record) => {
      // Fetch student to get phone number
      const student = await User.findById(record.studentId);
      
      if (student && student.phone) {
        let msg = "";
        if (record.status === 'PRESENT') {
          msg = `✅ CoachFlow: ${student.fullName} has reached class safely.`;
        } else {
          msg = `🚨 CoachFlow Alert: ${student.fullName} is marked ABSENT today.`;
        }
        
        // Send the message
        sendMessage(student.phone, msg);
      }
    });

    ApiResponse(200, 'Attendance marked successfully', newRecord).send(res);

  } catch (error) {
    throw new ApiError(500, 'Failed to mark attendance');
  }
})

export { markAttendance };