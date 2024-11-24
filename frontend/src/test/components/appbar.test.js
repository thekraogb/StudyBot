import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import { store } from "../../app/store";
import Appbar from "../../components/appbar/Appbar";
import { useDispatch } from "react-redux";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { SidebarProvider } from "../../context/sidebarcontext";
import { setChatId } from "../../app/slices/chat/chatslice";
import { setMessages } from "../../app/slices/message/messageslice";

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock("react-redux", () => {
  const dispatch = jest.fn();
  return {
    ...jest.requireActual("react-redux"),
    useDispatch: () => dispatch,
  };
});

jest.mock("../../app/api/apislice", () => ({
  __esModule: true,
  apiSlice: {
    reducer: jest.fn(() => ({})),
    middleware: () => (next) => (action) => next(action),
  },
}));

jest.mock("../../app/slices/chat/chatapislice", () => ({
  __esModule: true,
  chatApiSlice: {
    reducer: jest.fn(() => ({})),
  },
  useCreateChatMutation: jest.fn(() => [jest.fn()]),
  useFetchChatsQuery: jest.fn(() => ({
    data: { data: [] },
    refetch: jest.fn(() => ({
      success: true,
      data: { data: [{ chatId: "", title: "" }] },
    })),
  })),
  useDeleteChatMutation: jest.fn(() => [jest.fn()]),
}));

jest.mock("../../app/slices/message/messageapislice", () => ({
  __esModule: true,
  messageApiSlice: {
    reducer: jest.fn(() => ({})),
  },
  useFetchMessagesQuery: jest.fn((chatId, options) => {
    if (chatId && !options.skip) {
      return { data: { data: [{ sender: "", message: "" }] }, error: null };
    }

    return { data: null, error: true };
  }),
  useCreateMessageMutation: jest.fn(() => [jest.fn()]),
}));

jest.mock("../../app/slices/agent/agentapislice", () => ({
  __esModule: true,
  agentApiSlice: {
    reducer: jest.fn(() => ({})),
  },
  useGetMainAnswerMutation: jest.fn(() => [jest.fn()]),
  useGetCommonQuestionAnswerMutation: jest.fn(() => [jest.fn()]),
  useGetSubtopicExplanationMutation: jest.fn(() => [jest.fn()]),
  useGetQuizFeedbackMutation: jest.fn(() => [jest.fn()]),
  useGetQuizAnswerMutation: jest.fn(() => [jest.fn()]),
  useGetQuizQuestionChoicesMutation: jest.fn(() => [jest.fn()]),
  useGetQuizChoiceFeedbackMutation: jest.fn(() => [jest.fn()]),
}));

describe("Appbar", () => {
    beforeEach(async () => {
      await act(async () => {
        render(
          <Provider store={store}>
            <MemoryRouter>
              <SidebarProvider>
                <Appbar />
              </SidebarProvider>
            </MemoryRouter>
          </Provider>
        );
      });
    });

  test("it renders appbar component", async () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <SidebarProvider>
            <Appbar />
          </SidebarProvider>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  test("it shows UserDropdown component when clicking on name div", async () => {
    const name = screen.getByRole("button", { name: "User Dropdown" });

    await act(async () => {
      fireEvent.click(name);
    });

    expect(await screen.findByText("Log out")).toBeInTheDocument();
  });

});

describe("handleNewChatClick function", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <SidebarProvider>
              <Appbar />
            </SidebarProvider>
          </MemoryRouter>
        </Provider>
      );
    });
  });

  test("it dispatchs setChatId and setMessages and shows a tooltip when clicking on new chat button", async () => {
    const dispatch = useDispatch();

    const newChatButton = screen.getByRole("button", { name: /new chat/i });

    await act(async () => {
      fireEvent.mouseOver(screen.getByRole("button", { name: /new chat/i }));
    });

    expect(await screen.findByText("New chat")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(newChatButton);
    });

    expect(dispatch).toHaveBeenCalledWith(setChatId(""));
    expect(dispatch).toHaveBeenCalledWith(setMessages([]));
  });
});
