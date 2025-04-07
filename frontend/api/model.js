import axios from "axios";
import { SERVER_URL } from "./url";
import { MASTER_TOKEN } from "./auth";

/**
 * Change Applied model
 * @param {*} id
 * @param {*} is_applied
 * @returns
 */
export const postUpdateModelInfo = async (id, is_applied) => {
  try {
    const res = await axios.put(
      `${SERVER_URL}/api/models/${id}`,
      {
        data: { isRun: is_applied },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: MASTER_TOKEN,
        },
      }
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Update the New model (save to DB)
 * @param {JSON} data: { name: name, isRun: is applied }
 * @returns
 */
export const postNewModelInfo = async (data) => {
  try {
    return axios.post(
      `${SERVER_URL}/api/models`,
      { data },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: MASTER_TOKEN,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

/**
 * Find the model ID and delete it
 * @param {string} id
 */
export const deleteModelInfo = async (id) => {
  try {
    const res = await axios.delete(`${SERVER_URL}/api/models/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: MASTER_TOKEN,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Search model ID
 * @param {string} model_name
 */
export const getModelIdWithItsName = async (model_name) => {
  try {
    const res = await axios.get(`${SERVER_URL}/api/models?filters%5Bname%5D=${model_name}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: MASTER_TOKEN,
      },
    });
    if (res.data) {
      return res.data;
    }
  } catch (err) {
    console.log(err);
  }
};
