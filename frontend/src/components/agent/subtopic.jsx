import { marked } from "marked";

const subtopicExplanation = ({
  agentResponse,
  subtopics = [],
  handleSelection,
}) => {
  // convert Markdown to HTML
  const answer = marked(agentResponse || "");

  return (
    <div className="agent">
      <div className="answer" dangerouslySetInnerHTML={{ __html: answer }} />
      <div className="choices-list">
        {subtopics.length > 0 ? (
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
