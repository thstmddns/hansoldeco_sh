import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    user_id: null,
    user_name: null,
    email: null,
    phone: null,
    limit: 0,
    isAdmin: false,
    blocked: false,
  }),
  getters: {
    getUser() {
      return {
        user_id: this.user_id,
        user_name: this.user_name,
        email: this.email,
        phone: this.phone,
        limit: this.limit,
        isAdmin: this.isAdmin,
        blocked: this.blocked,
      };
    },
  },
  actions: {
    setUser(userData) {
      this.user_id = userData.id;
      this.user_name = userData.user_name;
      this.email = userData.email;
      this.phone = userData.phone;
      this.limit = userData.limit;
      this.isAdmin = userData.isAdmin;
      this.blocked = userData.blocked;
    },
    clearUser() {
      this.user_id = null;
      this.user_name = null;
      this.email = null;
      this.phone = null;
      this.limit = 0;
      this.isAdmin = false;
      this.blocked = false;
    },
  },
  persist: {
    enabled: true,
  },
});
