import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { responseService } from '../services/responseService';
import { Response as ResponseType } from '../types';

const Responses: React.FC = () => {
  const { responseId } = useParams<{ responseId: string }>();
  const [response, setResponse] = useState<ResponseType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const fetchResponse = async () => {
      if (!responseId) return;

      // Check if this is a demo response
      if (responseId.startsWith('demo-')) {
        setIsDemo(true);
        setResponse({
          id: parseInt(responseId.replace('demo-', '')),
          userId: 1,
          surveyId: 1,
          submittedAt: new Date().toISOString(),
          answers: [
            { id: 1, responseId: 1, questionId: 1, value: '35' },
            { id: 2, responseId: 1, questionId: 2, value: 'Male' },
            { id: 3, responseId: 1, questionId: 3, value: 'None' },
            { id: 4, responseId: 1, questionId: 4, value: 'Good' }
          ],
          survey: {
            id: 1,
            title: 'Demographic & Health Information Survey',
            description: 'This survey collects information for our machine learning model to predict long-term care needs.',
            createdAt: new Date().toISOString(),
            questions: [
              { id: 1, surveyId: 1, title: 'What is your age?', type: 'number', required: true, orderIndex: 1 },
              { id: 2, surveyId: 1, title: 'What is your gender?', type: 'select', required: true, orderIndex: 2 },
              { id: 3, surveyId: 1, title: 'Do you have any chronic health conditions?', type: 'textarea', required: false, orderIndex: 3 },
              { id: 4, surveyId: 1, title: 'How would you rate your overall health?', type: 'select', required: true, orderIndex: 4 }
            ]
          }
        });
        setLoading(false);
        return;
      }

      try {
        const responseData = await responseService.getResponse(parseInt(responseId));
        setResponse(responseData);
      } catch (err: any) {
        console.error('Error loading response:', err);
        setError(err.response?.data?.message || 'Failed to load response');
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, [responseId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading response...</div>;
  }

  if (error && !isDemo) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!response) {
    return <div>Response not found</div>;
  }

  const getAnswer = (questionId: number) => {
    return response.answers.find(a => a.questionId === questionId)?.value || 'Not answered';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2 text-green-600">Survey Completed!</h1>
        <p className="text-gray-600 mb-4">Thank you for completing the survey. Your responses have been recorded.</p>
        
        {isDemo && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-yellow-700">
              Note: This is a demo response. In a real application, your responses would be saved to the database.
            </p>
          </div>
        )}
        
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Submission Details</h2>
          <p className="text-green-700">
            Submitted on: {new Date(response.submittedAt).toLocaleString()}
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">Your Responses</h2>
        
        <div className="space-y-6">
          {response.survey?.questions.map((question) => (
            <div key={question.id} className="border-b pb-4">
              <h3 className="font-medium text-gray-800 text-lg">{question.title}</h3>
              {question.description && (
                <p className="text-sm text-gray-600 mb-2">{question.description}</p>
              )}
              <p className="text-blue-600 font-medium">{getAnswer(question.id)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Responses;