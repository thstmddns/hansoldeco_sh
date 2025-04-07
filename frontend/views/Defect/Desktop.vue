<script setup>
import Header from "../../components/Header/Desktop.vue";

const props = defineProps({
  current_attached_file_name: String,
  current_attached_file: Object,
  imageData: Object,
})
const emits = defineEmits(["handleClickUpload", "handleChangeFileUpload", "handleClickExecute"]);

const canvas = ref(null);

defineExpose({
  canvas
})
</script>


<template>
  <Header />
  <main class="min-w-[1000px] w-full flex flex-col items-center justify-center pt-20">
    <div class="flex flex-wrap items-center justify-center gap-x-200 my-60">
      <span class="w-16 h-16 bg-[#D9D9D9] rounded-full"></span>
      <span class="bg-[#93D07F] w-16 h-16 rounded-full"></span>
      <span class="w-16 h-16 bg-[#D9D9D9] rounded-full"></span>
      <span class="w-16 h-16 bg-[#D9D9D9] rounded-full"></span>
    </div>
    <h2 class="mt-50 text-29 text-[#3EAE09]">벽지사진을 올려 주세요</h2>
    <section class="my-40 w-full flex flex-col justify-center items-center">
      <input name="image" type="file" class="upload-input hidden my-20" accept="image/*" @change="e => emits('handleChangeFileUpload', e)" />
      <div class="flex flex-row mb-20 items-center">
        <div class="border border-[#7A7A7A] w-764 h-40 py-7 pl-10 text-[#3EAE09] cursor-text">{{ props.current_attached_file_name }}</div>
        <button class="ml-20 w-240 h-45 bg-[#93D07F] text-[#FFFFFF] text-22 cursor-pointer hover:bg-[#3EAE09]" @click="e => emits('handleClickUpload', e)">사진 올리기</button>
      </div>
      <div class="preview-image border border-[#7A7A7A] w-1024 h-510 flex justify-center items-center text-30 text-[#AFAEAE]">
        <canvas ref="canvas" width="0" />
        <span v-if="!props.imageData">No Image</span>
      </div>
      <button
        :disabled="!props.current_attached_file_name"
        class="cursor-pointer my-20 mb-20 w-185 h-80 text-[#FFFFFF] text-30 bg-[#7896FF] rounded-lg disabled:bg-[#DCDCDC] hover:bg-[#567BFF]"
        @click="() => emits('handleClickExecute')"
      >
        등록하기
      </button>
    </section>
  </main>
</template>
<style></style>
