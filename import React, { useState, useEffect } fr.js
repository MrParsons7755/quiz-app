import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await window.fs.readFile('revision.xlsx');
        const workbook = XLSX.read(response, {
          type: 'array',
          cellDates: true,
          cellNF: true,
          cellText: true
        });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        const formattedQuestions = data.map(row => ({
          question: row.Question || row.question,
          answer: row.Answer || row.answer
        })).filter(q => q.question && q.answer);

        setQuestions(formattedQuestions);
        if (formattedQuestions.length > 0) {
          setCurrentQuestion(formattedQuestions[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading questions:', error);
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const generateNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[randomIndex]);
    setShowAnswer(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <p className="text-xl">Loading questions...</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <p className="text-xl">No questions found in spreadsheet. Please ensure your Excel file has Question and Answer columns.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Random Question Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Question:</h2>
            <p className="text-lg">{currentQuestion.question}</p>
          </div>
          
          {showAnswer && (
            <div className="bg-green-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Answer:</h2>
              <p className="text-lg">{currentQuestion.answer}</p>
            </div>
          )}
          
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => setShowAnswer(true)}
              disabled={showAnswer}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Show Answer
            </Button>
            <Button 
              onClick={generateNewQuestion}
              className="bg-green-500 hover:bg-green-600"
            >
              Next Question
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizApp;