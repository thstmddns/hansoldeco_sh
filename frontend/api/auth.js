import axios from "axios";
import { SERVER_URL } from "./url";

export const MASTER_TOKEN = process.env.MASTER_TOKEN;
export const signup = (email, name, password, platform = "", platform_email = "") => {
  console.log(password);
  return axios.post(
    `${SERVER_URL}/api/auth/local/register`,
    {
      username: name,
      email: email,
      password: password,
      platform: platform,
      platform_email: platform_email,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: MASTER_TOKEN,
      },
    }
  );
};

export const login = (identifier, password) => {
  return axios.post(
    `${SERVER_URL}/api/auth/local`,
    {
      identifier: identifier,
      password: password,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: MASTER_TOKEN,
      },
    }
  );
};

export const isAuthenticated = () => {
  return localStorage.getItem("jt") !== null && localStorage.getItem("user_id") !== null;
};
