import React from "react";
import Main from "./agent/main";
import QuestionAnswer from "./agent/commonquestion";
import SubtopicExplanation from "./agent/subtopic";
import QuizFeedbackOrAnswer from "./agent/quiz";
import QuizOptions from "./agent/quizoptions";
import QuizChoices from "./agent/quizchoices";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import "../pages/chatbot/Chatbot.css";

const MessageList = ({ handleSelection, handleQuizSelection, isLoading, handleQuizChoiceSelection }) => {
  const messages = useSelector((state) => state.messages.messages);

  return (
    <div className="message-list">
      {messages.length > 0 && (
        <>
          {messages.map((msg) => {
            // render main answer component when user prompt a question
            if (msg.sender === "ChatGPT" && msg.optionType === "main") {
              return (
                <Main
                  key={uuidv4()}
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
                  key={uuidv4()}
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
                  key={uuidv4()}
                  agentResponse={msg.message}
                  subtopics={msg.subtopics}
                  handleSelection={handleSelection}
                />
              );
            } else if (msg.sender === "ChatGPT" && msg.optionType === "quiz") {
              return (
                <QuizOptions
                  key={uuidv4()}
                  handleQuizSelection={handleQuizSelection}
                  quizId={msg.quizId}
                  quizQ={msg.quizQuestion}
                />
              );
            } else if (msg.sender === "ChatGPT" && msg.optionType === "showQuizChoices") {
              return (
                <QuizChoices
                  key={uuidv4()}
                  quizChoices={msg.quizChoices}
                  handleQuizChoiceSelection={handleQuizChoiceSelection}
                  quizId={msg.quizId}
                />
              );
            } else if (
              msg.sender === "ChatGPT" &&
              msg.optionType === "quizFeedbackOrAnswer"
            ) {
              return (
                <QuizFeedbackOrAnswer
                  key={uuidv4()}
                  agentResponse={msg.message}
                  quizzes={msg.quizzes}
                  handleQuizSelection={handleQuizSelection}
                />
              );
            }

            // render initial agent message
            else if (msg.sender === "ChatGPT") {
              return (
                <div className="agent" key={uuidv4()}>
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
                <div className="user" key={uuidv4()}>
                  <p className="prompt">{msg.message}</p>
                </div>
              );
            }
          })}
        </>
      )}
      {isLoading && <p className="loader"></p>}
    </div>
  );
};

export default MessageList;
