import express from 'express';
import { getResponse, getUserResponses } from '../controllers/responseController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Protected routes
router.get('/user', authenticateToken, getUserResponses);
router.get('/:id', authenticateToken, getResponse);

export default router;