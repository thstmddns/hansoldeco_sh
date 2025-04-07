import { defineStore } from "pinia";

export const useImageEditStore = defineStore({
    id: "imageEdit",
    state: () => ({
        imageEditSource: {
            id: -1,
            file_name: "",
            origin_image_url: "",
            bounding_box_image_url: "",
            bounding_box_json: null
        }
    }),
    getters: {
        getImageEditSource() {
            return this.imageEditSource;
        }
    },
    actions: {
        setImageEditSource(image) {
            this.imageEditSource = image;
        }
    },
    persist: true
});