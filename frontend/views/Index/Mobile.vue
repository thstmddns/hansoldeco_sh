<script setup>
import { storeToRefs } from "pinia";
import { defineEmits } from "vue";
import Header from "../../components/Header/Mobile.vue"
import { useUserStore } from "../../stores/user";

const userStore = useUserStore();

const { user_id, email, isAdmin } = storeToRefs(userStore);

</script>
<template>
  <Header />
  <main class="w-full py-20">
    <img src="/assets/logo.svg" alt="logo" class="w-200 h-70 m-auto" />
    <ul class="gap-20 mt-60 flex flex-col items-center justify-center w-full px-40 mb-30">
      <NuxtLink to="/qr">
        <li class="min-w-310 min-h-120 bg-[#93D07F] cursor-pointer hover:drop-shadow-xl text-[#FFFFFF] text-30 p-18">
          <div class="flex items-center mb-12">
            <img src="/assets/index_location.png" alt="logo" class="w-22 h-22 mr-17" />
            <h4 class="text-24">QR 생성</h4>
          </div>
          <p class="text-18 pl-10">건물의 위치에 따라 프로젝트를<br />생성하여 하자를 관리합니다.</p>
        </li>
      </NuxtLink>
      <NuxtLink to="/detectqr">
        <li class="min-w-310 min-h-120 bg-[#93D07F] cursor-pointer hover:drop-shadow-xl text-[#FFFFFF] text-30 p-18">
          <div class="flex items-center mb-12">
            <img src="/assets/index_search.png" alt="logo" class="w-22 h-22 mr-17" />
            <h4 class="text-24">하자 검사</h4>
          </div>
          <p class="text-18 pl-10">사진 및 동영상을 촬영 또는<br/>업로드 하여 하자를 검사 합니다</p>
        </li>
      </NuxtLink>
      <NuxtLink to="/qrlist">
        <li class="min-w-310 min-h-120 bg-[#93D07F] cursor-pointer hover:drop-shadow-xl text-[#FFFFFF] text-30 p-18">
          <div class="flex items-center mb-12">
            <img src="/assets/index_note.png" alt="logo" class="w-22 h-22 mr-17" />
            <h4 class="text-24">하자 현황</h4>
          </div>
          <p class="text-18 pl-10">하자 현황을 살펴보고 각 결과를<br />편집하며 보고서를 출력합니다.</p>
        </li>
      </NuxtLink>
      <NuxtLink v-if="user_id != null && isAdmin" to="/defect">
        <li class="min-w-310 min-h-120 bg-[#93D07F] cursor-pointer hover:drop-shadow-xl text-[#FFFFFF] text-30 p-18">
          <div class="flex items-center mb-12">
            <img src="/assets/index_setting.png" alt="logo" class="w-22 h-22 mr-17" />
            <h4 class="text-24">모델 관리</h4>
          </div>
          <p class="text-18 pl-10">하자 검사 AI 모델을 관리하는<br />관리자용 페이지입니다.</p>
        </li>
      </NuxtLink>
    </ul>
    <img src="/assets/kukto.png" alt="logo" class="w-297 h-73 mx-auto" />
  </main>
</template>
