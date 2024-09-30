const quizFeedbackOrAnswer = ({
  agentResponse,
  quizzes = [],
  handleQuizSelection,
  takeQuiz,
}) => {
  return (
    <div className="agent">
      <p className="answer">
        {" "}
        {takeQuiz ? <strong>Feedback:</strong> : null} {agentResponse}{" "}
      </p>

      <div className="choices-list">
        {quizzes.length > 0 ? (
          quizzes.map((quiz, index) => (
            <button
              className="choice-button"
              key={index}
              onClick={() => handleQuizSelection(quiz, "quiz", true)}
            >
              {quiz}
            </button>
          ))
        ) : (
          <p className="alt-text">No quizzes yet</p>
        )}

        <p
          style={{
            fontWeight: "bold",
            fontSize: "0.8rem",
            marginBottom: "3px",
          }}
        >
          Ask more questions:
        </p>
      </div>
    </div>
  );
};

export default quizFeedbackOrAnswer;
