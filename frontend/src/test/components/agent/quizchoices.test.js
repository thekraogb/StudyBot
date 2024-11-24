import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import renderer from "react-test-renderer";
import ChatPage from "../../../pages/chatbot/chatbotpage";
import { store } from "../../../app/store";
import Appbar from "../../../components/appbar/Appbar";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { SidebarProvider } from "../../../context/sidebarcontext";
import QuizChoices from "../../../components/agent/quizchoices";

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

jest.mock("../../../app/api/apislice", () => ({
  __esModule: true,
  apiSlice: {
    reducer: jest.fn(() => ({})),
    reducerPath: "api",
    middleware: jest.fn(() => (next) => (action) => next(action)),
  },
}));

jest.mock("../../../app/slices/chat/chatapislice", () => {
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

jest.mock("../../../app/slices/message/messageapislice", () => {
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

jest.mock("../../../app/slices/agent/agentapislice", () => {
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
  const getQuizQuestionChoices = jest.fn(() => ({
    unwrap: jest.fn(() => Promise.resolve()),
  }));
  const getQuizChoiceFeedback = jest.fn(() => ({
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
    useGetQuizQuestionChoicesMutation: jest.fn(() => [getQuizQuestionChoices]),
    useGetQuizChoiceFeedbackMutation: jest.fn(() => [getQuizChoiceFeedback]),
  };
});

useSelector.mockImplementation((callback) => {
  return callback({
    messages: {
      messages: [
        {
          chatId: "123",
          quizChoices: ["choice1","choice2","choice3"],
          sender: "ChatGPT",
          optionType: "showQuizChoices",
          quizId: "123",
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

describe("QuizChoices", () => {
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

  test("it renders QuizChoices component", async () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <SidebarProvider>
              <Appbar />
              <ChatPage />
            </SidebarProvider>
          </MemoryRouter>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe("handleQuizChoiceSelection function", () => {
  const mockHandleQuizChoiceSelection = jest.fn();

  beforeEach(async () => {
    await act(async () => {
      render(
        <QuizChoices
        quizChoices= {["choice1","choice2","choice3"]}
        handleQuizChoiceSelection={mockHandleQuizChoiceSelection}
          quizId={"123"}
        />
      );
    });
  });

  test("it calls handleQuizChoiceSelection when clicking a choice button", async () => {
    const subtopicButton = screen.getByRole("button", {
      name: "choice1",
    });
    fireEvent.click(subtopicButton);

    expect(mockHandleQuizChoiceSelection).toHaveBeenCalledWith(
      "choice1",
      ["choice1","choice2","choice3"],
      "quizChoice",
      "123"
    );
  });
});