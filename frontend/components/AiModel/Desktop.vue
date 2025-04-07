<script setup>
import { onMounted, defineEmits } from "vue";
import { storeToRefs } from "pinia";
import { useAiModelStore } from "../../stores/model";

const props = defineProps({
  model_name: {
    type: String,
    default: "",
    require: true,
  },
});

const emit = defineEmits(["apply-model", "delete-model"]);
const applyModel = (model_name) => {
  emit("apply-model", model_name);
};
const deleteModel = (model_name) => {
  emit("delete-model", model_name);
};

/**
 * Apply the AI Model via AI service call
 */
const handleClickApplyButton = () => {
  applyModel(`${props.model_name}`);
};

/**
 * Delete the AI Model via AI service call
 */
const handleClickDeleteButton = () => {
  deleteModel(props.model_name);
};

onMounted(async () => {});
</script>

<template>
  <div class="w-full h-[80px] flex flex-row gap-x-[30px] justify-center items-center">
    <div class="bg-[#FFFFFF] w-5/6 text-[#3EAE09] h-[60px] py-[5px] text-[30px] text-center cursor-default border border-[#93D07F]">{{ props.model_name }}</div>
    <div class="bg-[#7896FF] w-1/6 text-[#FFFFFF] h-[60px] py-[8px] text-[26px] text-center cursor-pointer hover:bg-[#567BFF]" @click="handleClickApplyButton">적용</div>
    <div class="bg-[#FF9900] w-1/6 text-[#FFFFFF] h-[60px] py-[8px] text-[26px] text-center cursor-pointer hover:bg-[#FF8A00]" @click="handleClickDeleteButton">삭제</div>
  </div>
</template>

<style></style>
