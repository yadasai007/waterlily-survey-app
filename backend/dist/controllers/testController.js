"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestSurvey = exports.getTestData = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTestData = async (req, res) => {
    try {
        // Get basic info about the application
        const surveyCount = await prisma.survey.count();
        const questionCount = await prisma.question.count();
        const userCount = await prisma.user.count();
        const responseCount = await prisma.response.count();
        res.json({
            message: 'Waterlily Survey API is working!',
            timestamp: new Date().toISOString(),
            data: {
                surveys: surveyCount,
                questions: questionCount,
                users: userCount,
                responses: responseCount
            },
            endpoints: {
                auth: {
                    register: 'POST /api/auth/register',
                    login: 'POST /api/auth/login',
                    currentUser: 'GET /api/auth/me (protected)'
                },
                surveys: {
                    getSurvey: 'GET /api/surveys/:id (protected)',
                    submitResponse: 'POST /api/surveys/:id/responses (protected)'
                },
                responses: {
                    getUserResponses: 'GET /api/responses/user (protected)',
                    getResponse: 'GET /api/responses/:id (protected)'
                },
                test: 'GET /api/test'
            }
        });
    }
    catch (error) {
        console.error('Test endpoint error:', error);
        res.status(500).json({
            message: 'Error connecting to database',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getTestData = getTestData;
const createTestSurvey = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        const survey = await prisma.survey.create({
            data: {
                title: title || 'Test Survey',
                description: description || 'A test survey created via API',
                questions: {
                    create: [
                        {
                            title: 'Test Question 1',
                            type: 'text',
                            required: false,
                            orderIndex: 1
                        },
                        {
                            title: 'Test Question 2',
                            type: 'number',
                            required: true,
                            orderIndex: 2
                        }
                    ]
                }
            },
            include: {
                questions: true
            }
        });
        res.status(201).json({
            message: 'Test survey created successfully',
            survey
        });
    }
    catch (error) {
        console.error('Create test survey error:', error);
        res.status(500).json({
            message: 'Error creating test survey',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createTestSurvey = createTestSurvey;
