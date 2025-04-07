import { defineStore } from "pinia";

export const useDefectStore = defineStore({
  id: "defect",
  state: () => ({
    location_url: "",
    file_list: [],
  }),
  getters: {
    getLocationUrl() {
      return this.location_url;
    },
    getFileList() {
      return this.file_list;
    },
  },
  actions: {
    setLocationUrl(location_url) {
      this.location_url = location_url;
    },
    setFileList(file_list) {
      this.file_list = file_list;
    },
  },
  persist: true
});
