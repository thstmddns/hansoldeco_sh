import { AI_SERVER_URL } from "./url";
import axios from "axios";

export const sendChat = async (chat_id, text) => {
    const formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('text', text);

    return axios.post(`${AI_SERVER_URL}/hansol_deco_chatbot`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}