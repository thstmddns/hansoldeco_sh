<script setup>
import { storeToRefs } from "pinia";
import { useModalStore } from "../../stores/modal";

const modalStore = useModalStore();

const { isShowDeleteQrModal, callbackDeleteQr } = storeToRefs(modalStore);

const { setDeleteQrModal } = useModalStore();

const handleClickOutside = (e) => {
  if (e.target.classList.contains("modal_wrapper")) setDeleteQrModal(false);
};

const handleClickClose = () => {
  setDeleteQrModal(false);
};

const handleClickCancel = () => {
  setDeleteQrModal(false);
};

const handleClickDeleteQr = async () => {
    callbackDeleteQr.value();
    setDeleteQrModal(false);
};
</script>
<template>
  <div v-if="isShowDeleteQrModal" class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center w-full h-full m-auto modal_wrapper z-[9999]" @click="handleClickOutside">
    <div :class="{'w-496': $device.isDesktop, 'w-[calc(100%-20px)]': $device.isMobile}" class="fixed flex flex-col items-center left-0 top-0 right-0 bottom-0 m-auto px-10 w-496 h-330 bg-[#fff] shadow shadow-[rgba(0,0,0,0.25)] justify-center rounded-xl">
      <img src="/assets/cross.png" alt="cross" class="w-20 h-20 absolute right-10 top-10 cursor-pointer" @click="handleClickClose()" />
      <div class="w-348 flex flex-col">
        <h1 class="text-32 text-[#707799] text-center font-bold mb-46">정말 삭제하시겠습니까?</h1>
        <div class="flex justify-between w-full">
          <button class="w-142 h-52 bg-[#93D07F] text-22 text-[#FFFFFF] rounded-lg items-end ml-10" @click="handleClickCancel">취소</button>
          <button class="w-142 h-52 bg-[#93D07F] text-22 text-[#FFFFFF] rounded-lg mr-10" @click="handleClickDeleteQr">확인</button>
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
