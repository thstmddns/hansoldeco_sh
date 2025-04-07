<script setup>
import Header from "../../components/Header/Desktop.vue";

const props = defineProps({
  isCapture: {
    type: Boolean,
    required: true,
  },
});

</script>

<template>
  <Header />
  <main class="min-w-1000 flex flex-col items-center justify-center mt-20">
    <div class="flex flex-wrap items-center justify-center gap-x-200 my-60">
      <span class="bg-[#93D07F] w-16 h-16 rounded-full"></span>
      <span class="w-16 h-16 bg-[#D9D9D9] rounded-full"></span>
      <span class="w-16 h-16 bg-[#D9D9D9] rounded-full"></span>
      <span class="w-16 h-16 bg-[#D9D9D9] rounded-full"></span>
    </div>
    <h2 class="mt-50 text-29 text-[#3EAE09]">QR 코드를 인식해주세요.</h2>
    <section class="my-40 flex flex-col justify-center items-center">
      <video id="qr-video" width="400" height="300" autoplay class="mb-100"></video>
    </section>
  </main>
</template>
<style></style>
