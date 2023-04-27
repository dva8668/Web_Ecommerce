import { createContext, useEffect, useReducer } from "react";
import { authReducer } from "../reducers/authReducer";
import apiRequest from "../hooks/api";
import authToken from "../utils/authToken";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    username: null,
    isAdmin: 0,
  });

  async function loadUser() {
    if (localStorage["token"]) {
      authToken(localStorage["token"]);
      try {
        const data = await axios.get(`http://localhost:3001/auth`);
        if (data.data.success) {
          dispatch({
            type: "LOGIN_USER",
            payload: {
              isAuthenticated: true,
              username: data.data.username,
              isAdmin: data.data.isAdmin,
            },
          });
        }
      } catch (error) {
        localStorage.removeItem("token");
        authToken(null);
        dispatch({
          type: "LOGIN_USER",
          payload: { isAuthenticated: false, username: null, isAdmin: 0 },
        });
        console.log(error);
      }
    }
  }

  useEffect(() => {
    async function autoLoadUser() {
      if (localStorage["token"]) {
        authToken(localStorage["token"]);

        try {
          const data = await axios.get(`http://localhost:3001/auth`);
          if (data.data.success) {
            dispatch({
              type: "LOGIN_USER",
              payload: {
                isAuthenticated: true,
                username: data.data.username,
                isAdmin: data.data.isAdmin,
              },
            });
          }
        } catch (error) {
          localStorage.removeItem("token");
          authToken(null);
          dispatch({
            type: "LOGIN_USER",
            payload: { isAuthenticated: false, username: null, isAdmin: 0 },
          });
          console.log(error);
        }
      }
    }
    autoLoadUser();
  }, []);

  async function login(loginForm) {
    try {
      const data = await apiRequest("/login", "POST", loginForm);
      if (data.success) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("isAdmin", data.isAdmin);
        await loadUser();
        return data;
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  const value = {
    login,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
