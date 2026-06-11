import express from "express";
import {
  setAdmin,
  loginAdmin,
  changePassword,
  getAllResumes,
  getResumeDetails,
  adminDeleteResume,
  bulkDeleteResumes,
  getDashboardStats,
} from "../controllers/admin.controller.js";
import protectAdmin from "../middleware/auth.middleware.js";
 
const adminRouter = express.Router();

adminRouter.post("/setup", setAdmin);
adminRouter.post("/login", loginAdmin);

adminRouter.use(protectAdmin);

adminRouter.put("/change-password", changePassword);
adminRouter.get("/stats", getDashboardStats);
adminRouter.get("/resumes", getAllResumes);
adminRouter.delete("/resumes/bulk", bulkDeleteResumes);

adminRouter.get("/resumes/:id", getResumeDetails);
adminRouter.delete("/resumes/:id", adminDeleteResume);
 
export default adminRouter;