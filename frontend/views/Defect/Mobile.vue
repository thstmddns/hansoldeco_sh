<script setup>
import { ref } from "vue";
import Header from "../../components/Header/Mobile.vue";

const props = defineProps({
  introduction_message: Object,
  current_status: String,
  current_attached_file_name: String,
  current_attached_file: Object,
  imageData: Object,
})

const emits = defineEmits(["handleClickUpload", "handleChangeFileUpload", "handleClickCapturePhoto", "handleClickStopCapture", "handleClickExecute"]);

const canvas = ref(null);
const video = ref(null);


defineExpose({
  canvas,
  video
})

</script>

<template>
  <Header />
  <main class="flex flex-col w-full mt-20">
    <div class="w-screen flex flex-wrap items-center justify-center gap-x-20 my-10">
      <span class="w-12 h-12 bg-[#D9D9D9] rounded-full"></span>
      <span class="bg-[#93D07F] w-12 h-12 rounded-full"></span>
      <span class="w-12 h-12 bg-[#D9D9D9] rounded-full"></span>
      <span class="w-12 h-12 bg-[#D9D9D9] rounded-full"></span>
    </div>
    <h2 class="mt-50 text-18 text-center text-[#3EAE09]">{{ props.introduction_message[props.current_status] }}</h2>
    <section class="my-25 flex flex-col justify-center items-center">
      <input name="image" type="file" class="upload-input hidden my-20" accept="image/*" @change="e => emits('handleChangeFileUpload', e)" />
      <div class="flex flex-row items-center justify-center w-full gap-x-10 px-5">
        <button class="w-[50%] h-45 bg-[#93D07F] text-[#FFFFFF] text-18 cursor-pointer hover:bg-[#3EAE09]" @click="e => emits('handleClickUpload', e)">사진 올리기</button>
        <button class="w-[30%] h-45 bg-[#93D07F] text-[#FFFFFF] text-18 cursor-pointer hover:bg-[#3EAE09]" @click="e => emits('handleClickCapturePhoto', e)">사진 촬영</button>
      </div>
      <!-- file name -->
      <div class="border border-[#7A7A7A] w-[80%] pl-14 my-10 h-40 py-7 text-[#3EAE09] text-14 cursor-text">{{ props.current_attached_file_name ? props.current_attached_file_name : "image file name" }}</div>
      
      <!-- preview -->
      <div class="preview-image border border-[#7A7A7A] w-[80%] min-h-500 flex justify-center items-center text-28 text-[#AFAEAE]">
        <video ref="video" class="hidden" autoplay></video>
        <canvas ref="canvas" :class="{'hidden': props.current_status === 'no_file_attached'}"></canvas>
        <span v-if="props.current_status === 'no_file_attached'">No Image</span>
      </div>
      <button
        v-if="props.current_status !== 'file_attached'"
        :disabled="props.current_status != 'capturing_photo'"
        class="cursor-pointer my-20 mb-20 w-145 h-50 text-[#FFFFFF] text-18 bg-[#7896FF] rounded-lg disabled:bg-[#DCDCDC] hover:bg-[#567BFF]"
        @click="(e) => emits('handleClickStopCapture', e)"
      >
        캡쳐
      </button>
      <button
        v-if="props.current_status === 'file_attached'"
        class="cursor-pointer my-20 mb-20 w-145 h-50 text-[#FFFFFF] text-18 bg-[#7896FF] rounded-lg disabled:bg-[#DCDCDC] hover:bg-[#567BFF]"
        @click="(e) => emits('handleClickExecute', e)"
      >
        등록하기
      </button>
    </section>
  </main>
</template>
<style></style>
