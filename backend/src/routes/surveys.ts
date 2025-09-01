import express from 'express';
import { getSurvey, submitResponse, getSurveys } from '../controllers/surveyController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all surveys
router.get('/', authenticateToken, getSurveys);

// Get specific survey
router.get('/:id', authenticateToken, getSurvey);

// Submit response to survey
router.post('/:id/responses', authenticateToken, submitResponse);

export default router;