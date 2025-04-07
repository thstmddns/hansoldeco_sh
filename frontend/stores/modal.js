import { defineStore } from "pinia";

export const useModalStore = defineStore({
  id: "modal",
  state: () => ({
    isShowLoadingModal: false,
    isShowLoginModal: false,
    isShowSignUpModal: false,
    isShowLogoutModal: false,
    isShowImageViewModal: false,
    isShowImageEditModal: false,
    isShowDeleteQrModal: false,
    imageViewSource: "https://dfinite.s3.ap-northeast-2.amazonaws.com/sosohaja/MicrosoftTeams-image+(9)-c2554156e0fed0ae24c10511610ea3249961632ee2ba1cb5e28970b954566b7d.png",
    imageEditSource: {
      id: -1,
      file_name: "",
      origin_image_url: "https://dfinite.s3.ap-northeast-2.amazonaws.com/sosohaja/MicrosoftTeams-image+(9)-c2554156e0fed0ae24c10511610ea3249961632ee2ba1cb5e28970b954566b7d.png",
      bounding_box_image_url: "https://dfinite.s3.ap-northeast-2.amazonaws.com/sosohaja/MicrosoftTeams-image+(9)-c2554156e0fed0ae24c10511610ea3249961632ee2ba1cb5e28970b954566b7d.png",
      bounding_box_json: null
    },
    callbackDeleteQr: null
  }),
  getters: {
    getLoadingModal() {
      return this.isShowLoadingModal;
    },
    getLoginModal() {
      return this.isShowLoginModal;
    },
    getSignUpModal() {
      return this.isShowSignUpModal;
    },
    getLogoutModal() {
      return this.isShowLogoutModal;
    },
    getImageViewModal() {
      return this.isShowImageViewModal;
    },
    getImageEditModal() {
      return this.isShowImageEditModal;
    },
    getDeleteQrModal() {
      return this.isShowDeleteQrModal;
    },
    getImageViewSource() {
      return this.imageViewSource;
    },
    getImageEditSource() {
      return this.imageEditSource;
    },
    getCallbackDeleteQr() {
      return this.callbackDeleteQr;
    }
  },
  actions: {
    setLoadingModal(isShow) {
      this.isShowLoadingModal = isShow;
    },
    setLoginModal(isShow) {
      this.isShowLoginModal = isShow;
    },
    setSignUpModal(isShow) {
      this.isShowSignUpModal = isShow;
    },
    setLogoutModal(isShow) {
      this.isShowLogoutModal = isShow;
    },
    toggleLoginModal() {
      this.isShowLoginModal = !this.isShowLoginModal;
    },
    toggleSignUpModal() {
      this.isShowSignUpModal = !this.isShowSignUpModal;
    },
    toggleLogoutModal() {
      this.isShowLogoutModal = !this.isShowLogoutModal;
    },
    setImageViewModal(isShow) {
      this.isShowImageViewModal = isShow;
    },
    setImageEditModal(isShow) {
      this.isShowImageEditModal = isShow;
    },
    setDeleteQrModal(isShow) {
      this.isShowDeleteQrModal = isShow;
    },
    setImageViewSource(source) {
      this.imageViewSource = source;
    },
    setImageEditSource(source) {
      this.imageEditSource = source;
    },
    setCallbackDeleteQr(callback) {
      this.callbackDeleteQr = callback;
    }
  },
});
