import React from "react";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";

const subtopicExplanation = ({
  agentResponse,
  subtopics = [],
  handleSelection,
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
        More subtopics:
      </p>
      <div className="choices-list">
        {subtopics.length > 0 ? (
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
          <p className="alt-text">No subtopics available</p>
        )}

      </div>
    </div>
  );
};

export default subtopicExplanation;
