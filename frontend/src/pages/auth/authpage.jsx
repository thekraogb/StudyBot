import React from 'react';
import { useRef, useState, useEffect } from "react";
import "./authpage.css";
import {
  successToast,
  errorToast,
  warningToast,
} from "../../toastify/toastify.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setCredentials,
  setAccessToken,
} from "../../app/slices/auth/authslice";
import { useLoginMutation } from "../../app/slices/auth/authapislice";
import { logOut } from "../../app/slices/auth/authslice";
import { useRegisterUserMutation } from "../../app/slices/user/registerapislice";

const AuthPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const [registerUser] = useRegisterUserMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logOut());
  }, []);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      warningToast("Passwords do not match!");
      return;
    }

    try {
      await registerUser({ name, email, password }); 
      successToast("User created successfully");
    } catch (err) {
      errorToast(err.data?.message || "Signup failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setAccessToken({ ...userData }));
      dispatch(setCredentials({ ...userData }));
      setEmail("");
      setPassword("");
      navigate("/home");
    } catch (err) {
      if (!err?.status) {
        errorToast("No Server Response");
      } else if (err.status === 400) {
        errorToast(err.data?.message || "All fields are required");
      } else if (err.status === 401) {
        errorToast(err.data?.message || "Invalid credentials");
      } else {
        errorToast(err.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">STUDYBOT</h1>
      <div className="auth-box">
        {isLogin ? (
          <>
            <h2>Login</h2>
            <form aria-label="login form" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email address"
                required
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="auth-buttons">
                <button aria-label="login button" type="submit" className="login-button">
                  Login
                </button>
                <button
                  type="button"
                  aria-label="signup toggle button"
                  className="toggle-button"
                  onClick={toggleForm}
                >
                  Signup
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2>Signup</h2>
            <form aria-label="signup form" onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Name"
                required
                autoComplete="off"
                onChange={(e) => {
                  const capitalized = e.target.value
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");
                  setName(capitalized);
                }}
              />
              <input
                type="email"
                placeholder="Email address"
                required
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                autoComplete="off"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="auth-buttons">
                <button
                  type="button"
                  aria-label="login toggle button"
                  className="toggle-button"
                  onClick={toggleForm}
                >
                  Login
                </button>
                <button aria-label="signup button" type="submit" className="signup-button">
                  Signup
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
