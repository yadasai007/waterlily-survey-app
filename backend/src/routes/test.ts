import express from 'express';
import { getTestData, createTestSurvey } from '../controllers/testController';

const router = express.Router();

// Public test routes (no authentication required)
router.get('/', getTestData);
router.post('/survey', createTestSurvey);

export default router;