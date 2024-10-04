import ReactMarkdown from "react-markdown";

const subtopicExplanation = ({
  agentResponse,
  subtopics = [],
  handleSelection,
}) => {
  return (
    <div className="agent">
      <div className="answer">
        {" "}
        <ReactMarkdown>{agentResponse}</ReactMarkdown>{" "}
      </div>
      <div className="choices-list">
        {subtopics.length > 0 ? (
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

export default subtopicExplanation;
