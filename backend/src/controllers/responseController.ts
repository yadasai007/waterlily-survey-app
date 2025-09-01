import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const authReq = req as any;
    const userId = authReq.userId;
    
    const responseId = parseInt(id);

    if (isNaN(responseId)) {
      return res.status(400).json({ message: 'Invalid response ID' });
    }

    const response = await prisma.response.findUnique({
      where: { id: responseId },
      include: {
        answers: {
          include: {
            question: true
          }
        },
        survey: {
          include: {
            questions: true
          }
        }
      }
    });

    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    // Check if the response belongs to the authenticated user
    if (response.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(response);
  } catch (error) {
    console.error('Get response error:', error);
    res.status(500).json({ message: 'Error fetching response' });
  }
};

export const getUserResponses = async (req: Request, res: Response) => {
  try {
    const authReq = req as any;
    const userId = authReq.userId;

    const responses = await prisma.response.findMany({
      where: { userId },
      include: {
        survey: true,
        answers: {
          include: {
            question: true
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });

    res.json(responses);
  } catch (error) {
    console.error('Get user responses error:', error);
    res.status(500).json({ message: 'Error fetching responses' });
  }
};