import Resume from "../models/resume.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const createResume = catchAsync(async (req, res, next) => {
  const newResume = await Resume.create(req.body);

  res.status(201).json({
    success: true,
    message: "Resume created successfully!",
    data: newResume,
  });
});

export const getResumeById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const resume = await Resume.findById(id);

  if (!resume) {
    return next(new AppError("Resume not found", 404));
  }

  res.json({
    success: true,
    data: resume,
  });
});

export const updateResumeById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const resume = await Resume.findByIdAndUpdate(id, req.body, {
    returnDocument:'after',
    runValidators: true,
  });

  if (!resume) {
    return next(new AppError("Resume not found", 404));
  }

  res.json({
    success: true,
    message: "Resume updated successfully!",
    data: resume,
  });
});

export const deleteResumeById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const resume = await Resume.findByIdAndDelete(id);

  if (!resume) {
    return next(new AppError("Resume not found", 404));
  }

  res.json({
    success: true,
    message: "Resume deleted successfully!",
  });
});

export const addSkill = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { skill } = req.body;

  const resume = await Resume.findById(id);
  if (!resume) return next(new AppError("Resume not found", 404));

  if (!resume.skills.includes(skill)) {
    resume.skills.push(skill);
    await resume.save();
  }

  res.json({ success: true, message: "Skill added!", skills: resume.skills });
});

export const removeSkill = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { skill } = req.body;

  const resume = await Resume.findById(id);
  if (!resume) return next(new AppError("Resume not found", 404));

  resume.skills = resume.skills.filter((s) => s !== skill);
  await resume.save();

  res.json({ success: true, message: "Skill removed!", skills: resume.skills });
});

export const addExperience = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { company, position, startDate, endDate, isCurrentJob, description } =
    req.body;

  const resume = await Resume.findById(id);
  if (!resume) return next(new AppError("Resume not found", 404));

  resume.experience.push({
    company,
    position,
    startDate,
    endDate,
    isCurrentJob,
    description,
  });
  await resume.save();

  res.json({
    success: true,
    message: "Experience added!",
    experience: resume.experience,
  });
});

export const updateExperience = catchAsync(async (req, res, next) => {
  const { id, expIndex } = req.params;
  const { company, position, startDate, endDate, isCurrentJob, description } =
    req.body;

  const resume = await Resume.findById(id);
  if (!resume) return next(new AppError("Resume not found", 404));

  const index = parseInt(expIndex);
  if (index < 0 || index >= resume.experience.length) {
    return next(new AppError("Invalid experience index", 400));
  }

  if (company) resume.experience[index].company = company;
  if (position) resume.experience[index].position = position;
  if (startDate) resume.experience[index].startDate = startDate;
  if (endDate) resume.experience[index].endDate = endDate;
  if (isCurrentJob !== undefined)
    resume.experience[index].isCurrentJob = isCurrentJob;
  if (description) resume.experience[index].description = description;

  await resume.save();

  res.json({
    success: true,
    message: "Experience updated!",
    experience: resume.experience,
  });
});

export const removeExperience = catchAsync(async (req, res, next) => {
  const { id, expIndex } = req.params;

  const resume = await Resume.findById(id);
  if (!resume) return next(new AppError("Resume not found", 404));

  const index = parseInt(expIndex);
  if (index < 0 || index >= resume.experience.length) {
    return next(new AppError("Invalid experience index", 400));
  }

  resume.experience.splice(index, 1);
  await resume.save();

  res.json({
    success: true,
    message: "Experience removed!",
    experience: resume.experience,
  });
});

export const addEducation = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { institution, degree, startDate, endDate } = req.body;

  const resume = await Resume.findById(id);
  if (!resume) return next(new AppError("Resume not found", 404));

  resume.education.push({ institution, degree, startDate, endDate });
  await resume.save();

  res.json({
    success: true,
    message: "Education added!",
    education: resume.education,
  });
});

export const updateEducation = catchAsync(async (req, res, next) => {
  const { id, eduIndex } = req.params;
  const { institution, degree, startDate, endDate } = req.body;

  const resume = await Resume.findById(id);
  if (!resume) return next(new AppError("Resume not found", 404));

  const index = parseInt(eduIndex);
  if (index < 0 || index >= resume.education.length) {
    return next(new AppError("Invalid education index", 400));
  }

  if (institution) resume.education[index].institution = institution;
  if (degree) resume.education[index].degree = degree;
  if (startDate) resume.education[index].startDate = startDate;
  if (endDate) resume.education[index].endDate = endDate;

  await resume.save();

  res.json({
    success: true,
    message: "Education updated!",
    education: resume.education,
  });
});

export const removeEducation = catchAsync(async (req, res, next) => {
  const { id, eduIndex } = req.params;

  const resume = await Resume.findById(id);
  if (!resume) return next(new AppError("Resume not found", 404));

  const index = parseInt(eduIndex);
  if (index < 0 || index >= resume.education.length) {
    return next(new AppError("Invalid education index", 400));
  }

  resume.education.splice(index, 1);
  await resume.save();

  res.json({
    success: true,
    message: "Education removed!",
    education: resume.education,
  });
});

export const addProject = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, link, description } = req.body;

  const resume = await Resume.findById(id);
  if (!resume) return next(new AppError("Resume not found", 404));

  resume.projects.push({ title, link, description });
  await resume.save();

  res.json({
    success: true,
    message: "Project added!",
    projects: resume.projects,
  });
});

export const updateProject = catchAsync(async (req, res, next) => {
  const { id, projIndex } = req.params;
  const { title, link, description } = req.body;

  const resume = await Resume.findById(id);
  if (!resume) return next(new AppError("Resume not found", 404));

  const index = parseInt(projIndex);
  if (index < 0 || index >= resume.projects.length) {
    return next(new AppError("Invalid project index", 400));
  }

  if (title) resume.projects[index].title = title;
  if (link !== undefined) resume.projects[index].link = link;
  if (description) resume.projects[index].description = description;

  await resume.save();

  res.json({
    success: true,
    message: "Project updated!",
    projects: resume.projects,
  });
});

export const removeProject = catchAsync(async (req, res, next) => {
  const { id, projIndex } = req.params;

  const resume = await Resume.findById(id);
  if (!resume) return next(new AppError("Resume not found", 404));

  const index = parseInt(projIndex);
  if (index < 0 || index >= resume.projects.length) {
    return next(new AppError("Invalid project index", 400));
  }

  resume.projects.splice(index, 1);
  await resume.save();

  res.json({
    success: true,
    message: "Project removed!",
    projects: resume.projects,
  });
});
