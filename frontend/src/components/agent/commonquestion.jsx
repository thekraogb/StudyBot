import React from "react";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";

const QuestionAnswer = ({ agentResponse, questions = [], handleSelection }) => {
  return (
    <div className="agent">
      <div className="answer">
        {" "}
        <ReactMarkdown>{agentResponse}</ReactMarkdown>{" "}
      </div>
      <p
        style={{
          fontWeight: "bold",
          fontSize: "0.8rem",
          marginBottom: "8px",
          paddingBottom: "0px",
        }}
      >
        More related questions:
      </p>
      <div className="choices-list">
        {questions.length > 0 ? (
          questions.map((question) => (
            <button
              className="choice-button"
              key={uuidv4()}
              onClick={(e) => {
                handleSelection(question, "question");
              }}
            >
              {question}
            </button>
          ))
        ) : (
          <p className="alt-text">No questions available</p>
        )}

      </div>
    </div>
  );
};

export default QuestionAnswer;
