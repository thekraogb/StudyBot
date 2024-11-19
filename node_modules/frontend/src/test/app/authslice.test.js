import authReducer, {
  setAccessToken,
  setCredentials,
  logOut,
  selectCurrentToken,
} from "../../app/slices/auth/authslice";

describe("authSlice", () => {
  test("it returns initial state", () => {
    const initialState = {
      name: null, 
      email: null,
      token: null,
    };

    expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  test("it handles setAccessToken", () => {
    const previousState = { name: null, email: null, token: null };
    const nextState = authReducer(
      previousState,
      setAccessToken({ accessToken: "123" })
    );

    expect(nextState.token).toEqual("123");
    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      "accessToken",
      "123"
    );
  });

  test("it handles setCredentials", () => {
    const previousState = { name: null, email: null, token: null };
    const nextState = authReducer(
      previousState,
      setCredentials({ name: "thekra", email: "thekra@gmail.com" })
    );

    expect(nextState.name).toEqual("thekra");
    expect(nextState.email).toEqual("thekra@gmail.com");
    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      "name",
      "thekra"
    );
    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      "email",
      "thekra@gmail.com"
    );
  });

  test("it handles logOut", () => {
    const previousState = {
      name: "thekra",
      email: "thekra@gmail.com",
      token: "123",
    };

    const nextState = authReducer(previousState, logOut());

    expect(nextState).toEqual({ name: null, email: null, token: null });
    expect(global.localStorage.removeItem).toHaveBeenCalledWith("name");
    expect(global.localStorage.removeItem).toHaveBeenCalledWith("email");
    expect(global.localStorage.removeItem).toHaveBeenCalledWith("accessToken");
    expect(global.localStorage.removeItem).toHaveBeenCalledWith("chats");
    expect(global.localStorage.removeItem).toHaveBeenCalledWith("chatId");
    expect(global.localStorage.removeItem).toHaveBeenCalledWith("messages");
  });

  test("selectCurrentToken returns the current token", () => {
    const state = {
      auth: { name: "thekra", email: "thekra@gmail.com", token: "123" },
    };

    expect(selectCurrentToken(state)).toEqual("123");
  });
});
