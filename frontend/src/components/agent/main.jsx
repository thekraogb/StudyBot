import React from "react";
import ReactMarkdown from "react-markdown";

const Main = ({
  agentResponse,
  commonQuestions,
  subtopics,
  quizzes,
  handleSelection,
  handleQuizSelection,
}) => {
  return (
    <div className="agent">
      <div className="answer">
        {" "}
        <ReactMarkdown>{agentResponse}</ReactMarkdown>{" "}
      </div>

      <p
        style={{ fontWeight: "bold", fontSize: "0.8rem", marginBottom: "8px" }}
      >
        Common questions:
      </p>
      <div className="choices-list">
        {commonQuestions?.length > 0 ? (
          commonQuestions.map((question, index) => (
            <button
              className="choice-button"
              key={index}
              onClick={(e) => {
                handleSelection(question, "question");
                e.target.disabled = true;
              }}
            >
              {question}
            </button>
          ))
        ) : (
          <p className="alt-text">No questions yet</p>
        )}
      </div>

      <p
        style={{
          fontWeight: "bold",
          fontSize: "0.8rem",
          marginBottom: "8px",
          paddingBottom: "0px",
        }}
      >
        Explore subtopics:
      </p>
      <div className="choices-list">
        {subtopics?.length > 0 ? (
          subtopics.map((subtopic, index) => (
            <button
              className="choice-button"
              key={index}
              onClick={(e) => {
                handleSelection(subtopic, "subtopic");
                e.target.disabled = true;
              }}
            >
              {subtopic}
            </button>
          ))
        ) : (
          <p className="alt-text">No subtopics yet</p>
        )}
      </div>

      <p
        style={{
          fontWeight: "bold",
          fontSize: "0.8rem",
          marginBottom: "8px",
          paddingBottom: "0px",
        }}
      >
        Quiz me:
      </p>
      <div className="choices-list">
        {quizzes?.length > 0 ? (
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
      </div>

      <p
        style={{
          fontWeight: "bold",
          fontSize: "0.8rem",
          marginBottom: "3px",
          marginTop: "19px",
        }}
      >
        Ask more questions:
      </p>
    </div>
  );
};

export default Main;
