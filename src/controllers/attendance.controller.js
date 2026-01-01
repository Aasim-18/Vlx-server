import { Attendance } from '../models/attendence.model.js';
import { User } from '../models/user.model.js';
// 1. Change Import: Point to your Resend service
import { sendEmail } from '../utils/attendanceService.js'; 
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const markAttendance = asyncHandler(async (req, res) => {
  const { date, courseId, records } = req.body;

  // Validate request
  if (!records || records.length === 0) {
    throw new ApiError(400, "No attendance records provided");
  }

  // 2. Create Attendance Record in DB
  const newRecord = await Attendance.create({ date, courseId, records });

  if (!newRecord) {
    throw new ApiError(500, "Failed to create attendance record");
  }

  // 3. Send Emails (Using Promise.all for better performance)
  const emailPromises = records.map(async (record) => {
    try {
      const student = await User.findById(record.studentId);

      // Check for Email instead of Phone
      if (student && student.email) {
        let subject = "";
        let htmlContent = "";

        if (record.status === 'PRESENT') {
          subject = `✅ Safe Arrival: ${student.fullName}`;
          htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #10B981;">Safe Arrival Update</h2>
              <p>Dear Parent,</p>
              <p>This is to inform you that your ward, <strong>${student.fullName}</strong>, has successfully reached the coaching center for the <strong>${courseId}</strong> class.</p>
              <p style="color: #666; font-size: 12px; margin-top: 20px;">Time: ${new Date().toLocaleTimeString()}</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="color: #888; font-size: 12px;">CoachFlow Systems</p>
            </div>
          `;
        } else {
          subject = `🚨 ABSENT ALERT: ${student.fullName}`;
          htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #EF4444;">⚠️ Absent Alert</h2>
              <p>Dear Parent,</p>
              <p>This is a notification that your ward, <strong>${student.fullName}</strong>, has been marked <strong>ABSENT</strong> for the <strong>${courseId}</strong> class today.</p>
              <p>Please contact us immediately if this is an error.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="color: #888; font-size: 12px;">CoachFlow Systems</p>
            </div>
          `;
        }

        // Send Email via Resend
        await sendEmail(student.email, subject, htmlContent);
      }
    } catch (innerError) {
      console.error(`Failed to send email to student ID ${record.studentId}:`, innerError);
      // We do not throw here so other emails can still be sent
    }
  });

  // Wait for all emails to be processed
  await Promise.all(emailPromises);

  return res.status(200).json(
    new ApiResponse(200, newRecord, "Attendance marked and emails sent successfully")
  );
});

export { markAttendance };