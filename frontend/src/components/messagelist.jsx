import React from "react";
import Main from "./agent/main";
import QuestionAnswer from "./agent/commonquestion";
import SubtopicExplanation from "./agent/subtopic";
import QuizFeedbackOrAnswer from "./agent/quiz";
import QuizOptions from "./agent/quizoptions";

const MessageList = ({ messages, handleSelection, handleQuizSelection }) => {
  return (
    <div className="message-list">
      {messages.length > 0 && (
        <>
          {messages.map((msg, index) => {
            // render main answer component when user prompt a question
            if (
              msg.sender === "ChatGPT" &&
              msg.commonQuestions &&
              msg.subtopics &&
              msg.quizzes
            ) {
              return (
                <Main
                  key={index}
                  agentResponse={msg.message}
                  commonQuestions={msg.commonQuestions}
                  subtopics={msg.subtopics}
                  quizzes={msg.quizzes}
                  handleSelection={handleSelection}
                  handleQuizSelection={handleQuizSelection}
                />
              );
            }
            // render questionAnswer component for question type options
            else if (
              msg.sender === "ChatGPT" &&
              msg.optionType === "question"
            ) {
              return (
                <QuestionAnswer
                  key={index}
                  agentResponse={msg.message}
                  questions={msg.commonQuestions}
                  handleSelection={handleSelection}
                />
              );
            } else if (
              msg.sender === "ChatGPT" &&
              msg.optionType === "subtopic"
            ) {
              return (
                <SubtopicExplanation
                  key={index}
                  agentResponse={msg.message}
                  subtopics={msg.subtopics}
                  handleSelection={handleSelection}
                />
              );
            } else if (msg.sender === "ChatGPT" && msg.optionType === "quiz") {
              return <QuizOptions handleQuizSelection={handleQuizSelection} />;
            } else if (
              msg.sender === "ChatGPT" &&
              msg.optionType === "takeQuizOrShowAnswer"
            ) {
              return (
                <QuizFeedbackOrAnswer
                  key={index}
                  agentResponse={msg.message}
                  quizzes={msg.quizzes}
                  handleQuizSelection={handleQuizSelection}
                  takeQuiz={msg.takeQuiz}
                />
              );
            }

            // render initial agent message
            else if (msg.sender === "ChatGPT") {
              return (
                <div className="agent" key={index}>
                  <p
                    style={{
                      color: "#667085",
                      padding: "0px",
                      marginBottom: "5px",
                      marginTop: "5px",
                    }}
                  >
                    {msg.message}
                  </p>
                </div>
              );
            }
            // render user message
            else {
              return (
                <div className="user" key={index}>
                  <p className="prompt">{msg.message}</p>
                </div>
              );
            }
          })}
        </>
      )}
    </div>
  );
};

export default MessageList;
