import React from "react";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";

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
          commonQuestions.map((question) => (
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
          subtopics.map((subtopic) => (
            <button
              className="choice-button"
              key={uuidv4()}
              onClick={(e) => {
                handleSelection(subtopic, "subtopic");
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

export default Main;
