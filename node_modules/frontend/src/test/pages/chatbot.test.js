import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import ChatPage from "../../pages/chatbot/chatbotpage";
import { store } from "../../app/store";
import Appbar from "../../components/appbar/Appbar";
import {
  warningToast,
  successToast,
  errorToast,
} from "../../toastify/toastify.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { SidebarProvider } from "../../context/sidebarcontext";
import {
  setChatId,
} from "../../app/slices/chat/chatslice";
import {
  useGetMainAnswerMutation,
  useGetCommonQuestionAnswerMutation,
  useGetSubtopicExplanationMutation,
  useGetQuizFeedbackMutation,
  useGetQuizAnswerMutation,
} from "../../app/slices/agent/agentapislice.jsx";
import { useCreateChatMutation } from "../../app/slices/chat/chatapislice.jsx";
import { useCreateMessageMutation } from "../../app/slices/message/messageapislice.jsx";
import { addMessage } from "../../app/slices/message/messageslice.jsx";

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock("react-redux", () => {
  const dispatch = jest.fn();
  return {
    ...jest.requireActual("react-redux"),
    useDispatch: () => dispatch,
    useSelector: jest.fn(),
  };
});

const dispatch = useDispatch();

useSelector.mockImplementation((callback) => {
  return callback({
    messages: {
      messages: [
        {
          sender: "ChatGPT",
          message: "Hi! Ask me any question related to STEM.",
        },
      ],
    },
    chat: {
      chatId: "",
      chats: [],
    },
    auth: {
      name: "Thekra",
      email: "thekra@gmail.com",
    },
  });
});

jest.mock("../../app/api/apislice", () => ({
  __esModule: true,
  apiSlice: {
    reducer: jest.fn(() => ({})),
    reducerPath: "api",
    middleware: jest.fn(() => (next) => (action) => next(action)),
  },
}));

jest.mock("../../app/slices/chat/chatapislice", () => {
  const createChat = jest.fn(() => ({
    unwrap: jest.fn(() => Promise.resolve({ success: true, chatId: "123" })),
  }));
  const deleteChat = jest.fn();

  return {
    __esModule: true,
    chatApiSlice: {
      reducer: jest.fn(() => ({})),
      reducerPath: "chatApi",
    },
    useCreateChatMutation: jest.fn(() => [createChat]),
    useFetchChatsQuery: jest.fn(() => ({
      data: { data: [] },
      refetch: jest.fn(() => ({
        success: true,
        data: { data: [{ chatId: "", title: "" }] },
      })),
    })),
    useDeleteChatMutation: jest.fn(() => [deleteChat]),
  };
});

jest.mock("../../app/slices/message/messageapislice", () => {
  const createMessage = jest.fn(() => ({
    unwrap: jest.fn(() => Promise.resolve({ success: true })),
  }));

  return {
    __esModule: true,
    messageApiSlice: {
      reducer: jest.fn(() => ({})),
      reducerPath: "messageApi",
    },
    useFetchMessagesQuery: jest.fn((chatId, options) => {
      if (chatId && !options.skip) {
        return { data: { data: [{ sender: "", message: "" }] }, error: null };
      }
      return { data: null, error: true };
    }),
    useCreateMessageMutation: jest.fn(() => [createMessage]),
  };
});

jest.mock("../../app/slices/agent/agentapislice", () => {
  const getMainAnswer = jest.fn(() => ({
    unwrap: jest.fn(() => Promise.resolve()),
  }));
  const getCommonQuestionAnswer = jest.fn(() => ({
    unwrap: jest.fn(() => Promise.resolve()),
  }));
  const getSubtopicExplanation = jest.fn(() => ({
    unwrap: jest.fn(() => Promise.resolve()),
  }));
  const getQuizFeedback = jest.fn(() => ({
    unwrap: jest.fn(() => Promise.resolve()),
  }));
  const getQuizAnswer = jest.fn(() => ({
    unwrap: jest.fn(() => Promise.resolve()),
  }));

  return {
    __esModule: true,
    agentApiSlice: {
      reducer: jest.fn(() => ({})),
      reducerPath: "agentApi",
    },
    useGetMainAnswerMutation: jest.fn(() => [getMainAnswer]),
    useGetCommonQuestionAnswerMutation: jest.fn(() => [
      getCommonQuestionAnswer,
    ]),
    useGetSubtopicExplanationMutation: jest.fn(() => [getSubtopicExplanation]),
    useGetQuizFeedbackMutation: jest.fn(() => [getQuizFeedback]),
    useGetQuizAnswerMutation: jest.fn(() => [getQuizAnswer]),
  };
});

jest.mock("../../toastify/toastify.jsx", () => ({
  warningToast: jest.fn(),
  successToast: jest.fn(),
  errorToast: jest.fn(),
}));

const createMessage = useCreateMessageMutation()[0];

describe("Chatbot", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <SidebarProvider>
              <Appbar />
              <ChatPage />
            </SidebarProvider>
          </MemoryRouter>
        </Provider>
      );
    });
  });

  test("it renders intial chatbot component", async () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <SidebarProvider>
            <ChatPage />
          </SidebarProvider>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe("handleSendClick function", () => {
  beforeEach(async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SidebarProvider>
            <ChatPage />
          </SidebarProvider>
        </MemoryRouter>
      </Provider>
    );
  });

  test("it creates new chat id if non exists", async () => {
    const createChat = useCreateChatMutation()[0];

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "message" } });
    expect(button).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(button);
    });

    expect(createChat).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(setChatId("123"));
  });

  test("it shows an error toast when createChat fails", async () => {
    const createChat = useCreateChatMutation()[0];

    createChat.mockImplementation(() => ({
      unwrap: jest.fn(() => Promise.reject()),
    }));

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "message" } });
    expect(button).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(button);
    });

    expect(errorToast).toHaveBeenCalledWith("Error creating new chat");
  });

  test("it disables send button when input is empty or response is incomplete", () => {
    const button = screen.getByRole("button", { name: /send/i });
    expect(button).toBeDisabled();
  });

  test("it handles takeQuiz flag and creates a message", async () => {
    useSelector.mockImplementation((callback) => {
      return callback({
        messages: {
          messages: [
            { sender: "user", message: "question", optionType: "quiz" },
            {
              sender: "ChatGPT",
              message: "Enter your answer or show answer",
              takeQuiz: true,
            },
          ],
        },
        chat: {
          chatId: "123",
          chats: [],
        },
      });
    });

    const createMessage = useCreateMessageMutation()[0];

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "answer" } });

    await act(async () => {
      fireEvent.click(button);
    });

    const message = {
      chatId: "123",
      message: "answer",
      sender: "user",
      takeQuiz: true,
    };

    expect(dispatch).toHaveBeenCalledWith(addMessage(message));
    expect(createMessage).toHaveBeenCalledWith(message);
    expect(createMessage.mock.results[0].value.unwrap).toHaveBeenCalled();
  });

  test("it handles main answer response flow", async () => {
    useSelector.mockImplementation((callback) => {
      return callback({
        messages: {
          messages: [{ sender: "user", message: "what is data structure" }],
        },
        chat: {
          chatId: "123",
          chats: [],
        },
      });
    });

    const mockMainResponse = {
      answer: "A data structure is a way of organizing and storing data...",
      options: {
        commonQuestions: [
          "how are data structures important in computer science",
        ],
        subtopics: ["arrays"],
        quizzes: ["how do linked lists store elements"],
      },
    };

    const getMainAnswer = useGetMainAnswerMutation()[0];

    getMainAnswer.mockImplementation(() => ({
      unwrap: jest.fn(() => Promise.resolve(mockMainResponse)),
    }));

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "what is data structure" } });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(dispatch).toHaveBeenCalledWith(
      addMessage({
        chatId: "123",
        message: "what is data structure",
        sender: "user",
      })
    );
    expect(createMessage).toHaveBeenCalledWith({
      chatId: "123",
      message: "what is data structure",
      sender: "user",
    });

    expect(getMainAnswer).toHaveBeenCalledWith({
      message: "what is data structure",
    });

    expect(dispatch).toHaveBeenCalledWith(
      addMessage({
        chatId: "123",
        message: "A data structure is a way of organizing and storing data...",
        sender: "ChatGPT",
        optionType: "main",
        commonQuestions: [
          "how are data structures important in computer science",
        ],
        subtopics: ["arrays"],
        quizzes: ["how do linked lists store elements"],
      })
    );
    expect(createMessage).toHaveBeenCalledWith({
      chatId: "123",
      message: "A data structure is a way of organizing and storing data...",
      sender: "ChatGPT",
      optionType: "main",
      commonQuestions: [
        "how are data structures important in computer science",
      ],
      subtopics: ["arrays"],
      quizzes: ["how do linked lists store elements"],
    });
  });

  test("it handles quiz feedback response flow", async () => {
    useSelector.mockImplementation((callback) => {
      return callback({
        messages: {
          messages: [
            {
              sender: "user",
              message: "whats data structure",
              optionType: "quiz",
            },
            {
              sender: "ChatGPT",
              message: "Enter your answer or show answer",
              takeQuiz: true,
            },
          ],
        },
        chat: {
          chatId: "123",
          chats: [],
        },
      });
    });

    const mockFeedback = {
      feedback: "your answer is correct...",
      options: {
        quizzes: ["how do linked lists store elements"],
      },
    };

    const getQuizFeedback = useGetQuizFeedbackMutation()[0];

    getQuizFeedback.mockImplementation(() => ({
      unwrap: jest.fn(() => Promise.resolve(mockFeedback)),
    }));

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, {
      target: {
        value:
          "data structures are ways to store and organize data efficiently...",
      },
    });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(dispatch).toHaveBeenCalledWith(
      addMessage({
        chatId: "123",
        message:
          "data structures are ways to store and organize data efficiently...",
        sender: "user",
        takeQuiz: true,
      })
    );
    expect(createMessage).toHaveBeenCalledWith({
      chatId: "123",
      message:
        "data structures are ways to store and organize data efficiently...",
      sender: "user",
      takeQuiz: true,
    });
    expect(getQuizFeedback).toHaveBeenCalledWith({
      question: "whats data structure",
      answer:
        "data structures are ways to store and organize data efficiently...",
    });
    expect(dispatch).toHaveBeenCalledWith(
      addMessage({
        chatId: "123",
        message: "your answer is correct...",
        sender: "ChatGPT",
        optionType: "quizFeedbackOrAnswer",
        takeQuiz: false,
        quizzes: ["how do linked lists store elements"],
      })
    );
    expect(createMessage).toHaveBeenCalledWith({
      chatId: "123",
      message: "your answer is correct...",
      sender: "ChatGPT",
      optionType: "quizFeedbackOrAnswer",
      takeQuiz: false,
      quizzes: ["how do linked lists store elements"],
    });
  });
});

describe("handleSelection function", () => {
  beforeEach(async () => {
    await act(async () => {
      useSelector.mockImplementation((callback) => {
        return callback({
          messages: {
            messages: [
              { sender: "user", message: "what is data structure1" },
              {
                message:
                  "A data structure is a way of organizing and storing data...",
                sender: "ChatGPT",
                optionType: "main",
                commonQuestions: [
                  "how are data structures important in computer science",
                ],
                subtopics: ["arrays"],
                quizzes: ["how do linked lists store elements"],
              },
            ],
          },
          chat: {
            chatId: "123",
            chats: [],
          },
        });
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <SidebarProvider>
              <ChatPage />
            </SidebarProvider>
          </MemoryRouter>
        </Provider>
      );
    });
  });

  test("it handles user selection when selection type is 'question'", async () => {
    const mockAnswer = {
      answer: "Data structures are fundamental concepts in computer science...",
      options: {
        commonQuestions: [
          "What are some examples of common data structures used in computer science?",
        ],
      },
    };

    const getCommonQuestionAnswer = useGetCommonQuestionAnswerMutation()[0];

    getCommonQuestionAnswer.mockImplementation(() => ({
      unwrap: jest.fn(() => Promise.resolve(mockAnswer)),
    }));

    const button = screen.getByRole("button", {
      name: /how are data structures important in computer science/i,
    });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(dispatch).toHaveBeenCalledWith(
      addMessage({
        chatId: "123",
        message: "how are data structures important in computer science",
        sender: "user",
      })
    );
    expect(createMessage).toHaveBeenCalledWith({
      chatId: "123",
      message: "how are data structures important in computer science",
      sender: "user",
    });
    expect(getCommonQuestionAnswer).toHaveBeenCalledWith({
      message: "how are data structures important in computer science",
    });
    expect(dispatch).toHaveBeenCalledWith(
      addMessage({
        chatId: "123",
        message:
          "Data structures are fundamental concepts in computer science...",
        sender: "ChatGPT",
        optionType: "question",
        commonQuestions: [
          "What are some examples of common data structures used in computer science?",
        ],
      })
    );
    expect(createMessage).toHaveBeenCalledWith({
      chatId: "123",
      message:
        "Data structures are fundamental concepts in computer science...",
      sender: "ChatGPT",
      optionType: "question",
      commonQuestions: [
        "What are some examples of common data structures used in computer science?",
      ],
    });
  });
  test("it handles user selection when selection type is 'subtopic'", async () => {
    const mockAnswer = {
      answer: "An array is a data structure that can store...",
      options: {
        subtopics: ["Accessing elements in an array"],
      },
    };

    const getSubtopicExplanation = useGetSubtopicExplanationMutation()[0];

    getSubtopicExplanation.mockImplementation(() => ({
      unwrap: jest.fn(() => Promise.resolve(mockAnswer)),
    }));

    const button = screen.getByRole("button", {
      name: /arrays/i,
    });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(dispatch).toHaveBeenCalledWith(
      addMessage({
        chatId: "123",
        message: "arrays",
        sender: "user",
      })
    );
    expect(createMessage).toHaveBeenCalledWith({
      chatId: "123",
      message: "arrays",
      sender: "user",
    });
    expect(getSubtopicExplanation).toHaveBeenCalledWith({
      message: "arrays",
    });
    expect(dispatch).toHaveBeenCalledWith(
      addMessage({
        chatId: "123",
        message: "An array is a data structure that can store...",
        sender: "ChatGPT",
        optionType: "subtopic",
        subtopics: ["Accessing elements in an array"],
      })
    );
    expect(createMessage).toHaveBeenCalledWith({
      chatId: "123",
      message: "An array is a data structure that can store...",
      sender: "ChatGPT",
      optionType: "subtopic",
      subtopics: ["Accessing elements in an array"],
    });
  });
  test("it shows an error toast when creatMessage throws an error", async () => {
    const mockAnswer = {
      answer: "An array is a data structure that can store...",
      options: {
        subtopics: ["Accessing elements in an array"],
      },
    };

    const getSubtopicExplanation = useGetSubtopicExplanationMutation()[0];

    getSubtopicExplanation.mockImplementation(() => ({
      unwrap: jest.fn(() => Promise.resolve(mockAnswer)),
    }));
    createMessage.mockImplementation(() => ({
      unwrap: jest.fn(() => ({ success: false, message: "error" })),
    }));

    const button = screen.getByRole("button", {
      name: /arrays/i,
    });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(errorToast).toHaveBeenCalledWith("error");
  });
});

jest.mock("uuid", () => ({
  v4: () => "123",
}));

describe("handleQuizSelection function", () => {
  beforeEach(async () => {
    await act(async () => {
      useSelector.mockImplementation((callback) => {
        return callback({
          messages: {
            messages: [
              { sender: "user", message: "what is data structure" },
              {
                message:
                  "A data structure is a way of organizing and storing data...",
                sender: "ChatGPT",
                optionType: "main",
                quizzes: ["how do linked lists store elements"],
              },
            ],
          },
          chat: {
            chatId: "123",
            chats: [],
          },
        });
      });
    });
  });

  beforeEach(async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <SidebarProvider>
              <ChatPage />
            </SidebarProvider>
          </MemoryRouter>
        </Provider>
      );
    });
  });

  test("it handles user selection when selection type is 'quiz'", async () => {
    const button = screen.getByRole("button", {
      name: "how do linked lists store elements",
    });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(dispatch).toHaveBeenCalledWith(
      addMessage({
        chatId: "123",
        message: "how do linked lists store elements",
        sender: "user",
        optionType: "quiz",
        quizId: "123",
      })
    );
    expect(createMessage).toHaveBeenCalledWith({
      chatId: "123",
      message: "how do linked lists store elements",
      sender: "user",
      optionType: "quiz",
      quizId: "123",
    });
    expect(dispatch).toHaveBeenCalledWith(
      addMessage({
        chatId: "123",
        message: "Enter your answer or show answer",
        sender: "ChatGPT",
        optionType: "quiz",
        takeQuiz: true,
        quizId: "123",
        quizQuestion: "how do linked lists store elements",
      })
    );
    expect(createMessage).toHaveBeenCalledWith({
      chatId: "123",
      message: "Enter your answer or show answer",
      sender: "ChatGPT",
      optionType: "quiz",
      takeQuiz: true,
      quizId: "123",
      quizQuestion: "how do linked lists store elements",
    });
  });
});

describe("handleQuizSelection function 2", () => {
  beforeEach(async () => {
    await act(async () => {
      useSelector.mockImplementation((callback) => {
        return callback({
          messages: {
            messages: [
              { sender: "user", message: "what is data structure" },
              {
                message:
                  "A data structure is a way of organizing and storing data...",
                sender: "ChatGPT",
                optionType: "main",
                quizzes: ["how do linked lists store elements"],
              },
              {
                chatId: "123",
                message: "how do linked lists store elements",
                sender: "user",
                optionType: "quiz",
                quizId: "123",
              },
              {
                chatId: "123",
                message: "Enter your answer or show answer",
                sender: "ChatGPT",
                optionType: "quiz",
                takeQuiz: true,
                quizId: "123",
                quizQuestion: "how do linked lists store elements",
              },
            ],
          },
          chat: {
            chatId: "123",
            chats: [],
          },
        });
      });
    });
  });

  beforeEach(async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <SidebarProvider>
              <ChatPage />
            </SidebarProvider>
          </MemoryRouter>
        </Provider>
      );
    });
  });
  test("it handles flow of when user clicks on 'show answer' button", async () => {
    const mockAnswer = {
      answer: "Linked lists store elements by...",
      options: {
        quizzes: ["What is a node in a linked list?"],
      },
    };

    const getQuizAnswer = useGetQuizAnswerMutation()[0];
    getQuizAnswer.mockImplementation(() => ({
      unwrap: jest.fn(() => Promise.resolve(mockAnswer)),
    }));

    const button = screen.getByRole("button", {
      name: /Show answer/i,
    });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(dispatch).toHaveBeenCalledWith(
      addMessage({
        chatId: "123",
        message: `Show answer for: "how do linked lists store elements"`,
        sender: "user",
        optionType: "takeQuizOrShowAnswer",
        quizId: null,
      })
    );
    expect(createMessage).toHaveBeenCalledWith({
      chatId: "123",
      message: `Show answer for: "how do linked lists store elements"`,
      sender: "user",
      optionType: "takeQuizOrShowAnswer",
      quizId: null,
    });
    expect(getQuizAnswer).toHaveBeenCalledWith({
      message: "how do linked lists store elements",
    });
    expect(dispatch).toHaveBeenCalledWith(
      addMessage({
        chatId: "123",
        message: "Linked lists store elements by...",
        sender: "ChatGPT",
        optionType: "quizFeedbackOrAnswer",
        takeQuiz: false,
        quizzes: ["What is a node in a linked list?"],
      })
    );
    expect(createMessage).toHaveBeenCalledWith({
      chatId: "123",
      message: "Linked lists store elements by...",
      sender: "ChatGPT",
      optionType: "quizFeedbackOrAnswer",
      takeQuiz: false,
      quizzes: ["What is a node in a linked list?"],
    });
  });
});
