import React from "react";
import { useState, useEffect } from "react";
import "./chatbot.css";
import MessageList from "../../components/messagelist.jsx";
import send from "../../assets/send.svg";
import sendDisabled from "../../assets/send-disabled.svg";
import {
  useGetMainAnswerMutation,
  useGetCommonQuestionAnswerMutation,
  useGetSubtopicExplanationMutation,
  useGetQuizFeedbackMutation,
  useGetQuizAnswerMutation,
  useGetQuizQuestionChoicesMutation,
  useGetQuizChoiceFeedbackMutation,
} from "../../app/slices/agent/agentapislice.jsx";
import { useCreateChatMutation } from "../../app/slices/chat/chatapislice.jsx";
import { setChatId } from "../../app/slices/chat/chatslice.jsx";
import { useCreateMessageMutation } from "../../app/slices/message/messageapislice.jsx";
import { addMessage } from "../../app/slices/message/messageslice.jsx";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useSidebar } from "../../context/sidebarcontext.jsx";
import { successToast, errorToast } from "../../toastify/toastify.jsx";

const ChatPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [isResponseComplete, setIsResponseComplete] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { open } = useSidebar();

  const [getMainAnswer] = useGetMainAnswerMutation();
  const [getQuizFeedback] = useGetQuizFeedbackMutation();
  const [getCommonQuestionAnswer] = useGetCommonQuestionAnswerMutation();
  const [getSubtopicExplanation] = useGetSubtopicExplanationMutation();
  const [getQuizAnswer] = useGetQuizAnswerMutation();
  const [getQuizQuestionChoices] = useGetQuizQuestionChoicesMutation();
  const [getQuizChoiceFeedback] = useGetQuizChoiceFeedbackMutation();
  const dispatch = useDispatch();
  const [createMessage] = useCreateMessageMutation();
  const [createChat] = useCreateChatMutation();

  const messages = useSelector((state) => state.messages.messages);
  const chatId = useSelector((state) => state.chat.chatId);

  // handle user prompt. this function will handle the user prompt which is for now is either a question to recieve
  // the main answer message from agent, or feedback on the user's answer if they decide to take a quiz
  const handleSendClick = async () => {
    // let result;
    if (inputValue.trim()) {
      setIsResponseComplete(false);

      // creat new chatId if non exist
      let currentChatId = chatId;
      if (!currentChatId && messages.length <= 2) {
        try {
          const result = await createChat().unwrap();
          currentChatId = result.chatId;
          dispatch(setChatId(currentChatId));
        } catch (error) {
          errorToast("Error creating new chat");
          setIsResponseComplete(true);
          return;
        }
      }

      // Check if previous message has takeQuiz set to true
      const lastMessage = messages[messages.length - 1];
      const takeQuizFlag =
        lastMessage?.sender === "ChatGPT" && lastMessage.takeQuiz;

      // Create user message and set takeQuizFlag to true if user's prompt is the quiz answer
      const userMessage = {
        chatId: currentChatId,
        message: inputValue,
        sender: "user",
        ...(takeQuizFlag ? { takeQuiz: true } : {}),
      };

      dispatch(addMessage(userMessage));

      const result = await createMessage(userMessage).unwrap();
      if (result.success === false) {
        errorToast(result.message);
      }

      let response;

      if (takeQuizFlag) {
        setIsLoading(true);

        const question = (messages) => {
          return messages.reduceRight((found, msg) => {
            if (!found && msg.sender === "user" && msg.optionType === "quiz") {
              return msg;
            }
            return found;
          }, null);
        };

        const quizQuestion = question(messages);

        response = await getQuizFeedback({
          question: quizQuestion.message,
          answer: inputValue,
        }).unwrap(); // get agent's quiz answer feedback
      } else {
        setIsLoading(true);

        response = await getMainAnswer({ message: inputValue }).unwrap(); // get agent's main answer response
      }

      if (response) {
        let agentResponse;
        if (messages[messages.length - 1]?.takeQuiz) {
          // if takeQuiz is true, set optionType to quizFeedbackOrAnswer
          // (the agent's feedback to user's answer or answer of the quiz message ) and
          // reset takeQuiz to false so that further agent messages, after a user prompt, are the main options message.
          agentResponse = {
            chatId: currentChatId,
            message: response.feedback || " ",
            sender: "ChatGPT",
            optionType: "quizFeedbackOrAnswer",
            takeQuiz: false,
            quizzes: response.options?.quizzes || [],
          };
        } else {
          // add main response if last user's message is a question prompt
          agentResponse = {
            chatId: currentChatId,
            message: response.answer || " ",
            sender: "ChatGPT",
            ...(response.answer !==
              "I'm here to help you with STEM related topics." && {
              optionType: "main",
            }),
            commonQuestions: response.options?.commonQuestions || [],
            subtopics: response.options?.subtopics || [],
            quizzes: response.options?.quizzes || [],
          };
        }

        setIsLoading(false);

        dispatch(addMessage(agentResponse));

        const result = await createMessage(agentResponse).unwrap();
        if (result.success === false) {
          errorToast(result.message);
        }
      }

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
    setIsLoading(true);

    const userSelection = { chatId, message: selection, sender: "user" };

    dispatch(addMessage(userSelection));

    const result = await createMessage(userSelection).unwrap();
    if (result.success === false) {
      errorToast(result.message);
    }

    let response;

    // get agent's response based on selection type
    if (selectionType === "question") {

      response = await getCommonQuestionAnswer({ message: selection }).unwrap();
    } else if (selectionType === "subtopic") {

      response = await getSubtopicExplanation({ message: selection }).unwrap();
    }

    const choiceResponse = {
      chatId,
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

    setIsLoading(false);

    dispatch(addMessage(choiceResponse));

    const result2 = await createMessage(choiceResponse).unwrap();
    if (result2.success === false) {
      errorToast(result2.message);
    }

    setIsResponseComplete(true);
  };

  // Handle quiz selection
  const handleQuizSelection = async (
    selection,
    selectionType,
    takeQuiz,
    quiz_Id
  ) => {
    setIsResponseComplete(false);
    
    const quizId = selectionType === "quiz" ? uuidv4() : null;
    const quizQuestion = selectionType === "quiz" ? selection : null;
    
    const userSelection = {
      chatId,
      message: selection,
      optionType: selectionType,
      sender: "user",
      quizId,
    };
    
    dispatch(addMessage(userSelection));
    
    const result = await createMessage(userSelection).unwrap();
    if (result.success === false) {
      errorToast(result.message);
    }
    
    let quizAnswerResponse;
    
    // get quiz answer if user clicks 'show answer' button
    if (selectionType === "showQuizAnswer" && takeQuiz === false) {
      setIsLoading(true);

      // get user quiz selection
      const quizSelection = messages.find(
        (msg) => msg.sender === "user" && msg.quizId === quiz_Id
      );
      quizAnswerResponse = await getQuizAnswer({
        message: quizSelection.message,
      }).unwrap();
    }

    let quizChoicesResponse;

    // get quiz question choices if user clicks 'show choices' button
    if (selectionType === "showQuizChoices" && takeQuiz === true) {
      setIsLoading(true);
      // get user quiz selection
      const quizSelection = messages.find(
        (msg) => msg.sender === "user" && msg.quizId === quiz_Id
      );
      quizChoicesResponse = await getQuizQuestionChoices({
        message: quizSelection.message,
      }).unwrap();
    }

    let choiceResponse;

    if (quizAnswerResponse) {
      choiceResponse = {
        chatId,
        message: quizAnswerResponse.answer || " ",
        sender: "ChatGPT",
        optionType: "quizFeedbackOrAnswer",
        takeQuiz: takeQuiz,
        quizzes: quizAnswerResponse.options?.quizzes || [],
      };
    } else if (quizChoicesResponse) {
      choiceResponse = {
        chatId,
        quizChoices: quizChoicesResponse.choices.quizChoices || [],
        sender: "ChatGPT",
        optionType: selectionType,
        takeQuiz: takeQuiz,
        quizId: quiz_Id,
      };
    } else {
      choiceResponse = {
        chatId,
        message: "Enter your answer or show answer or show choices",
        sender: "ChatGPT",
        optionType: selectionType,
        takeQuiz: takeQuiz,
        quizId,
        quizQuestion,
      };
    }

    setIsLoading(false);

    dispatch(addMessage(choiceResponse));

    const result2 = await createMessage(choiceResponse).unwrap();
    if (result2.success === false) {
      errorToast(result2.message);
    }

    setIsResponseComplete(true);
  };

  // Handle quiz question choice selection
  const handleQuizChoiceSelection = async (
    selection,
    choices,
    selectionType,
    quiz_Id
  ) => {
    setIsResponseComplete(false);
    setIsLoading(true);

    const userSelection = {
      chatId,
      message: selection,
      optionType: selectionType,
      sender: "user",
      quizId: quiz_Id,
    };

    dispatch(addMessage(userSelection));

    const result = await createMessage(userSelection).unwrap();
    if (result.success === false) {
      errorToast(result.message);
    }

    // get user quiz selection
    const quizSelection = messages.find(
      (msg) => msg.sender === "user" && msg.quizId === quiz_Id
    );


    const response = await getQuizChoiceFeedback({
      question: quizSelection.message,
      choices: choices,
      answer: selection,
    }).unwrap();

    const choiceResponse = {
      chatId,
      message: response.feedback || " ",
      sender: "ChatGPT",
      optionType: "quizFeedbackOrAnswer",
      takeQuiz: false,
      quizzes: response.options?.quizzes || [],
    };

    setIsLoading(false);

    dispatch(addMessage(choiceResponse));

    const result2 = await createMessage(choiceResponse).unwrap();
    if (result2.success === false) {
      errorToast(result2.message);
    }

    setIsResponseComplete(true);
  };

  return (
    <div className={`chatbot-wrapper ${open ? "shifted" : ""}`}>
      <div className={`chatbot-container ${open ? "shifted" : ""}`}>
        <MessageList
          // messages={messages}
          isLoading={isLoading}
          handleSelection={handleSelection}
          handleQuizSelection={handleQuizSelection}
          handleQuizChoiceSelection={handleQuizChoiceSelection}
        />
      </div>
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
            style={{ width: 24, height: 24 }}
          />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
