import express from 'express';
import {
  createResume,
  getResumeById,
  updateResumeById,
  deleteResumeById,
  addSkill,
  removeSkill,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addProject,
  updateProject,
  removeProject
} from '../controllers/resume.controller.js';

const router = express.Router();

router.route('/')
  .post(createResume); 

router.route('/:id')
  .get(getResumeById)       
  .put(updateResumeById)    
  .delete(deleteResumeById);

router.route('/:id/skills')
  .post(addSkill)      
  .delete(removeSkill); 

router.route('/:id/experience')
  .post(addExperience); 

router.route('/:id/experience/:expIndex')
  .put(updateExperience)     
  .delete(removeExperience); 

router.route('/:id/education')
  .post(addEducation); 

router.route('/:id/education/:eduIndex')
  .put(updateEducation)     
  .delete(removeEducation); 

router.route('/:id/projects')
  .post(addProject);

router.route('/:id/projects/:projIndex')
  .put(updateProject)     
  .delete(removeProject); 

export default router;