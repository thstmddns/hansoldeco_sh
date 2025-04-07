import { AI_SERVER_URL } from "./url";

export const classify = async (image) => {
  const formData = new FormData();
  formData.append("image", image);

  try {
    const res = await fetch(`${AI_SERVER_URL}/classification`, {
      method: "POST",
      cache: "no-cache",
      body: formData,
    });

    console.log(res);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Inquiry AI Model List
 * @returns {object} { model_list: [모델1, 모델2,  …] }
 */
export const getModelList = async () => {
  try {
    const res = await fetch(`${AI_SERVER_URL}/admin`, {
      method: "GET",
      cache: "no-cache",
    });
    console.log(res);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.log("An error occurred:", err);
    alert("서버와의 연결이 끊어졌습니다. 다시 시도해주세요.");
    throw err;
  }
};

/**
 * Inquiry the model name currently applied
 * @returns {string} model name
 */
export const getModelApplied = async () => {
  try {
    const res = await fetch(`${AI_SERVER_URL}/model_check`, {
      method: "GET",
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.log("An error occurred:", err);
    alert("서버와의 연결이 끊어졌습니다. 다시 시도해주세요.");
    throw err;
  }
};

/**
 * End Point: model_upload
 * Request Body: { model_file: file, model_name: name }
 * @param {string} name
 * @param {file} file
 */
export const postNewModel = async (name, file) => {
  const formData = new FormData();
  formData.append("model_name", name);
  formData.append("model_file", file);

  try {
    const res = await fetch(`${AI_SERVER_URL}/model_upload`, {
      method: "POST",
      cache: "no-cache",
      body: formData,
    });

    console.log(res);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.log("An error occurred:", err);
    alert("서버와의 연결이 끊어졌습니다. 다시 시도해주세요.");
    throw err;
  }
};

/**
 * End Point: model_apply
 * Request Body: { model_name: name }
 * @param {string} name
 */
export const postApplyModel = async (name) => {
  const formData = new FormData();
  formData.append("model_name", name);

  try {
    const res = await fetch(`${AI_SERVER_URL}/model_apply`, {
      method: "POST",
      cache: "no-cache",
      body: formData,
    });

    console.log(res);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.log("An error occurred:", err);
    alert("서버와의 연결이 끊어졌습니다. 다시 시도해주세요.");
    throw err;
  }
};

/**
 * Remove specific model
 * @param {string} name
 */
export const postRemoveModel = async (name) => {
  const formData = new FormData();
  formData.append("model_name", name);

  try {
    const res = await fetch(`${AI_SERVER_URL}/model_remove`, {
      method: "POST",
      cache: "no-cache",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
