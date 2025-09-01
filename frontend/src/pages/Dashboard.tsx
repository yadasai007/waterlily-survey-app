import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { responseService } from '../services/responseService';
import { Response, Survey } from '../types';

// ... existing imports ...
import { surveyService } from '../services/surveyService';

const Dashboard: React.FC = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get available surveys
        const surveysData = await surveyService.getSurveys();
        setSurveys(surveysData);

        // Get user responses
        const responsesData = await responseService.getUserResponses();
        setResponses(responsesData);
      } catch (err: any) {
        console.error('Failed to load data:', err);
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ... rest of the component remains similar, but make sure to use surveys from state ...

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Waterlily Surveys</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Help us predict long-term care needs by completing our demographic and health information survey.
        </p>
      </div>

      {/* Surveys Section */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Surveys</h2>
        
        {surveys.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {surveys.map(survey => (
              <div key={survey.id} className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{survey.title}</h3>
                    <p className="text-gray-600 text-sm">{survey.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <span className="text-sm text-gray-500">
                    {survey.questions?.length || 0} questions
                  </span>
                  <Link
                    to={`/survey/${survey.id}`}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Start Survey
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No surveys available at the moment.</p>
          </div>
        )}
      </div>

      {/* Previous Responses Section */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Previous Responses</h2>
        
        {responses.length === 0 ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500">You haven't completed any surveys yet.</p>
            <p className="text-gray-400 text-sm mt-1">Complete a survey to see your responses here.</p>
          </div>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Survey
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {responses.map((response) => (
                  <tr key={response.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {response.survey?.title || 'Survey'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {response.answers.length} answered
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(response.submittedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/responses/${response.id}`}
                        className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;