import axios from "axios";
import { SERVER_URL } from "./url";
import { MASTER_TOKEN } from "./auth";

export const postDefect = async (data) => {
    return await axios.post(SERVER_URL + "/api/defects", {data}, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": MASTER_TOKEN
        }
    });
}

export const putDefect = async (id, data) => {
    return await axios.put(SERVER_URL + "/api/defects/" + id, {data}, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": MASTER_TOKEN
        }
    });
}