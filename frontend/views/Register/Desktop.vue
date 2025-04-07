<script setup>
import Header from "../../components/Header/Desktop.vue";

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
  <main class="min-w-1000 flex flex-col items-center justify-center mt-20">
    <div class="flex flex-wrap items-center justify-center gap-x-200 my-60">
      <span class="w-16 h-16 bg-[#D9D9D9] rounded-full"></span>
      <span class="w-16 h-16 bg-[#D9D9D9] rounded-full"></span>
      <span class="bg-[#93D07F] w-16 h-16 rounded-full"></span>
      <span class="w-16 h-16 bg-[#D9D9D9] rounded-full"></span>
    </div>
    <section class="my-40 flex flex-col justify-center items-center">
      <input name="image" type="file" class="upload-input hidden my-20" accept="image/*" @change="e => emits('handleChangeFileUpload', e)" />
      <div class="flex flex-col mb-20 items-center gap-10">
        <div v-for="file in props.file_list" class="border border-[#7A7A7A] w-764 h-40 py-7 pl-10 text-[#3EAE09] cursor-text">{{ file.filename }}</div>
        <button class="ml-auto w-240 h-45 bg-[#93D07F] text-[#FFFFFF] text-22 cursor-pointer hover:bg-[#3EAE09]" @click="e => emits('handleClickAddFile', e)">추가</button>
      </div>
      <h2 class="mt-50 text-30 text-left w-full text-[#3EAE09]">상세 설명</h2>
      <textarea class="preview-image border border-[#7A7A7A] outline-none w-1024 h-510 p-10 flex justify-center items-center text-30" :value="props.description" @input="e => emits('handleInputDescription', e)" />
      <button class="cursor-pointer my-20 mb-20 w-185 h-80 text-[#FFFFFF] text-30 bg-[#7896FF] rounded-lg disabled:bg-[#DCDCDC] hover:bg-[#567BFF]" @click="() => emits('handleClickSave')">저장</button>
    </section>
  </main>
</template>
<style></style>
