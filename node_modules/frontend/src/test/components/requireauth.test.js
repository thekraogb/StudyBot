import React from "react";
import { render, act } from "@testing-library/react";
import renderer from "react-test-renderer";
import { store } from "../../app/store";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import RequireAuth from "../../components/auth/requireauth.jsx";

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock("react-redux", () => {
  return {
    ...jest.requireActual("react-redux"),
    useSelector: jest.fn(),
  };
});

describe("RequireAuth", () => {
  useSelector.mockImplementation((callback) => {
    return callback({
      auth: {
        token: "123",
      },
    });
  });

  beforeEach(async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <RequireAuth />
          </MemoryRouter>
        </Provider>
      );
    });
  });

  test("it renders RequireAuth when token has value (redirects to home page)", async () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <RequireAuth />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
  test("it renders RequireAuth when token is empty (redirects to login page)", async () => {
    useSelector.mockImplementation((callback) => {
      return callback({
        auth: {
          token: "",
        },
      });
    });
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <RequireAuth />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
