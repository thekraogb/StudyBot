import React from "react";
import { render, screen, fireEvent, act , waitFor} from "@testing-library/react";
import renderer from "react-test-renderer";
import { logOut } from "../../app/slices/auth/authslice";
import UserDropdown from "../../components/dropdown/userdropdown";
import { useSelector } from "react-redux";
import { store } from "../../app/store";
import { Provider } from "react-redux";
import { useDispatch } from "react-redux";
import { MemoryRouter } from "react-router-dom";

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock("react-redux", () => {
    const actual = jest.requireActual("react-redux");
    const dispatch = jest.fn();
    return {
        ...actual,
      useDispatch: () => dispatch,
      useSelector: jest.fn(),
    };
  });

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: jest.fn() },
    });
  });

describe("UserDropdown", () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) => {
      return callback({
        auth: {
          name: "Thekra",
          email: "thekra@gmail.com",
        },
      });
    });
  });

  beforeEach(() => {
      render(
        <Provider store={store}>
            <MemoryRouter>
          <UserDropdown />
          </MemoryRouter>
        </Provider>
      );
  });

  test("it renders UserDropdown component", async () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <UserDropdown />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe("handleLogoutClick function", () => {
  beforeEach(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
          <UserDropdown />
          </MemoryRouter>
        </Provider>
      );
  });

  test("it logs out user", async () => {
    const dispatch = useDispatch();

    const logOutBottun = screen.getByRole("button");

    fireEvent.click(logOutBottun);

    await waitFor(() => { expect(dispatch).toHaveBeenCalledWith(logOut());});
    expect(window.location.reload).toHaveBeenCalled();
  });
});
