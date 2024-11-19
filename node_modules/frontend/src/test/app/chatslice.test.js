import chatReducer, {
  setChatId,
  setChats,
  removeChat,
  clearChats,
} from "../../app/slices/chat/chatslice";

describe("chatSlice", () => {
  test("it returns initial state", () => {
    const initialState = {
      chats: [],
      chatId: "",
    };

    expect(chatReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  test("it handles setChatId", () => {
    const previousState = { chats: [], chatId: "" };
    const nextState = chatReducer(previousState, setChatId("123"));

    expect(nextState.chatId).toEqual("123");
    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      "chatId",
      "123"
    );
  });

  test("it handles setChats", () => {
    const previousState = { chats: [], chatId: "" };
    const chats = [
      { _id: "1", title: "Chat 1" },
      { _id: "2", title: "Chat 2" },
    ];
    const nextState = chatReducer(previousState, setChats(chats));

    expect(nextState.chats).toEqual(chats);
    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      "chats",
      JSON.stringify(chats)
    );
  });

  test("it handles removeChat", () => {
    const previousState = {
      chats: [
        { _id: "1", title: "Chat 1" },
        { _id: "2", title: "Chat 2" },
      ],
      chatId: "",
    };

    const nextState = chatReducer(previousState, removeChat("1"));

    expect(nextState.chats).toEqual([{ _id: "2", title: "Chat 2" }]);
    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      "chats",
      JSON.stringify([{ _id: "2", title: "Chat 2" }])
    );
  });

  test("it handles clearChats", () => {
    const previousState = {
      chats: [
        { _id: "1", title: "Chat 1" },
        { _id: "2", title: "Chat 2" },
      ],
      chatId: "123",
    };

    const nextState = chatReducer(previousState, clearChats());

    expect(nextState).toEqual({ chats: [], chatId: "" });
    expect(global.localStorage.removeItem).toHaveBeenCalledWith("chats");
    expect(global.localStorage.removeItem).toHaveBeenCalledWith("chatId");
  });
});
