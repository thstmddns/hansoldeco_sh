<script setup>
import Header from "../../components/Header/Mobile.vue";

const emits = defineEmits(["handleClickHome", "handleClickReportList"]);

</script>

<template>
  <Header />
  <main class="flex flex-col items-center mt-20">
    <div class="w-screen flex flex-wrap items-center justify-center gap-x-20 my-10">
      <span class="w-12 h-12 bg-[#D9D9D9] rounded-full"></span>
      <span class="w-12 h-12 bg-[#D9D9D9] rounded-full"></span>
      <span class="w-12 h-12 bg-[#D9D9D9] rounded-full"></span>
      <span class="bg-[#93D07F] w-12 h-12 rounded-full"></span>
    </div>
    <h2 class="mt-50 text-18 text-center text-[#3EAE09] mb-60">저장이 완료 되었습니다.</h2>
    <div class="flex gap-20">
      <button class="w-120 h-45 bg-[#3EAE09] text-[#FFFFFF] text-16 cursor-pointer" @click="emits('handleClickHome')">홈화면</button>
      <button class="w-120 h-45 bg-[#3EAE09] text-[#FFFFFF] text-16 cursor-pointer" @click="emits('handleClickReportList')">하자 현황</button>
    </div>
  </main>
</template>
<style></style>
