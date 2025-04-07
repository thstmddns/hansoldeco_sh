<script setup>
import Header from "../../components/Header/Mobile.vue";

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
  locationUrl: {
    type: String,
    default: '',
  },
  qrCode: {
    type: String,
    default: null,
  },
  isQRSaved: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['handleInputTitle', 'handleClickCreateQR', 'handleClickSaveQR', 'handleClickBack']);

</script>

<template>
  <Header />
  <main class="flex flex-col items-center justify-center">
    <ul class="mt-50 mb-20 flex flex-col gap-18">
      <li class="flex items-center">
        <span class="w-80 text-20 text-[#3EAE09] mr-10">제목</span>
        <input type="text" class="pl-10 w-190 h-50 border-2 border-solid border-[#93D07F] outline-none" placeholder="제목" @input="e => emits('handleInputTitle', e)" />
      </li>
      <li class="flex items-center">
        <span class="w-80 text-20 text-[#3EAE09] mr-10">현 위치</span>
        <span v-if="props.latitude & props.longitude" class="">{{ props.latitude }}, {{ props.longitude }}</span>
        <span v-if="!props.latitude & !props.longitude" class="">위치 정보를 가져올 수 없습니다.</span>
      </li>
    </ul>
    <button class="w-240 h-45 bg-[#3EAE09] text-[#FFFFFF] text-22 cursor-pointer" @click="emits('handleClickCreateQR')">QR 코드 생성</button>
    <img v-if="props.qrCode" :src="props.qrCode" alt="QR Code" />
    <button v-if="props.qrCode && !props.isQRSaved" class="w-240 h-45 bg-[#3EAE09] text-[#FFFFFF] text-22 cursor-pointer" @click="emits('handleClickSaveQR')">저장</button>
    <span v-if="props.isQRSaved" class="text-22">QR 코드가 저장되었습니다.</span>
    <button v-if="props.isQRSaved" class="w-240 h-45 bg-[#3EAE09] text-[#FFFFFF] text-22 cursor-pointer" @click="emits('handleClickBack')">뒤로</button>
  </main>
</template>
<style></style>
