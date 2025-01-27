const { useState, useEffect } = React;

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, using sample questions
    const sampleQuestions = [
      { question: "What is 2+2?", answer: "4" },
      { question: "What is the capital of France?", answer: "Paris" }
    ];
    setQuestions(sampleQuestions);
    setCurrentQuestion(sampleQuestions[0]);
    setLoading(false);
  }, []);

  const generateNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[randomIndex]);
    setShowAnswer(false);
  };

  if (loading) {
    return React.createElement("div", { className: "min-h-screen bg-gray-100 p-8 flex items-center justify-center" },
      React.createElement("p", { className: "text-xl" }, "Loading questions...")
    );
  }

  if (!currentQuestion) {
    return React.createElement("div", { className: "min-h-screen bg-gray-100 p-8 flex items-center justify-center" },
      React.createElement("p", { className: "text-xl" }, "No questions found.")
    );
  }

  return React.createElement("div", { className: "min-h-screen bg-gray-100 p-8" },
    React.createElement("div", { className: "max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6" },
      React.createElement("h1", { className: "text-2xl text-center mb-6" }, "Random Question Generator"),
      React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "bg-white p-6 rounded-lg shadow-sm" },
          React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Question:"),
          React.createElement("p", { className: "text-lg" }, currentQuestion.question)
        ),
        showAnswer && React.createElement("div", { className: "bg-green-50 p-6 rounded-lg shadow-sm" },
          React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Answer:"),
          React.createElement("p", { className: "text-lg" }, currentQuestion.answer)
        ),
        React.createElement("div", { className: "flex gap-4 justify-center" },
          React.createElement("button",
            {
              onClick: () => setShowAnswer(true),
              disabled: showAnswer,
              className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            },
            "Show Answer"
          ),
          React.createElement("button",
            {
              onClick: generateNewQuestion,
              className: "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            },
            "Next Question"
          )
        )
      )
    )
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(QuizApp));