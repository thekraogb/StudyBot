import React from "react";
import { marked } from "marked";

const Main = ({
  agentResponse,
  commonQuestions,
  subtopics,
  quizzes,
  handleSelection,
  handleQuizSelection,
}) => {
  // convert Markdown to HTML
  const answer = marked(agentResponse || "");

  return (
    <div className="agent">
      <div className="answer" dangerouslySetInnerHTML={{ __html: answer }} />

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
              onClick={() => handleSelection(question, "question")}
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
              onClick={() => handleSelection(subtopic, "subtopic")}
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
              onClick={() => handleQuizSelection(quiz, "quiz", true)}
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
