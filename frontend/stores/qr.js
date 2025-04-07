import { defineStore } from "pinia";

export const useQRStore = defineStore({
  id: "qr",
  state: () => ({
    qr: null,
  }),
  getters: {
    getQr() {
      return this.qr;
    },
  },
  actions: {
    setQr(qr) {
      this.qr = qr;
    },
  },
  persist: true
});
