import React from "react";

const QuizOptions = ({ handleQuizSelection, quizId, quizQ }) => {
  return (
    <div className="agent">
      <p
        style={{
          fontWeight: "bold",
          fontSize: "0.8rem",
          marginBottom: "8px",
          marginTop: "3px",
          textAlign: "center",
        }}
      >
        Enter your answer <br /> or
      </p>
      <button
        className="choice-button"
        style={{ textAlign: "center", marginBottom: "7px" }}
        onClick={(e) => {
          handleQuizSelection(
            `Show answer for: "${quizQ}"`,
            "showQuizAnswer",
            false,
            quizId
          );
        }}
      >
        Show answer
      </button>
      <button
        className="choice-button"
        style={{ textAlign: "center" }}
        onClick={(e) => {
          handleQuizSelection(
            `Show choices for: "${quizQ}"`,
            "showQuizChoices",
            true,
            quizId
          );
        }}
      >
        Show choices
      </button>
    </div>
  );
};

export default QuizOptions;
