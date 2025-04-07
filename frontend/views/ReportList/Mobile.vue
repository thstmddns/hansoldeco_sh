<script setup>
import Header from "../../components/Header/Mobile.vue";

const props = defineProps({
  reportList: {
    type: Array,
    required: true,
  },
  showReportImageIndex: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["handleClickDownLoadDefectList", "handleClickAddReport", "handleClickedReport", "handleClickImage"]);

</script>

<template>
  <Header />
  <main class="w-full flex flex-col items-center justify-center gap-24 pt-40">
    <div class="w-full flex justify-end gap-10">
      <button  type="button" class="p-10 text-white bg-[#93D07F] rounded-md" @click="emits('handleClickDownLoadDefectList')">하자 다운로드</button>
      <button  type="button" class="p-10 text-white bg-[#93D07F] rounded-md" @click="emits('handleClickAddReport')">보고서 추가</button>
    </div>
    <div v-for="(report, index) in props.reportList" class="w-360 min-w-360 flex flex-col cursor-pointer">
        <div class="flex justify-between border-b border-[#3EAE09] text-[#3EAE09] mb-10" @click="emits('handleClickedReport', index, report.attributes.defects.data.length)">
          <span class="min-w-84">{{ new Date(report.attributes.createdAt).toLocaleDateString() }}</span>
          <span class="max-w-180 text-ellipsis overflow-hidden whitespace-nowrap">{{ report.attributes.description }}</span>
          <span class="min-w-68">하자 수 {{ report.attributes.defects.data.length || 0 }}</span>
        </div>
        <div v-if="props.showReportImageIndex[index]" class="flex gap-20">
          <img v-for="defect in report.attributes.defects.data" :src="defect.attributes.bounding_box_image_url" alt="report image" class="w-100 h-100" @click="emits('handleClickImage', defect.id, defect.attributes.file_name, defect.attributes.origin_image_url, defect.attributes.bounding_box_image_url, defect.attributes.bounding_box_json)" />
        </div>
    </div>
    <div v-if="props.reportList.length === 0" class="text-30 mt-40">하자가 없습니다.</div>
  </main>
</template>
<style></style>
