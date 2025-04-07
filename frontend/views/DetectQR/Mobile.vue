<script setup>
import Header from "../../components/Header/Mobile.vue";

const props = defineProps({
  isCapture: {
    type: Boolean,
    required: true,
  },
});

</script>

<template>
  <Header />
  <main class="flex flex-col items-center justify-center w-full mt-20">
    <div class="w-screen flex flex-wrap items-center justify-center gap-x-20 my-10">
      <span class="bg-[#93D07F] w-12 h-12 rounded-full"></span>
      <span class="w-12 h-12 bg-[#D9D9D9] rounded-full"></span>
      <span class="w-12 h-12 bg-[#D9D9D9] rounded-full"></span>
      <span class="w-12 h-12 bg-[#D9D9D9] rounded-full"></span>
    </div>
    <h2 class="mt-50 text-18 text-center text-[#3EAE09]">QR 코드를 인식해주세요.</h2>
    <section class="my-25 flex flex-col justify-center items-center">
      <video id="qr-video" width="400" height="300" autoplay></video>
      <!-- <button v-if="!state.isCapture" class="ml-20 w-240 h-45 bg-[#93D07F] text-[#FFFFFF] text-22 cursor-pointer hover:bg-[#3EAE09]" @click="handleClickQRCapture">QR 코드 촬영</button> -->
    </section>
  </main>
</template>
<style></style>
