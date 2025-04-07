import axios from "axios";
import { SERVER_URL } from "./url";
import { MASTER_TOKEN } from "./auth";

export const getQRList = async () => {
    return await axios.get(`${SERVER_URL}/api/qrs?populate[defects][populate][0]=report&populate[reports][populate]=*&populate[creator][populate]=*&pagination[limit]=-1`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: MASTER_TOKEN,
        },
    });
}

export const getQRById = async (id) => {
    return await axios.get(`${SERVER_URL}/api/qrs/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: MASTER_TOKEN,
        },
    });
}

export const getQRByTitle = async (title) => {
    return await axios.get(`${SERVER_URL}/api/qrs?filters[title][$eq]=${title}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: MASTER_TOKEN,
        },
    });
}

export const postQR = async (data) => {
    return await axios.post(`${SERVER_URL}/api/qrs`, { data }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: MASTER_TOKEN,
        },
    });
}

export const deleteQR = async (id) => {
    return await axios.delete(`${SERVER_URL}/api/qrs/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: MASTER_TOKEN,
        },
    });
}