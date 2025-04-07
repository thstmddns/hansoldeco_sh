import axios from "axios";
import { SERVER_URL } from "./url";
import { MASTER_TOKEN } from "./auth";

export const getReports = async () => {
    return await axios.get(SERVER_URL + "/api/reports?populate=*&pagination[limit]=-1", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": MASTER_TOKEN
        }
    });
}

export const getReportListByQR = async (qr) => {
    return await axios.get(SERVER_URL + "/api/reports?populate=*&pagination[limit]=-1&filters[qr][id][$eq]=" + qr, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": MASTER_TOKEN
        }
    });
}

export const postReports = async (data) => {
    return await axios.post(SERVER_URL + "/api/reports", {data}, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": MASTER_TOKEN
        }
    });
}
