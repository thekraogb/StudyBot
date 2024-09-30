const QuizOptions = ({ handleQuizSelection }) => {
  return (
    <div className="agent">
      <p
        style={{
          fontWeight: "bold",
          fontSize: "0.8rem",
          marginBottom: "8px",
          marginTop: "3px",
        }}
      >
        Enter your answer <br /> or:
      </p>
      <button
        className="choice-button"
        style={{ textAlign: "center" }}
        onClick={() =>
          handleQuizSelection("Show answer", "takeQuizOrShowAnswer", false)
        }
      >
        Show answer
      </button>
    </div>
  );
};

export default QuizOptions;
