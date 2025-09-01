import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSurvey = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const surveyId = parseInt(id);

    if (isNaN(surveyId)) {
      return res.status(400).json({ message: 'Invalid survey ID' });
    }

    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    res.json(survey);
  } catch (error) {
    console.error('Get survey error:', error);
    res.status(500).json({ message: 'Error fetching survey' });
  }
};

export const submitResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const authReq = req as any;
    const userId = authReq.userId;
    
    const surveyId = parseInt(id);

    if (isNaN(surveyId)) {
      return res.status(400).json({ message: 'Invalid survey ID' });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers array is required' });
    }

    // Check if survey exists
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: { questions: true }
    });

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    // Validate that all required questions are answered
    const requiredQuestions = survey.questions.filter((q: { required: any; }) => q.required);
    const answeredQuestionIds = answers.map(a => a.questionId);
    
    const missingRequiredQuestions = requiredQuestions.filter(
        (      q: { id: any; }) => !answeredQuestionIds.includes(q.id)
    );

    if (missingRequiredQuestions.length > 0) {
      return res.status(400).json({ 
        message: 'Missing answers for required questions',
        missingQuestions: missingRequiredQuestions.map((q: { id: any; }) => q.id)
      });
    }

    // Create response and answers in a transaction
    const result = await prisma.$transaction(async (tx: { response: { create: (arg0: { data: { userId: any; surveyId: number; }; }) => any; }; answer: { create: (arg0: { data: { responseId: any; questionId: any; value: any; }; }) => any; }; }) => {
      // Create the response
      const response = await tx.response.create({
        data: {
          userId,
          surveyId
        }
      });

      // Create all answers
      const answerPromises = answers.map(answer => 
        tx.answer.create({
          data: {
            responseId: response.id,
            questionId: answer.questionId,
            value: answer.value.toString()
          }
        })
      );

      await Promise.all(answerPromises);

      return response;
    });

    // Get the complete response with answers
    const completeResponse = await prisma.response.findUnique({
      where: { id: result.id },
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

    res.status(201).json(completeResponse);
  } catch (error) {
    console.error('Submit response error:', error);
    res.status(500).json({ message: 'Error submitting response' });
  }
};
export const getSurveys = async (req: Request, res: Response) => {
  try {
    const surveys = await prisma.survey.findMany({
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(surveys);
  } catch (error) {
    console.error('Get surveys error:', error);
    res.status(500).json({ message: 'Error fetching surveys' });
  }
};