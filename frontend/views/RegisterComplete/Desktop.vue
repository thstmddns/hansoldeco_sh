<script setup>
import Header from "../../components/Header/Desktop.vue";

const emits = defineEmits(["handleClickHome", "handleClickReportList"]);

</script>
<template>
  <Header />
  <main class="min-w-1000 flex flex-col items-center justify-center mt-20">
    <div class="flex flex-wrap items-center justify-center gap-x-200 my-60">
      <span class="w-16 h-16 bg-[#D9D9D9] rounded-full"></span>
      <span class="w-16 h-16 bg-[#D9D9D9] rounded-full"></span>
      <span class="w-16 h-16 bg-[#D9D9D9] rounded-full"></span>
      <span class="bg-[#93D07F] w-16 h-16 rounded-full"></span>
    </div>
    <h2 class="mt-50 text-29 text-[#3EAE09] mb-60">저장이 완료 되었습니다.</h2>
    <div class="flex gap-20">
      <button class="w-240 h-45 bg-[#93D07F] text-[#FFFFFF] text-22 cursor-pointer hover:bg-[#3EAE09]" @click="emits('handleClickHome')">홈 화면</button>
      <button class="w-240 h-45 bg-[#93D07F] text-[#FFFFFF] text-22 cursor-pointer hover:bg-[#3EAE09]" @click="emits('handleClickReportList')">하자 현황</button>
    </div>
  </main>
</template>
<style></style>
