<script setup>
import { onMounted, reactive } from "vue";
import router from "../../router";
import { useAiModelStore } from "../../stores/model";
import { getModelList, getModelApplied, postApplyModel, postNewModel, postRemoveModel } from "../../api/ai";
import { postUpdateModelInfo, deleteModelInfo, postNewModelInfo, getModelIdWithItsName } from "../../api/model";
import AiModel from "../../components/AiModel/Desktop.vue";
import { useRoutingStore } from "../../stores/routing";
import Header from "../../components/Header/Desktop.vue";

const { setServiceType } = useRoutingStore();

const aiModelStore = useAiModelStore();

const isLoading = () => {
  return state.isLoading;
};

const state = reactive({
  current_model: "",
  model_list: [],
  current_attached_file_name: "",
  current_attached_file: null,
  isLoading: true,
});

/**
 * Direct to Main page
 */
const handleClickRestart = () => {
  setServiceType("");
  router.push("/");
};

/**
 * Apply model selected
 * @param {*} e
 */
const handleClickApplyModel = async (model_name) => {
  if (!model_name) {
    return;
  }
  if (model_name == state.current_model) {
    alert("이미 적용되어 있습니다.");
    return;
  }

  try {
    // loading effect
    state.isLoading = true;

    // AI service call
    const res = await postApplyModel(model_name);
    // console.log(res);

    // if succeeds, update DB info
    if (res.result) {
      await updateModelInfo(model_name);
      await reloadModelApplied();

      // loading effect
      state.isLoading = false;

      alert("모델이 변경되었습니다.");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Delete model selected
 * @param {*} e
 */
const handleClickDeleteModel = async (model_name) => {
  if (!model_name) {
    return;
  }
  if (model_name == state.current_model) {
    alert("현재 사용 중인 모델은 삭제할 수 없습니다. \r\n다른 모델로 변경 후 삭제해 주세요.");
    return;
  }

  const res = confirm(`선택하신 모델 ${model_name}을 삭제하시겠습니까?`);
  if (!res) return;

  try {
    // loading effect
    state.isLoading = true;

    // AI service call
    const res = await postRemoveModel(model_name);
    // console.log(res);

    // if succeeds, update DB info
    if (res.result) {
      await handleDeleteModelInfo(model_name);
      await reloadModelList();

      // loading effect
      state.isLoading = false;
      alert(model_name + " 모델이 삭제되었습니다.");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Delete model name in DB server
 * @param {string} model_name
 */
const handleDeleteModelInfo = async (model_name) => {
  try {
    console.log(`delete model: ${model_name}`);

    const id = await getModelIdWithItsName(model_name);
    if (id.data[0].id) {
      await deleteModelInfo(id.data[0].id);
    } else {
      console.log("No data found in DB");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Update the changes to DB server
 * @param {string} new_model
 */
const updateModelInfo = async (new_model) => {
  try {
    const old_id = await getModelIdWithItsName(state.current_model);
    if (old_id.data[0].id) {
      await postUpdateModelInfo(old_id.data[0].id, false);
    }

    const new_id = await getModelIdWithItsName(new_model);
    if (new_id.data[0].id) {
      await postUpdateModelInfo(new_id.data[0].id, true);
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Load the model list via AI service call
 */
const reloadModelList = async () => {
  try {
    const list = await getModelList();
    // console.log(list);
    state.model_list = list.model_list.sort();
    // aiModelStore.setAiModelList(list);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Load the model name which is currently applied via AI service call
 */
const reloadModelApplied = async () => {
  try {
    const current_model = await getModelApplied();
    if (current_model && current_model.current_applied_model_name) {
      // console.log(current_model);
      state.current_model = current_model.current_applied_model_name;
    } else {
      state.current_model = "";
    }
    // aiModelStore.setAiModelNameApplied(current_model);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Add new AI Model via AI service call
 */
const requestAddNewModel = async (model_name, model_file) => {
  try {
    // AI service call
    const res = await postNewModel(model_name, model_file);

    // if succeeds, update DB info
    if (res.result) {
      console.log("upload model file finished");
      const res2 = await postNewModelInfo({ name: model_name, isRun: false });
      await reloadModelList();

      alert(model_name + " 모델이 추가되었습니다.");
    }
  } catch (err) {
    console.log(err);
  }

  // loading effect
  state.isLoading = false;
};

/**
 * Add New Model button click event
 */
const handleClickAddNewModel = (e) => {
  const input = document.querySelector(".upload-input");
  input.click(e);
};

/**
 * File attached event handler
 * @param {e} e
 */
const handleChangeFileUpload = (e) => {
  if (!e.currentTarget.files[0]) return;

  const files = e.currentTarget.files;
  if (!files[0].name.endsWith(".pt")) {
    //.type.match(".pt")) {
    alert("Model 파일만 업로드 가능합니다.");
    return;
  }

  // block uploading the same file (filter by name)
  if (state.model_list.findIndex((model_name) => model_name === files[0].name) > -1) {
    alert("같은 이름의 모델이 이미 등록되어 있습니다.");
    return;
  }

  state.current_attached_file_name = files[0].name;
  state.current_attached_file = files[0];

  // loading effect
  state.isLoading = true;

  requestAddNewModel(files[0].name, files[0]);
};

onMounted(async () => {
  reloadModelList();
  reloadModelApplied();
  state.isLoading = false;
});
</script>

<template>
  <Header />
  <main class="flex flex-col items-center justify-center">
    <div
      v-show="isLoading()"
      class="flex my-[200px] items-center justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#93D07F] border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
    </div>

    <div v-show="isLoading() === false" class="flex items-center">
      <div class="flex-col mx-[100px] mt-[20px]">
        <div class="flex flex-row mt-[50px] gap-x-[20px]">
          <span class="w-[10px] h-[10px] bg-[#93D07F] rounded-full self-center"></span>
          <h2 class="text-[29px] text-[#3EAE09]">현재 서비스 중인 모델</h2>
        </div>
        <section class="my-[40px] flex flex-col justify-center items-center">
          <div class="w-[1100px] h-[80px] flex flex-row justify-center items-center">
            <div v-if="state.current_model" class="bg-[#93D07F] w-full h-[60px] py-[5px] text-[30px] text-[#FFFFFF] text-center cursor-pointer">{{ state.current_model }}</div>
            <div v-if="!state.current_model" class="w-full h-[60px] py-[5px] text-[30px] text-[#F52E02] text-start ml-[30px]"><span>⚠️ 모델 설정 필요.</span> <span>아래 목록에서 선택하여 '적용' 버튼을 눌러주세요.</span></div>
          </div>
        </section>
        <div class="flex flex-row mt-[50px] gap-x-[20px]">
          <span class="w-[10px] h-[10px] bg-[#93D07F] rounded-full self-center"></span>
          <h2 class="text-[29px] text-[#3EAE09]">전체 모델 목록</h2>
        </div>
        <section class="my-[40px] flex flex-col justify-center items-center">
          <div class="w-[1100px] h-[410px] flex flex-col gap-y-[10px] items-center text-[30px] text-[#AFAEAE] overflow-y-scroll">
            <!-- list -->
            <AiModel v-for="(model, index) in state.model_list" :model_name="model" @apply-model="handleClickApplyModel" @delete-model="handleClickDeleteModel" />
            <!-- Add new model -->
            <input name="image" type="file" class="upload-input hidden my-[20px]" accept=".pt" @change="handleChangeFileUpload" />
          </div>
          <div class="w-full h-[80px] flex flex-row justify-center items-center mt-[10px]">
            <div class="bg-[#7896FF] w-full h-[60px] py-[5px] text-[30px] text-[#FFFFFF] text-center cursor-pointer hover:bg-[#567BFF]" @click="handleClickAddNewModel">신규 모델 추가하기</div>
          </div>

          <div class="my-[15px]">
            <button class="cursor-pointer my-[20px] mb-[20px] w-[185px] h-[80px] text-[#FFFFFF] text-[30px] bg-[#93D07F] rounded-lg disabled:bg-[#DCDCDC] hover:bg-[#3EAE09]" @click="handleClickRestart">처음으로</button>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
<style></style>
