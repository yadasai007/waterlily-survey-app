import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed...');

  // Clean up existing data
//   console.log('🧹 Cleaning up existing data...');
//   await prisma.answer.deleteMany();
//   await prisma.response.deleteMany();
//   await prisma.question.deleteMany();
//   await prisma.survey.deleteMany();
//   await prisma.user.deleteMany();

  console.log('👥 Creating users...');
  
  // Create multiple users with hashed passwords
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'mike.wilson@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah.johnson@example.com', 
        passwordHash: await bcrypt.hash('password123', 10),
      },
    }),
  ]);

  console.log('✅ Users created:', users.length);

  console.log('📝 Creating surveys...');

  // Create multiple surveys
  const surveys = await Promise.all([
    prisma.survey.create({
      data: {
        title: 'Demographic & Health Information Survey',
        description: 'This survey collects comprehensive demographic and health information for predictive analysis.',
      },
    }),
    prisma.survey.create({
      data: {
        title: 'Mental Health Assessment',
        description: 'A survey to assess mental well-being and stress levels.',
      },
    }),
    prisma.survey.create({
      data: {
        title: 'Financial Wellness Questionnaire',
        description: 'Understanding financial habits and preparedness for future needs.',
      },
    }),
  ]);

  console.log('✅ Surveys created:', surveys.length);

  console.log('❓ Creating questions for surveys...');

  // Create questions for each survey
  const demographicQuestions = await prisma.question.createMany({
    data: [
      {
        surveyId: surveys[0].id,
        title: 'What is your age?',
        description: 'Please enter your current age',
        type: 'number',
        required: true,
        orderIndex: 1,
        options: null
      },
      {
        surveyId: surveys[0].id,
        title: 'What is your gender?',
        description: 'Please select your gender identity',
        type: 'select',
        required: true,
        orderIndex: 2,
        options: JSON.stringify(['Male', 'Female', 'Non-binary', 'Transgender', 'Prefer not to say'])
      },
      {
        surveyId: surveys[0].id,
        title: 'What is your ethnicity?',
        description: 'Please select your ethnic background',
        type: 'select',
        required: true,
        orderIndex: 3,
        options: JSON.stringify([
          'White/Caucasian',
          'Black/African American',
          'Hispanic/Latino',
          'Asian',
          'Native American',
          'Pacific Islander',
          'Multiracial',
          'Other',
          'Prefer not to say'
        ])
      },
      {
        surveyId: surveys[0].id,
        title: 'Do you have any chronic health conditions?',
        description: 'Please list any chronic health conditions you have been diagnosed with',
        type: 'textarea',
        required: false,
        orderIndex: 4,
        options: null
      },
      {
        surveyId: surveys[0].id,
        title: 'How would you rate your overall health?',
        description: 'Select the option that best describes your current health status',
        type: 'select',
        required: true,
        orderIndex: 5,
        options: JSON.stringify(['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'])
      },
      {
        surveyId: surveys[0].id,
        title: 'What is your annual household income?',
        description: 'Please select your approximate annual income range',
        type: 'select',
        required: true,
        orderIndex: 6,
        options: JSON.stringify([
          'Under $25,000',
          '$25,000 - $50,000',
          '$50,000 - $75,000',
          '$75,000 - $100,000',
          '$100,000 - $150,000',
          'Over $150,000',
          'Prefer not to say'
        ])
      },
      {
        surveyId: surveys[0].id,
        title: 'What type of health insurance do you have?',
        description: 'Select all that apply',
        type: 'checkbox',
        required: false,
        orderIndex: 7,
        options: JSON.stringify([
          'Employer-provided',
          'Private insurance',
          'Medicare',
          'Medicaid',
          'VA benefits',
          'No insurance',
          'Prefer not to say'
        ])
      }
    ],
  });

  const mentalHealthQuestions = await prisma.question.createMany({
    data: [
      {
        surveyId: surveys[1].id,
        title: 'How often do you feel stressed?',
        type: 'select',
        required: true,
        orderIndex: 1,
        options: JSON.stringify(['Never', 'Rarely', 'Sometimes', 'Often', 'Always'])
      },
      {
        surveyId: surveys[1].id,
        title: 'Do you have trouble sleeping?',
        type: 'select',
        required: true,
        orderIndex: 2,
        options: JSON.stringify(['Never', 'Rarely', 'Sometimes', 'Often', 'Always'])
      },
      {
        surveyId: surveys[1].id,
        title: 'How would you rate your current mood?',
        type: 'select',
        required: true,
        orderIndex: 3,
        options: JSON.stringify(['Very Poor', 'Poor', 'Neutral', 'Good', 'Excellent'])
      }
    ],
  });

  const financialQuestions = await prisma.question.createMany({
    data: [
      {
        surveyId: surveys[2].id,
        title: 'Do you have an emergency fund?',
        type: 'select',
        required: true,
        orderIndex: 1,
        options: JSON.stringify(['Yes, 6+ months expenses', 'Yes, 3-6 months expenses', 'Yes, less than 3 months', 'No'])
      },
      {
        surveyId: surveys[2].id,
        title: 'How would you rate your financial knowledge?',
        type: 'select',
        required: true,
        orderIndex: 2,
        options: JSON.stringify(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
      }
    ],
  });

  console.log('✅ Questions created for all surveys');

  console.log('📋 Creating sample responses...');

  // Create sample responses from different users
  const responses = await Promise.all([
    // User 1 responses
    prisma.response.create({
      data: {
        userId: users[0].id,
        surveyId: surveys[0].id,
        answers: {
          create: [
            { questionId: 1, value: '35' },
            { questionId: 2, value: 'Male' },
            { questionId: 3, value: 'White/Caucasian' },
            { questionId: 5, value: 'Very Good' },
            { questionId: 6, value: '$75,000 - $100,000' },
            { questionId: 7, value: 'Employer-provided,Private insurance' },
          ],
        },
      },
    }),
    prisma.response.create({
      data: {
        userId: users[0].id,
        surveyId: surveys[1].id,
        answers: {
          create: [
            { questionId: 8, value: 'Sometimes' },
            { questionId: 9, value: 'Rarely' },
            { questionId: 10, value: 'Good' },
          ],
        },
      },
    }),

    // User 2 responses
    prisma.response.create({
      data: {
        userId: users[1].id,
        surveyId: surveys[0].id,
        answers: {
          create: [
            { questionId: 1, value: '28' },
            { questionId: 2, value: 'Female' },
            { questionId: 3, value: 'Asian' },
            { questionId: 4, value: 'Asthma, seasonal allergies' },
            { questionId: 5, value: 'Excellent' },
            { questionId: 6, value: '$50,000 - $75,000' },
            { questionId: 7, value: 'Employer-provided' },
          ],
        },
      },
    }),

    // User 3 responses
    prisma.response.create({
      data: {
        userId: users[2].id,
        surveyId: surveys[0].id,
        answers: {
          create: [
            { questionId: 1, value: '42' },
            { questionId: 2, value: 'Non-binary' },
            { questionId: 3, value: 'Hispanic/Latino' },
            { questionId: 4, value: 'Diabetes, hypertension' },
            { questionId: 5, value: 'Fair' },
            { questionId: 6, value: '$25,000 - $50,000' },
            { questionId: 7, value: 'Medicaid' },
          ],
        },
      },
    }),
    prisma.response.create({
      data: {
        userId: users[2].id,
        surveyId: surveys[2].id,
        answers: {
          create: [
            { questionId: 11, value: 'Yes, less than 3 months' },
            { questionId: 12, value: 'Beginner' },
          ],
        },
      },
    }),

    // User 4 responses
    prisma.response.create({
      data: {
        userId: users[3].id,
        surveyId: surveys[0].id,
        answers: {
          create: [
            { questionId: 1, value: '67' },
            { questionId: 2, value: 'Female' },
            { questionId: 3, value: 'Black/African American' },
            { questionId: 4, value: 'Arthritis, high cholesterol' },
            { questionId: 5, value: 'Good' },
            { questionId: 6, value: 'Prefer not to say' },
            { questionId: 7, value: 'Medicare' },
          ],
        },
      },
    }),
    prisma.response.create({
      data: {
        userId: users[3].id,
        surveyId: surveys[1].id,
        answers: {
          create: [
            { questionId: 8, value: 'Often' },
            { questionId: 9, value: 'Sometimes' },
            { questionId: 10, value: 'Neutral' },
          ],
        },
      },
    }),
    prisma.response.create({
      data: {
        userId: users[3].id,
        surveyId: surveys[2].id,
        answers: {
          create: [
            { questionId: 11, value: 'Yes, 6+ months expenses' },
            { questionId: 12, value: 'Advanced' },
          ],
        },
      },
    }),
  ]);

  console.log('✅ Responses created:', responses.length);

  // Count all records
  const userCount = await prisma.user.count();
  const surveyCount = await prisma.survey.count();
  const questionCount = await prisma.question.count();
  const responseCount = await prisma.response.count();
  const answerCount = await prisma.answer.count();

  console.log('\n📊 Database Seeding Complete!');
  console.log('================================');
  console.log(`👥 Users: ${userCount}`);
  console.log(`📝 Surveys: ${surveyCount}`);
  console.log(`❓ Questions: ${questionCount}`);
  console.log(`📋 Responses: ${responseCount}`);
  console.log(`✅ Answers: ${answerCount}`);
  console.log('================================');

  console.log('\n🔐 Test Login Credentials:');
  console.log('Email: john.doe@example.com / Password: password123');
  console.log('Email: jane.smith@example.com / Password: password123');
  console.log('Email: mike.wilson@example.com / Password: password123');
  console.log('Email: sarah.johnson@example.com / Password: password123');

  console.log('\n🚀 Start your application with: npm run dev');
  console.log('📊 View data with: npx prisma studio');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });