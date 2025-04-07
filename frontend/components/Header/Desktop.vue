<script setup>
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { getUser } from "../../api/user";
import { useModalStore } from "../../stores/modal";
import { useUserStore } from "../../stores/user";

const userStore = useUserStore();
const { user_id, email, isAdmin } = storeToRefs(userStore);
const { setUser } = useUserStore();
const { setLoginModal, setSignUpModal, setLogoutModal } = useModalStore();

const handleClickLoginButton = () => {
  setLoginModal(true);
};

const handleClickSignupButton = () => {
  setSignUpModal(true);
};

const handleClickLogoutButton = () => {
  setLogoutModal(true);
};

onMounted(async () => {
  const user_id_local = localStorage.getItem("user_id");

  if (user_id === null && user_id_local !== null) {
    const res = await getUser(signedId).catch((err) => {
      (err);
    });

    if (res.status === 200) {
      setUser(res.data);
    }
  }
});
</script>
<template>
  <header class="min-w-1280 w-full min-h-70 px-50 pr-60 bg-[#fff] flex items-center justify-between border-b">
    <div class="flex items-center">
      <NuxtLink to="/" ><img src="/assets/logo.svg" alt="logo" /></NuxtLink>
      <nav class="ml-50 block">
        <ul class="flex gap-50">
          <li class="text-24 list-none cursor-pointer hover:text-[#93D07F]" ><NuxtLink to="/qr">QR 생성</NuxtLink></li>
          <li class="text-24 list-none cursor-pointer hover:text-[#93D07F]" ><NuxtLink to="/detectqr">하자 검사</NuxtLink></li>
          <li class="text-24 list-none cursor-pointer hover:text-[#93D07F]" ><NuxtLink to="/qrlist">하자 현황</NuxtLink></li>
          <li v-if="user_id !== null && isAdmin" class="text-24 list-none cursor-pointer hover:text-[#93D07F]" ><NuxtLink to="/admin/model">모델 관리</NuxtLink></li>
        </ul>
      </nav>
    </div>
    <div class="flex items-center">
      <span v-if="user_id !== null" class="text-20 mr-38 cursor-pointer hover:text-[#93D07F]" @click="handleClickLogoutButton">{{ email }}</span>
      <span v-if="user_id === null" class="text-20 mr-38 cursor-pointer hover:text-[#93D07F]" @click="handleClickLoginButton">로그인</span>
      <span v-if="user_id === null" class="text-20 mr-38 cursor-pointer hover:text-[#93D07F]" @click="handleClickSignupButton">회원가입</span>
    </div>
  </header>
</template>
<style></style>
