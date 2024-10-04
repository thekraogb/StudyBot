import ReactMarkdown from "react-markdown";

const quizFeedbackOrAnswer = ({
  agentResponse,
  quizzes = [],
  handleQuizSelection,
}) => {
  return (
    <div className="agent">
      <div className="answer">
        <ReactMarkdown>{agentResponse}</ReactMarkdown>
      </div>

      <div className="choices-list">
        {quizzes.length > 0 ? (
          quizzes.map((quiz, index) => (
            <button
              className="choice-button"
              key={index}
              onClick={(e) => {
                handleQuizSelection(quiz, "quiz", true);
                e.target.disabled = true;
              }}
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
