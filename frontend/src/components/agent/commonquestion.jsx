import { marked } from "marked";

const QuestionAnswer = ({ agentResponse, questions = [], handleSelection }) => {
  // convert Markdown to HTML
  const answer = marked(agentResponse || "");

  return (
    <div className="agent">
      <div className="answer" dangerouslySetInnerHTML={{ __html: answer }} />
      <div className="choices-list">
        {questions.length > 0 ? (
          questions.map((question, index) => (
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

export default QuestionAnswer;
