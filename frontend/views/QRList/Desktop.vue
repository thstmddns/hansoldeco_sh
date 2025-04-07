<script setup>
import Header from "../../components/Header/Desktop.vue";

const props = defineProps({
  qrList: {
    type: Array,
    required: true,
  },
  hoverdIndex: {
    type: Number,
    required: true,
  },
});

const emits = defineEmits(["handleClickDownLoadCSV", "getTitleFromURL", "handleHoverUser", "handleLeaveUser", "handleClickQR", "handleClickDeleteQR"]);

const getTitleFromURL = (url) => {
  const decodedUrl = decodeURI(url);

  if (!decodedUrl.includes('title=')) {
    return '지역명 없음';
  }
  
  // get title from url
  return decodedUrl.split('title=')[1].split('&')[0];
}

</script>

<template>
  <Header />
  <main class="min-w-1000 w-full flex flex-col justify-center py-40 px-100">
    <button  type="button" class="ml-auto p-10 text-white bg-[#93D07F] rounded-md" @click="emits('handleClickDownLoadCSV')">csv 다운로드</button>
    <div class="max-w-1380 flex flex-wrap items-center mx-auto gap-60">
      <div v-for="(qr, index) in props.qrList" class="w-300 min-w-300 h-240 flex flex-col py-15 px-20 border cursor-pointer relative" @click="emits('handleClickQR', qr.id)">
          <img src="/assets/cross.png" class="absolute top-20 right-20 w-12 h-12" @click="e => emits('handleClickDeleteQR', e, qr.id)" />
          <span class="mb-10">{{ new Date(qr.attributes.createdAt).toLocaleDateString() }}</span>
          <h4 classs="mb-20">{{ getTitleFromURL(qr.attributes.location_url)}}</h4>
          <div class="w-full flex gap-20">
            <img :src="qr.attributes.code_image" alt="qr" class="w-120 h-120 border" />
            <ul class="w-108 flex flex-col gap-24">
              <li class="w-full flex justify-between relative" @mouseover="emits('handleHoverUser', index)" @mouseleave="emits('handleLeaveUser')">
                <span class="min-w-44">생성자</span>
                <span class="max-w-70 overflow-hidden">{{ qr.attributes.creator.data?.attributes.email.split('@')[0] ?? ''}}</span>
                <span v-if="props.hoverdIndex === index" class="absolute text-[#777777] top-[-20px]">{{ qr.attributes.creator.data?.attributes.email ?? ''}}</span>
              </li>
              <li class="w-full flex justify-between">
                <span>하자수</span>
                <span>{{ qr.attributes.defects.data.length }}</span>
              </li>
            </ul>
          </div>
      </div>
    </div>
  </main>
</template>
<style></style>
