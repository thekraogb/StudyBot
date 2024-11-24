import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  renderHook,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import { store } from "../../app/store";
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
  removeChat,
  setChats,
} from "../../app/slices/chat/chatslice";
import {
  useDeleteChatMutation,
  useFetchChatsQuery,
} from "../../app/slices/chat/chatapislice.jsx";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import { setMessages } from "../../app/slices/message/messageslice";

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
  const deleteChat = jest.fn(() => ({
    unwrap: jest.fn(() => Promise.resolve({ success: true })),
  }));
  const data = [
    {
      _id: "123",
      title: "whats data structure",
      messages: ["123", "1234"],
    },
    {
      _id: "1234",
      title: "whats OOP",
      messages: ["123", "1234"],
    },
  ];

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
        data: {
          data: data,
        },
      })),
    })),
    useDeleteChatMutation: jest.fn(() => [deleteChat]),
  };
});

jest.mock("../../app/slices/message/messageapislice", () => {
  const createMessage = jest.fn(() => ({
    unwrap: jest.fn(() => Promise.resolve({ success: true })),
  }));
  const data = [
    {
      chatId: "123",
      sender: "user",
      message: "whats data structure",
    },
    {
      chatId: "123",
      sender: "ChatGPT",
      message: "A data structure is a way of...",
      optionType: "main",
      commonQuestions: [
        "How are data structures important in computer science?",
      ],
      subtopics: ["Arrays"],
      quizzes: ["How do linked lists store elements?"],
    },
  ];

  return {
    __esModule: true,
    messageApiSlice: {
      reducer: jest.fn(() => ({})),
      reducerPath: "messageApi",
    },
    useFetchMessagesQuery: jest.fn((chatId, options) => {
      if (chatId && !options.skip) {
        return { success: true, data: { data: data }, error: null };
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

jest.mock("../../toastify/toastify.jsx", () => ({
  successToast: jest.fn(),
  errorToast: jest.fn(),
}));

const dispatch = useDispatch();

describe("Sidebar", () => {
  useSelector.mockImplementation((callback) => {
    return callback({
      chat: {
        chatId: "123",
        chats: [
          {
            _id: "123",
            title: "whats data structure",
            messages: ["123", "1234"],
          },
          {
            _id: "1234",
            title: "whats OOP",
            messages: ["123", "1234"],
          },
        ],
      },
    });
  });

  beforeEach(async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <SidebarProvider>
              <Sidebar />
            </SidebarProvider>
          </MemoryRouter>
        </Provider>
      );
    });
  });

  test("it renders Sidebar component", async () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <SidebarProvider>
              <Sidebar />
            </SidebarProvider>
          </MemoryRouter>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
  test("it fetches chats when component renders", async () => {
    expect(dispatch).toHaveBeenCalledWith(
      setChats([
        {
          _id: "123",
          title: "whats data structure",
          messages: ["123", "1234"],
        },
        {
          _id: "1234",
          title: "whats OOP",
          messages: ["123", "1234"],
        },
      ])
    );
  });

  test("it handles fetching messages when user clicks on a chat", async () => {
    const text = screen.getByText("whats data structure");

    await act(async () => {
      fireEvent.click(text);
    });

    expect(dispatch).toHaveBeenCalledWith(
      setMessages([
        {
          chatId: "123",
          sender: "user",
          message: "whats data structure",
        },
        {
          chatId: "123",
          sender: "ChatGPT",
          message: "A data structure is a way of...",
          optionType: "main",
          commonQuestions: [
            "How are data structures important in computer science?",
          ],
          subtopics: ["Arrays"],
          quizzes: ["How do linked lists store elements?"],
        },
      ])
    );

    expect(dispatch).toHaveBeenCalledWith(setChatId("123"));
  });
});

describe("handleDeleteConfirm function", () => {
  useSelector.mockImplementation((callback) => {
    return callback({
      chat: {
        chatId: "123",
        chats: [
          {
            _id: "123",
            title: "whats data structure",
            messages: ["123", "1234"],
          },
          {
            _id: "1234",
            title: "whats OOP",
            messages: ["123", "1234"],
          },
        ],
      },
    });
  });

  beforeEach(async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <SidebarProvider>
              <Sidebar />
            </SidebarProvider>
          </MemoryRouter>
        </Provider>
      );
    });
  });

  test("it handles chat deletion", async () => {
    const deleteChat = useDeleteChatMutation()[0];
    deleteChat.mockImplementation(() => ({
      unwrap: jest.fn(() =>
        Promise.resolve({ success: true, message: "chat deleted successfully" })
      ),
    }));

    const deleteButtons = screen.getAllByRole("button", { name: "delete" });
    const deleteButton = deleteButtons[1];

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    const confirmDeleteButton = screen.getByRole("button", { name: "Delete" });

    await act(async () => {
      fireEvent.click(confirmDeleteButton);
    });

    expect(successToast).toHaveBeenCalledWith("chat deleted successfully");
    expect(dispatch).toHaveBeenCalledWith(removeChat("1234"));

  });

  test("it handles chat deletion when it throws error", async () => {
    const deleteChat = useDeleteChatMutation()[0];
    deleteChat.mockImplementation(() => ({
      unwrap: jest.fn(() =>
        Promise.resolve({ success: false, message: "error" })
      ),
    }));

    const deleteButtons = screen.getAllByRole("button", { name: "delete" });
    const deleteButton = deleteButtons[1];

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    const confirmDeleteButton = screen.getByRole("button", { name: "Delete" });

    await act(async () => {
      fireEvent.click(confirmDeleteButton);
    });

    expect(errorToast).toHaveBeenCalledWith("error");
  });

  test("it handles chat deletion when it throws error 2", async () => {
    const deleteChat = useDeleteChatMutation()[0];
    deleteChat.mockImplementation(() => ({
      unwrap: jest.fn(() =>Promise.reject())}));

    const deleteButtons = screen.getAllByRole("button", { name: "delete" });
    const deleteButton = deleteButtons[1];

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    const confirmDeleteButton = screen.getByRole("button", { name: "Delete" });

    await act(async () => {
      fireEvent.click(confirmDeleteButton);
    });

    expect(errorToast).toHaveBeenCalledWith("error deleting chat");
  });

  test("it handles chat deletion when selected chat is same as current chat/messages state", async () => {
    const deleteChat = useDeleteChatMutation()[0];
    deleteChat.mockImplementation(() => ({
      unwrap: jest.fn(() =>
        Promise.resolve({ success: true, message: "chat deleted successfully" })
      ),
    }));

    const deleteButtons = screen.getAllByRole("button", { name: "delete" });
    const deleteButton = deleteButtons[0];

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    const confirmDeleteButton = screen.getByRole("button", { name: "Delete" });

    await act(async () => {
      fireEvent.click(confirmDeleteButton);
    });

    expect(successToast).toHaveBeenCalledWith("chat deleted successfully");
    expect(dispatch).toHaveBeenCalledWith(removeChat("123"));
    expect(dispatch).toHaveBeenCalledWith(setChatId(""));
    expect(dispatch).toHaveBeenCalledWith(setMessages([]));
  });
});

describe("handleCancelDelete function", () => {
  useSelector.mockImplementation((callback) => {
    return callback({
      chat: {
        chatId: "123",
        chats: [
          {
            _id: "123",
            title: "whats data structure",
            messages: ["123", "1234"],
          },
          {
            _id: "1234",
            title: "whats OOP",
            messages: ["123", "1234"],
          },
        ],
      },
    });
  });

  beforeEach(async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <SidebarProvider>
              <Sidebar />
            </SidebarProvider>
          </MemoryRouter>
        </Provider>
      );
    });
  });

  test("it handles chat deletion cancellation", async () => {
    const deleteButtons = screen.getAllByRole("button", { name: "delete" });
    const deleteButton = deleteButtons[1];

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    const text = screen.getByText("Are you sure you want to delete this chat?");
    const cancelDeleteButton = screen.getByRole("button", { name: "Cancel" });

    await act(async () => {
      fireEvent.click(cancelDeleteButton);
    });

    expect(text).not.toBeInTheDocument();
  });
});
