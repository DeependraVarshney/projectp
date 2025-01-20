import asyncHandler from "../../utils/asyncHandler.js";
import StudentService from "../../services/student/studentService.js";
import Student from "../../schema/student/studentSchema.js"; // Import the Mongoose model directly

export default class StudentController {
  constructor() {
    this.studentService = new StudentService();
  }
  registerStudent = asyncHandler(async (req, res) => {
    const student = await this.studentService.registerStudent(req.body);
    res.status(student.statusCode).json(student);
  });

  updateProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedProfile = await this.studentService.updateProfile(
      id,
      req.body
    );
    res.status(updatedProfile.statusCode).json(updatedProfile);
  });
  getProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const profile = await this.studentService.getProfile(id);
    res.status(profile.statusCode).json(profile);
  });

  getStudentByRollNo = asyncHandler(async (req, res) => {
    const rollNo = req.rollNo;
    const profile = await this.studentService.getStudentByRollNo(rollNo);
    res.status(profile.statusCode).json(profile);
  });

  //notification controllers for students
  getNotifications = asyncHandler(async (req, res) => {
    const notifications = await this.studentService.getNotifications();
    res.status(notifications.statusCode).json(notifications);
  });

  async completeProfile(req, res) {
    try {
      const { userId, personalInfo, academics } = req.body;

      if (!userId || !personalInfo || !academics) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Check if user exists using the Mongoose model directly
      const existingStudent = await Student.findOne({ user: userId });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: "Student profile already exists",
        });
      }

      const student = await this.studentService.completeProfile(userId, personalInfo, academics);

      return res.status(200).json({
        success: true,
        message: "Profile completed successfully",
        data: { student },
      });
    } catch (error) {
      console.error("Error in completeProfile:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to complete profile",
      });
    }
  }
}
