import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  renderHook,
} from "@testing-library/react";
// import {
// renderHook
// } from "@testing-library/react-hooks";
import user from "@testing-library/user-event";
import AuthPage from "../../pages/auth/authpage";
import { MemoryRouter, Router, Routes, Route } from "react-router-dom";
import { store } from "../../app/store";
import { Provider } from "react-redux";
import { useRegisterUserMutation } from "../../app/slices/user/registerapislice";
import { useLoginMutation } from "../../app/slices/auth/authapislice";
import {
  warningToast,
  successToast,
  errorToast,
} from "../../toastify/toastify.jsx";
import { useDispatch } from "react-redux";
import {
  setCredentials,
  setAccessToken,
} from "../../app/slices/auth/authslice";
import { useState as useStateMock } from "react";
import { useNavigate } from "react-router-dom";

afterEach(() => {
  jest.clearAllMocks();
});

describe("AuthPage", () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </Provider>
    );
  });

  test("it shows only login form", () => {
    const login = screen.getByRole("form", { name: /login form/i });
    const signup = screen.queryByRole("form", { name: /signup form/i });
    const emailInput = screen.getByPlaceholderText("Email address");
    const passwordInput = screen.getByPlaceholderText("Password");
    const buttons = screen.getAllByRole("button");

    expect(login).toBeInTheDocument();
    expect(signup).not.toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(buttons).toHaveLength(2);
  });

  test("it shows only signup form after toggling", async () => {
    const toggleButton = screen.getByRole("button", {
      name: /signup toggle button/i,
    });

    await user.click(toggleButton);

    const signup = screen.getByRole("form", { name: /signup form/i });
    const login = screen.queryByRole("form", { name: /login form/i });

    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email address");
    const passwordInput = screen.getByPlaceholderText("Password");
    const passwordConfInput = screen.getByPlaceholderText("Confirm Password");
    const buttons = screen.getAllByRole("button");

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(passwordConfInput).toBeInTheDocument();
    expect(buttons).toHaveLength(2);
    expect(signup).toBeInTheDocument();
    expect(login).not.toBeInTheDocument();
  });
});

jest.mock("../../app/slices/user/registerapislice", () => {
  const registerUser = jest.fn();
  const useRegisterUserMutation = jest.fn(() => [registerUser]);
  useRegisterUserMutation.registerUser = registerUser;
  return { useRegisterUserMutation };
});

jest.mock("../../toastify/toastify.jsx", () => ({
  warningToast: jest.fn(),
  successToast: jest.fn(),
  errorToast: jest.fn(),
}));

describe("handleSignup function", () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </Provider>
    );
  });

  test("it shows warning toast and doesnt register user if passwords dont match", async () => {
    const toggleButton = screen.getByRole("button", {
      name: /signup toggle button/i,
    });

    await user.click(toggleButton);

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "1234" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /signup button/i }));

    expect(warningToast).toHaveBeenCalledWith("Passwords do not match!");

    expect(useRegisterUserMutation.registerUser).not.toHaveBeenCalled();
  });

  test("it shows success toast and registers user if signup is successful", async () => {
    const toggleButton = screen.getByRole("button", {
      name: /signup toggle button/i,
    });

    await user.click(toggleButton);

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Thekra" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "thekra@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /signup button/i }));

    await waitFor(() => {
      expect(useRegisterUserMutation.registerUser).toHaveBeenCalledWith({
        email: "thekra@gmail.com",
        name: "Thekra",
        password: "123",
      });
    });

    expect(successToast).toHaveBeenCalledWith("User created successfully");
  });

  test("it shows error toast and catches an error when registerUser throws one", async () => {
    useRegisterUserMutation.registerUser.mockImplementation(() =>
      Promise.reject({ data: { message: "error" } })
    );

    const toggleButton = screen.getByRole("button", {
      name: /signup toggle button/i,
    });

    await user.click(toggleButton);

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Thekra" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "thekra@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /signup button/i }));

    await waitFor(() => {
      expect(useRegisterUserMutation.registerUser).toHaveBeenCalledWith({
        email: "thekra@gmail.com",
        name: "Thekra",
        password: "123",
      });
    });

    expect(errorToast).toHaveBeenCalledWith("error" || "Signup failed");
  });
});

// jest.mock("react-router-dom", () => {
//   const navigate = jest.fn();
//   return {
//     ...jest.requireActual("react-router-dom"),
//     useNavigate: () => navigate,
//   };
// });

// const mockedUsedNavigate = jest.fn();
// jest.mock('react-router-dom', () => ({
//     ...(jest.requireActual('react-router-dom')),
//     useNavigate: () => mockedUsedNavigate,
// }))

jest.mock("../../app/slices/auth/authapislice", () => {
  const login = jest.fn();
  const useLoginMutation = jest.fn(() => [login]);
  useLoginMutation.login = login;
  return { useLoginMutation };
});

jest.mock("react-redux", () => {
  const dispatch = jest.fn();
  return {
    ...jest.requireActual("react-redux"),
    useDispatch: () => dispatch,
  };
});

jest.mock("../../app/slices/auth/authslice", () => ({
  setAccessToken: jest.fn(),
  setCredentials: jest.fn(),
  logOut: jest.fn(),
}));

describe("handleLogin function", () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </Provider>
    );
  });

  test("it logs in user, sets access token and credentials, and navigates to /home", async () => {
    const dispatch = useDispatch();

    useLoginMutation.login.mockImplementation(() =>
      Promise.resolve({
        accessToken: "eyJhb",
        name: "thekra",
        email: "thekra@gmail.com",
      })
    );

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "thekra@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /login button/i }));

    await waitFor(() => {
      expect(useLoginMutation.login).toHaveBeenCalledWith({
        email: "thekra@gmail.com",
        password: "123",
      });
    });

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(
        setAccessToken({
          accessToken: "eyJhb",
          email: "thekra@gmail.com",
          name: "thekra",
        })
      );
      expect(dispatch).toHaveBeenCalledWith(
        setCredentials({
          accessToken: "eyJhb",
          email: "thekra@gmail.com",
          name: "thekra",
        })
      );
    });

    await waitFor(() => {
      expect(setAccessToken).toHaveBeenCalledWith({
        accessToken: "eyJhb",
        email: "thekra@gmail.com",
        name: "thekra",
      });
      expect(setCredentials).toHaveBeenCalledWith({
        accessToken: "eyJhb",
        email: "thekra@gmail.com",
        name: "thekra",
      });
    });
  });

  test("it shows 'No Server Response' if there is no error status", async () => {
    useLoginMutation.login.mockImplementation(() => ({unwrap: () => Promise.reject()}));

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "thekra@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /login button/i }));

    await waitFor(() => {
      expect(useLoginMutation.login).toHaveBeenCalledWith({
        email: "thekra@gmail.com",
        password: "123",
      });
    });

    await waitFor(() => {
      expect(errorToast).toHaveBeenCalledWith("No Server Response");
    });

  });

  test("it shows 'All fields are required' if error status is 400", async () => {
    useLoginMutation.login.mockImplementation(() => ({
      unwrap: () => Promise.reject({ status: 400, data: { message: "All fields are required" } })
    }));
  
    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "thekra@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123" },
    });
  
    fireEvent.submit(screen.getByRole("button", { name: /login button/i }));
  
    await waitFor(() => {
      expect(errorToast).toHaveBeenCalledWith("All fields are required");
    });
  });
  

  test("it shows 'Invalid credentials' if error status is 401", async () => {
    useLoginMutation.login.mockImplementation(() => ({unwrap: () =>
      Promise.reject({ status: 401, data: { message: "Invalid credentials" } })
  }));

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "thekra@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /login button/i }));

    await waitFor(() => {
      expect(useLoginMutation.login).toHaveBeenCalledWith({
        email: "thekra@gmail.com",
        password: "123",
      });
    });

    await waitFor(() => {
      expect(errorToast).toHaveBeenCalledWith("Invalid credentials");
    });

  });

  test("it shows 'Login failed' for any other error status", async () => {
    useLoginMutation.login.mockImplementation(() => ({unwrap: () =>
      Promise.reject({ status: 4002 })
  }));

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "thekra@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /login button/i }));

    await waitFor(() => {
      expect(errorToast).toHaveBeenCalledWith("Login failed");
    });
  });
});
