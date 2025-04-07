<script setup>
import Header from "../../components/Header/Mobile.vue";

const props = defineProps({
  description: {
    type: String,
    required: true,
  },
  file_list: Array,
})

const emits = defineEmits(["handleInputDescription", "handleClickAddFile"]);

</script>

<template>
  <Header />
  <main class="flex flex-col mt-20">
    <div class="w-screen flex flex-wrap items-center justify-center gap-x-20 my-10">
      <span class="w-12 h-12 bg-[#D9D9D9] rounded-full"></span>
      <span class="w-12 h-12 bg-[#D9D9D9] rounded-full"></span>
      <span class="bg-[#93D07F] w-12 h-12 rounded-full"></span>
      <span class="w-12 h-12 bg-[#D9D9D9] rounded-full"></span>
    </div>
    <section class="my-25 flex flex-col justify-center items-center">
      <div v-for="file in props.file_list" class="border border-[#7A7A7A] w-[80%] pl-14 my-10 h-40 py-7 text-[#3EAE09] text-14 cursor-text">{{ file.filename }}</div>
      <button class="cursor-pointer my-20 mb-20 w-145 h-50 text-[#FFFFFF] text-18 bg-[#93D07F] rounded-lg hover:bg-[#3EAE09]" @click="e => emits('handleClickAddFile', e)">추가</button>
      <h2 class="mt-50 text-18 text-center text-[#3EAE09]">상세 설명</h2>
      <textarea class="preview-image border border-[#7A7A7A] outline-none w-[80%] min-h-250 p-10 flex justify-center items-center text-28" :value="props.description" @input="e => emits('handleInputDescription', e)"></textarea>
      <button class="cursor-pointer my-20 mb-20 w-145 h-50 text-[#FFFFFF] text-18 bg-[#93D07F] rounded-lg" @click="() => emits('handleClickSave')">등록하기</button>
    </section>
  </main>
</template>
<style></style>
