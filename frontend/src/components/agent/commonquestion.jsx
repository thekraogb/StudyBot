import ReactMarkdown from "react-markdown";

const QuestionAnswer = ({ agentResponse, questions = [], handleSelection }) => {
  return (
    <div className="agent">
      <div className="answer">
        {" "}
        <ReactMarkdown>{agentResponse}</ReactMarkdown>{" "}
      </div>
      <div className="choices-list">
        {questions.length > 0 ? (
          questions.map((question, index) => (
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
