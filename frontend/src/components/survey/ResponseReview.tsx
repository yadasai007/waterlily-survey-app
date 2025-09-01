import React from 'react';

interface ResponseReviewProps {
  survey: any;
  answers: any[];
}

const ResponseReview: React.FC<ResponseReviewProps> = ({ survey, answers }) => {
  const getAnswer = (questionId: number) => {
    return answers.find(a => a.questionId === questionId)?.value || 'Not answered';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Response Submitted</h1>
      <p className="text-green-600 mb-6">Thank you for completing the survey!</p>
      
      <h2 className="text-xl font-semibold mb-4">Your Responses</h2>
      
      <div className="space-y-4">
        {survey.questions.map((question: any) => (
          <div key={question.id} className="border-b pb-4">
            <h3 className="font-medium text-gray-800">{question.title}</h3>
            {question.description && (
              <p className="text-sm text-gray-600 mb-2">{question.description}</p>
            )}
            <p className="text-blue-600">{getAnswer(question.id)}</p>
          </div>
        ))}
      </div>
      
      <button
        onClick={() => window.location.href = '/'}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Return to Dashboard
      </button>
    </div>
  );
};

export default ResponseReview;