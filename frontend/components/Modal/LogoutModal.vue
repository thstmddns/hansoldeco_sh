<script setup>
import { storeToRefs } from "pinia";
import { useModalStore } from "../../stores/modal";
import { useUserStore } from "../../stores/user";

const router = useRouter();

const modalStore = useModalStore();
const userStore = useUserStore();

const { isShowLogoutModal } = storeToRefs(modalStore);

const { setLogoutModal } = useModalStore();

const clickModalOutside = (e) => {
  if (e.target.classList.contains("modal_wrapper")) setLogoutModal(false);
};

const handleClickClose = () => {
  setLogoutModal(false);
};

const handleClickCancel = () => {
  setLogoutModal(false);
};

const handleClickConfirmLogout = () => {
  localStorage.removeItem("jt");
  localStorage.removeItem("user_id");
  userStore.clearUser();
  setLogoutModal(false);
  router.push("/");
};
</script>
<template>
  <div v-if="isShowLogoutModal" class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center w-full h-full m-auto modal_wrapper z-[9999]">
    <div class="fixed flex flex-col items-center left-0 top-0 right-0 bottom-0 m-auto px-10 w-496 h-330 bg-[#fff] shadow shadow-[rgba(0,0,0,0.25)] flex flex-col justify-center rounded-xl relative">
      <img src="/assets/cross.png" alt="cross" class="w-20 h-20 absolute right-10 top-10 cursor-pointer" @click="handleClickClose()" />
      <div class="w-348 flex flex-col">
        <h1 class="text-32 text-[#707799] text-center font-bold mb-46">로그아웃 하시겠습니까?</h1>
        <div class="flex justify-between w-full">
          <button class="w-142 h-52 bg-[#93D07F] text-22 text-[#FFFFFF] rounded-lg items-end ml-10" @click="handleClickCancel">취소</button>
          <button class="w-142 h-52 bg-[#93D07F] text-22 text-[#FFFFFF] rounded-lg mr-10" @click="handleClickConfirmLogout">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
input::placeholder {
  color: #c5c5c5;
}
</style>
