import { useState } from "react";
import "../Chatbot.css";
import MessageList from "../components/messagelist";
import send from "../assets/send.svg";
import sendDisabled from "../assets/send-disabled.svg";
import {
  getMainAnswer,
  getCommonQuestionAnswer,
  getSubtopicExplanation,
  getQuizFeedback,
  getQuizAnswer,
} from "../services/api";

const ChatPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      message: "Hi! Ask me any question related to STEM.",
      sender: "ChatGPT",
    },
  ]);
  const [isResponseComplete, setIsResponseComplete] = useState(true);

  // handle user prompt. this function will handle the user prompt which is for now is either a question to recieve
  // the main answer message from agent, or feedback on the user's answer if they decide to take a quiz
  const handleSendClick = async () => {
    if (inputValue.trim()) {
      setIsResponseComplete(false);

      // Check if previous message has takeQuiz set to true
      const lastMessage = messages[messages.length - 1];
      const takeQuizFlag =
        lastMessage?.sender === "ChatGPT" && lastMessage.takeQuiz;

      setMessages((prevMessages) => {
        // Create user message and set takeQuizFlag to true if user's prompt is the quiz answer
        const userMessage = {
          message: inputValue,
          sender: "user",
          ...(takeQuizFlag ? { takeQuiz: true } : {}),
        };

        return [...prevMessages, userMessage];
      });

      let response;

      if (takeQuizFlag) {
        const question = messages
          .slice()
          .reverse()
          .find((msg) => msg.sender === "user" && msg.message !== inputValue);
        response = await getQuizFeedback(question.message, inputValue); // get agent's quiz answer feedback
      } else {
        response = await getMainAnswer(inputValue); // get agent's main answer response
      }

      setMessages((prevMessages) => {
        let updatedMessages = [...prevMessages];

        if (response) {
          if (prevMessages[prevMessages.length - 1]?.takeQuiz) {
            // if takeQuiz is true, set optionType to takeQuizOrShowAnswer
            // (the agent's feedback to user's answer or answer of the quiz message ) and
            // reset takeQuiz to false so that further agent messages, after a user prompt, are the main options message.
            const answerResponse = {
              message: response.feedback || " ",
              sender: "ChatGPT",
              optionType: "takeQuizOrShowAnswer",
              takeQuiz: false,
              quizzes: response.options?.quizzes || [],
            };

            updatedMessages = [...updatedMessages, answerResponse];
          } else {
            // if answerQuiz is undefined or false, add the main answer response
            const agentResponse = {
              message: response.answer || " ",
              sender: "ChatGPT",
              commonQuestions: response.options?.commonQuestions || [],
              subtopics: response.options?.subtopics || [],
              quizzes: response.options?.quizzes || [],
            };
            updatedMessages = [...updatedMessages, agentResponse];
          }
        }
        return updatedMessages;
      });

      setInputValue("");
      setIsResponseComplete(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendClick();
    }
  };

  // Handle user choices selection
  const handleSelection = async (selection, selectionType) => {
    setIsResponseComplete(false);
    const userSelection = { message: selection, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userSelection]);

    let response;
    // get agent's response based on selection type
    if (selectionType === "question") {
      response = await getCommonQuestionAnswer(selection);
    } else if (selectionType === "subtopic") {
      response = await getSubtopicExplanation(selection);
    }

    const choiceResponse = {
      message: response.answer || " ",
      sender: "ChatGPT",
      optionType: selectionType,
      ...(selectionType === "question" && {
        commonQuestions: response.options?.commonQuestions || [],
      }),
      ...(selectionType === "subtopic" && {
        subtopics: response.options?.subtopics || [],
      }),
    };
    setMessages((prevMessages) => [...prevMessages, choiceResponse]);
    setIsResponseComplete(true);
  };

  // Handle quiz selection
  const handleQuizSelection = async (selection, selectionType, takeQuiz) => {
    setIsResponseComplete(false);
    const userSelection = { message: selection, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userSelection]);

    let response;

    // get quiz answer
    if (selectionType === "takeQuizOrShowAnswer" && takeQuiz === false) {
      // get user quiz selection
      const quizSelection = messages
        .slice()
        .reverse()
        .find((msg) => msg.sender === "user" && msg.message !== selection);
      response = await getQuizAnswer(quizSelection.message);
    }

    let choiceResponse;

    if (response) {
      choiceResponse = {
        message: response.answer || " ",
        sender: "ChatGPT",
        optionType: selectionType,
        takeQuiz: takeQuiz,
        quizzes: response.options?.quizzes || [],
      };
    } else {
      choiceResponse = {
        message: "Enter your answer or show answer",
        sender: "ChatGPT",
        optionType: selectionType,
        takeQuiz: takeQuiz,
      };
    }
    setMessages((prevMessages) => [...prevMessages, choiceResponse]);
    setIsResponseComplete(true);
  };

  return (
    <div className="chatbot-container">
      <MessageList
        messages={messages}
        handleSelection={handleSelection}
        handleQuizSelection={handleQuizSelection}
      />
      <div className="input-container">
        <input
          type="text"
          placeholder="Ask me"
          className="ask-me-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="send-button"
          onClick={handleSendClick}
          disabled={!inputValue.trim() || !isResponseComplete}
        >
          <img
            src={
              !inputValue.trim() || !isResponseComplete ? sendDisabled : send
            }
            alt="send"
            style={{ width: 24, height: 24, color: "red" }}
          />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
