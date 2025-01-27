// Demo questions in case Excel file fails to load
const demoQuestions = [
  { question: "What is 2 + 2?", answer: "4" },
  { question: "What is the capital of France?", answer: "Paris" }
];

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Start with demo questions for immediate feedback
    setQuestions(demoQuestions);
    setCurrentQuestion(demoQuestions[0]);
    setLoading(false);

    // Try to load Excel file
    try {
      fetch('revision.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const excelData = XLSX.utils.sheet_to_json(worksheet);
          
          if (excelData && excelData.length > 0) {
            setQuestions(excelData);
            setCurrentQuestion(excelData[0]);
          }
        })
        .catch(error => console.log('Using demo questions:', error));
    } catch (error) {
      console.log('Falling back to demo questions:', error);
    }
  }, []);

  const generateNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[randomIndex]);
    setShowAnswer(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl text-center mb-6">Random Question Generator</h1>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Question:</h2>
            <p className="text-lg">{currentQuestion?.question}</p>
          </div>
          
          {showAnswer && (
            <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-200">
              <h2 className="text-xl font-semibold mb-4">Answer:</h2>
              <p className="text-lg">{currentQuestion?.answer}</p>
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

const { useState, useEffect } = React;
ReactDOM.createRoot(document.getElementById('root')).render(<QuizApp />);