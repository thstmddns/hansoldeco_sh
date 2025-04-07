<script setup>
import { storeToRefs } from "pinia";
import { useModalStore } from "../../stores/modal";

const modalStore = useModalStore();

const { isShowImageViewModal, imageViewSource } = storeToRefs(modalStore);

const { setImageViewModal } = useModalStore();

const handleClickModalOutside = (e) => {
  if (e.target.classList.contains("modal_wrapper")) setImageViewModal(false);
};

const handleClickImage = () => {
  setImageViewModal(false);
};

</script>
<template>
    <div v-if="isShowImageViewModal" class="modal_wrapper bg-black/50 z-9999 fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center w-full h-full m-auto" @click="e => handleClickModalOutside(e)">
        <img :src="imageViewSource" alt="loading" class="" @click="handleClickImage" />
    </div>
</template>
<style>
input::placeholder {
  color: #c5c5c5;
}
</style>
