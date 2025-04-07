import axios from "axios";
import { MASTER_TOKEN } from "./auth";
import { SERVER_URL } from "./url";

export const getUser = async (id) => {
  return axios.get(`${SERVER_URL}/api/users/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: MASTER_TOKEN,
    },
  });
};
