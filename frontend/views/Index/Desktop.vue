<script setup>
import { storeToRefs } from "pinia";
import Header from "../../components/Header/Desktop.vue";
import { useUserStore } from "../../stores/user";

const userStore = useUserStore();

const { user_id, email, isAdmin } = storeToRefs(userStore);

const handleClickModel = () => {
  if (isAdmin.value) {
    router.push("/admin/model");
  } else {
    alert("관리자만 접근 가능합니다.");
  }
};

</script>
<template>
  <Header />
  <main class="w-full min-w-1280 px-200 pt-72">
    <NuxtLink to="/" class="mx-auto" ><img src="/assets/logo.svg" alt="logo" class="w-315 h-98 mx-auto" /></NuxtLink>
    <ul class="gap-30 mt-60 grid grid-cols-2 min-w-650 min-h-380 max-w-1300 max-h-720 mb-55 mx-auto">
      <NuxtLink to="/qr">
        <li class="bg-[#93D07F] cursor-pointer hover:drop-shadow-xl text-[#FFFFFF] text-30 p-60">
          <div class="flex items-center mb-30">
            <img src="/assets/index_location.png" alt="logo" class="w-22 h-22 mr-17" />
            <h4 class="text-28">QR 생성</h4>
          </div>
          <p class="text-18 pl-12">건물의 위치에 따라 프로젝트를<br />생성하여 하자를 관리합니다.</p>
        </li>
      </NuxtLink>
      <NuxtLink to="/detectqr">
        <li class="bg-[#93D07F] cursor-pointer hover:drop-shadow-xl text-[#FFFFFF] text-30 p-60">
          <div class="flex items-center mb-30">
            <img src="/assets/index_search.png" alt="logo" class="w-22 h-22 mr-17" />
            <h4 class="text-28">하자 검사</h4>
          </div>
          <p class="text-18 pl-12">사진 및 동영상을 촬영 또는<br/>업로드 하여 하자를 검사 합니다</p>
        </li>
      </NuxtLink>
      <NuxtLink to="/qrlist">
        <li class="bg-[#93D07F] cursor-pointer hover:drop-shadow-xl text-[#FFFFFF] text-30 p-60">
          <div class="flex items-center mb-30">
            <img src="/assets/index_note.png" alt="logo" class="w-22 h-22 mr-17" />
            <h4 class="text-28">하자 현황</h4>
          </div>
          <p class="text-18 pl-12">하자 현황을 살펴보고 각 결과를<br />편집하며 보고서를 출력합니다.</p>
        </li>
      </NuxtLink>
      <!-- <NuxtLink to="/admin/model"> -->
        <li class="bg-[#93D07F] cursor-pointer hover:drop-shadow-xl text-[#FFFFFF] text-30 p-60" @click="handleClickModel">
          <div class="flex items-center mb-30">
            <img src="/assets/index_setting.png" alt="logo" class="w-22 h-22 mr-17" />
            <h4 class="text-28">모델 관리</h4>
          </div>
          <p class="text-18 pl-12">하자 검사 AI 모델을 관리하는<br />관리자용 페이지입니다.</p>
        </li>
      <!-- </NuxtLink> -->
    </ul>
    <img src="/assets/kukto.png" alt="logo" class="w-297 h-73 mx-auto" />
  </main>
</template>
