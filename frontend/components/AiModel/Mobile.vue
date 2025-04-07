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

const getScreenWidth = () => {
  return screen.width;
};

onMounted(async () => {});
</script>

<template>
  <div class="w-full h-[50px] flex flex-row gap-x-[5px] justify-center items-center">
    <div
      :class="{ 'text-[12px]': props.model_name.length > 19 && getScreenWidth() <= 280, 'text-[10px]': props.model_name.length > 25 && getScreenWidth() <= 280 }"
      class="bg-[#FFFFFF] w-5/6 text-[#3EAE09] h-[40px] py-[5px] text-[16px] text-center cursor-default border border-[#93D07F]"
    >
      {{ props.model_name }}
    </div>
    <div class="bg-[#7896FF] w-1/6 text-[#FFFFFF] h-[40px] py-[6px] text-[16px] text-center cursor-pointer hover:bg-[#567BFF]" @click="handleClickApplyButton">V</div>
    <div class="bg-[#FF9900] w-1/6 text-[#FFFFFF] h-[40px] py-[6px] text-[16px] text-center cursor-pointer hover:bg-[#FF8A00]" @click="handleClickDeleteButton">X</div>
  </div>
</template>

<style></style>
