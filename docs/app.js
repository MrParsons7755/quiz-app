const { useState, useEffect } = React;

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const workbook = XLSX.readFile('revision.xlsx');
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
        setError('Failed to load questions. Please make sure your Excel file is properly formatted.');
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <p className="text-xl">No questions found. Please ensure your Excel file has Question and Answer columns.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl text-center mb-6">Random Question Generator</h1>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Question:</h2>
            <p className="text-lg">{currentQuestion.question}</p>
          </div>
          
          {showAnswer && (
            <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-200">
              <h2 className="text-xl font-semibold mb-4">Answer:</h2>
              <p className="text-lg">{currentQuestion.answer}</p>
            </div>
          )}
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowAnswer(true)}
              disabled={showAnswer}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Show Answer
            </button>
            <button
              onClick={generateNewQuestion}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Next Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<QuizApp />);