import { defineStore } from "pinia";

export const useAiModelStore = defineStore({
  id: "model",
  state: () => ({
    current_model_name: "",
    model_list: [],
  }),
  actions: {
    getAiModelInfo() {
      return {
        model_name: this.current_model_name,
        model_list: this.model_list,
      };
    },
    setAiModelNameApplied(model_name) {
      this.current_model_name = model_name;
    },
    setAiModelList(list) {
      this.model_list = list;
    },
    clearAiModelInfo() {
      this.current_model_name = "";
      this.model_list = [];
    },
  },
  persist: {
    enabled: true,
  },
});
