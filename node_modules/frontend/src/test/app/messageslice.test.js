import messageReducer, {
  addMessage,
  setMessages,
  clearMessages,
} from "../../app/slices/message/messageslice";

describe("messageSlice", () => {
  test("it returns initial state", () => {
    const initialState = {
      messages: [
        {
          message: "Hi! Ask me any question related to STEM.",
          sender: "ChatGPT",
        },
      ],
    };

    expect(messageReducer(undefined, { type: undefined })).toEqual(
      initialState
    );
  });

  test("it handles addMessage", () => {
    const previousState = {
      messages: [
        {
          message: "Hi! Ask me any question related to STEM.",
          sender: "ChatGPT",
        },
      ],
    };

    const newMessage = {
      message: "whats data structure",
      sender: "user",
    };

    const nextState = messageReducer(previousState, addMessage(newMessage));

    expect(nextState.messages).toContainEqual(newMessage);
    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      "messages",
      JSON.stringify(nextState.messages)
    );
  });

  test("it handles setMessages", () => {
    const previousState = {
      messages: [
        {
          message: "Hi! Ask me any question related to STEM.",
          sender: "ChatGPT",
        },
      ],
    };

    const newMessages = [
      {
        message: "whats data structure",
        sender: "user",
      },
    ];

    const nextState = messageReducer(previousState, setMessages(newMessages));

    expect(nextState.messages).toEqual([
      {
        message: "Hi! Ask me any question related to STEM.",
        sender: "ChatGPT",
      },
      ...newMessages,
    ]);
    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      "messages",
      JSON.stringify(nextState.messages)
    );
  });

  test("it handles clearMessages", () => {
    const previousState = {
      messages: [
        {
          message: "Hi! Ask me any question related to STEM.",
          sender: "ChatGPT",
        },
        {
          message: "whats data structure",
          sender: "user",
        },
      ],
    };

    const nextState = messageReducer(previousState, clearMessages());

    expect(nextState.messages).toEqual([
      {
        message: "Hi! Ask me any question related to STEM.",
        sender: "ChatGPT",
      },
    ]);
    expect(global.localStorage.removeItem).toHaveBeenCalledWith("messages");
  });
});
