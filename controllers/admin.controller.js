import Admin from "../models/admin.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import Resume from "../models/resume.js";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "2d",
  });
};

export const setAdmin = catchAsync(async (req, res, next) => {
  const existingAdmin = await Admin.findOne({});
  if (existingAdmin) {
    return next(
      new AppError("Admin already exists! Please use /login instead.", 400),
    );
  }
  const { username, email, password, phone } = req.body;
  if (!password || !email) {
    return next(new AppError("Please provide email and password", 400)); 
  }

    await Admin.create({ username, email, password, phone });

    res.status(201).json({
      success: true,
      message: "Admin account created! You can now login.",
    });
 
});

export const loginAdmin = catchAsync(async (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return next(new AppError("Please provide credentials!", 400));
  }

  const admin = await Admin.findOne({
    $or: [
      { email: identifier },
      { username: identifier },
    ],
  }).select("+password");

  if (!admin) {
    return next(new AppError("Invalid credentials!", 401));
  }

  const isPasswordCorrect = await admin.comparePassword(password);

  if (!isPasswordCorrect) {
    return next(new AppError("Invalid credentials!", 401));
  }

  const token = createToken(admin._id);

  res.json({
    success: true,
    message: "Logged in successfully!",
    token,
  });
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(new AppError("Please provide current and new password", 400));
  }
  if (newPassword.length < 6) {
    return next(
      new AppError("New password must be at least 6 characters", 400),
    );
  }
  const admin = await Admin.findById(req.adminId).select("+password");
  const isCorrect = await admin.comparePassword(currentPassword);
  if (!isCorrect) {
    return next(new AppError("Current password is incorrect", 401));
  }
  admin.password = newPassword;
  await admin.save();

  res.json({
    success: true,
    message: "Password changed successfully!",
  });
});

export const getAllResumes = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  let filter = {};
  
  if (search) {
    filter = {
      $or: [
        { resumeTitle: { $regex: search, $options: "i" } },
        { "personalInfo.fullName": { $regex: search, $options: "i" } },
        { "personalInfo.email": { $regex: search, $options: "i" } },
      ],
    };
  }

  const [totalResumes, resumes] = await Promise.all([
    Resume.countDocuments(filter),
    Resume.find(filter)
      .select(
        "resumeTitle templateName personalInfo.fullName personalInfo.email createdAt updatedAt",
      )
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
  ]);

  const totalPages = Math.ceil(totalResumes / limit);

  res.json({
    success: true,
    data: {
      resumes,
      pagination: {
        currentPage: page,
        totalPages, 
        totalResumes,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    },
  });
});

export const getResumeDetails = catchAsync(async (req, res, next) => {
  const resume = await Resume.findById(req.params.id);
 
  if (!resume) {
    return next(new AppError("Resume not found", 404));
  }
 
  res.json({
    success: true,
    data: resume,
  });
});

export const adminDeleteResume = catchAsync(async (req, res, next) => {
  const resume = await Resume.findByIdAndDelete(req.params.id);
 
  if (!resume) {
    return next(new AppError("Resume not found", 404));
  }
 
  res.json({
    success: true,
    message: "Resume deleted successfully!",
  });
});

export const bulkDeleteResumes = catchAsync(async (req, res, next) => {
  const { ids } = req.body;
 
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return next(new AppError("Please provide an array of resume IDs", 400));
  }
 
  const result = await Resume.deleteMany({ _id: { $in: ids } });
 
  res.json({
    success: true,
    message: `${result.deletedCount} resume(s) deleted successfully!`,
  });
});

export const getDashboardStats = catchAsync(async (req, res, next) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); 
 
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
 
  const [
    totalResumes,
    todayResumes,
    weekResumes,
    templateStats,
    recentResumes,
    topSkills,
    resumesPerDay,
  ] = await Promise.all([
 
    Resume.countDocuments(),
 
    Resume.countDocuments({ createdAt: { $gte: todayStart } }),
 
    Resume.countDocuments({ createdAt: { $gte: weekAgo } }),
 
    Resume.aggregate([
      { $group: { _id: "$templateName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, template: "$_id", count: 1 } },
    ]),
 
    Resume.find()
      .select(
        "resumeTitle personalInfo.fullName personalInfo.email templateName createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(5),
 
    Resume.aggregate([
      { $unwind: "$skills" },
      { $group: { _id: "$skills", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, skill: "$_id", count: 1 } },
    ]),
 
    Resume.aggregate([
      { $match: { createdAt: { $gte: weekAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", count: 1 } },
    ]),
  ]);
 
  res.json({
    success: true,
    data: {
      overview: {
        totalResumes,
        todayResumes,
        weekResumes,
      },
      templateStats,
      recentResumes,
      topSkills,
      resumesPerDay,
    },
  });
});