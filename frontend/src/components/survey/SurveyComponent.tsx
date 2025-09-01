import React, { useState, useEffect } from 'react';
import { surveyService } from '../../services/surveyService';
import Question from './QuestionComponent';

interface SurveyProps {
  surveyId: number;
  onSubmit: (answers: any[]) => void;
}

const SurveyComponent: React.FC<SurveyProps> = ({ surveyId, onSubmit }) => {
  const [survey, setSurvey] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const surveyData = await surveyService.getSurvey(surveyId);
        setSurvey(surveyData);
      } catch (err) {
        setError('Failed to load survey');
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [surveyId]);

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const answerArray = Object.entries(answers).map(([questionId, value]) => ({
      questionId: parseInt(questionId),
      value
    }));
    onSubmit(answerArray);
  };

  if (loading) return <div>Loading survey...</div>;
  if (error) return <div>{error}</div>;
  if (!survey) return <div>Survey not found</div>;

  const currentQuestion = survey.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{survey.title}</h1>
      <p className="text-gray-600 mb-6">{survey.description}</p>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-600 h-2 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Question */}
      <Question
        question={currentQuestion}
        value={answers[currentQuestion.id] || ''}
        onChange={(value) => handleAnswer(currentQuestion.id, value)}
      />
      
      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        
        {currentQuestionIndex < survey.questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id] && currentQuestion.required}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!answers[currentQuestion.id] && currentQuestion.required}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default SurveyComponent;