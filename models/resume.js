import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  resumeTitle: {
    type: String,
    required: true,
    default: 'My Resume' 
  },
  templateName: {
    type: String,
    default: "Modern"
  },
  personalInfo: {
    fullName: {
      type: String,
      required: true 
    },
    email: {
      type: String,
      required: true 
    },
    phone: String,
    city: String,
    state: String,
    linkedInUrl: String,
    githubUrl: String,
    summary: String 
  },
  skills: [String],
  experience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    isCurrentJob: {
      type: Boolean,
      default: false
    },
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    startDate: String,
    endDate: String,
    percentage: String
  }],
  projects: [{
    title: String,
    link: String,
    description: String
  }]
}, { timestamps: true });

const Resume =
  mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

export default Resume;