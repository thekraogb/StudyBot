import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";

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
      <p
        style={{
          fontWeight: "bold",
          fontSize: "0.8rem",
          marginBottom: "8px",
          paddingBottom: "0px",
        }}
      >
        More quizzes:
      </p>
      <div className="choices-list">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <button
              className="choice-button"
              key={uuidv4()}
              onClick={(e) => {
                handleQuizSelection(quiz, "quiz", true);
              }}
            >
              {quiz}
            </button>
          ))
        ) : (
          <p className="alt-text">No quizzes yet</p>
        )}

      </div>
    </div>
  );
};

export default quizFeedbackOrAnswer;
