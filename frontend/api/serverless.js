import { dataURI2Blob } from "../lib/dataURI2blob";
import { SERVERLESS_URL } from "./url";
import axios from "axios";

export const uploadImageByDataURI = async (dataURI, filename = "image.png") => {
    const blob = dataURI2Blob(dataURI);
    const file = new File([blob], filename, { type: "image/png" });

    const formData = new FormData();
    formData.append("file", file);

    
    return await axios.post(`${SERVERLESS_URL}`, formData, {
        headers: {
            "Content-Type": "application/form-data",
        },
    });
}
