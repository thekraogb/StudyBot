import React from "react";
// import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";

const QuizChoices = ({
  quizChoices,
  handleQuizChoiceSelection,
  quizId,
}) => {
  return (
    <div className="agent">
      <div className="choices-list">
        {quizChoices.length > 0 ? (
          quizChoices.map((choice) => (
            <button
              className="choice-button"
              key={uuidv4()}
              onClick={(e) => {
                handleQuizChoiceSelection(choice, quizChoices, "quizChoice", quizId);
              }}
            >
              {choice}
            </button>
          ))
        ) : (
          <p className="alt-text">No choices available</p>
        )}

      </div>
    </div>
  );
};

export default QuizChoices;